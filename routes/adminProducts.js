const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

path = __dirname.substring(0, 26);

const Product = require('../models/product');
const Category = require('../models/category');
const Brand = require('../models/brand');


// GET product index

router.get('/', (req, res) => {
    let count;

    Product.count( (err, c) => {
        count = c;
    });

    Product.find((err, products) => { 
        if (err) return console.log(err);
        res.render('./admin_layuots/products', {
            products: products,
            count: count
        }); 
    });
});

/* 
    GET add product
*/

router.get('/add-product', (req,res) =>{
    // brand

    let title = "";
    let price = "";
    let season = "";
    let sex = "";
    let article = "";
    let stock = "";

    Category.find( (err, categories) =>{
        Brand.find( (err, brands) => {
            res.render('./admin_layuots/add_product', {
                title: title,
                price: price,
                season: season,
                brands: brands,
                article: article,
                stock: stock,
                sex: sex,
                categories: categories,
            });
        })
    });
});

router.post('/add-product', (req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
    let imageFile = req.files.image;    
    let title = req.body.title;
    let article = req.body.article;
    let sex = req.body.sex;
    let price = req.body.price;
    let season = req.body.season;
    let category = req.body.category;
    let brand = req.body.brand;
    let stock = req.body.stock;

    const errors = req.validationErrors();

    if(errors){
        res.render('./admin_layuots/products', {
            errors:errors,
        });
    } else {
        Product.findOne({title:title}, (product) => {
            if (product){
                res.render('./admin_layuots/add_product', {
                    title:title
                });
            }
            else {
                let product = new Product({
                    title: title,
                    article: article,
                    sex: sex,
                    price: price,
                    season: season,
                    category: category,
                    stock: stock,
                    brand: brand,
                    image: imageFile.name
                });
                console.log(imageFile.name);
                product.save( (err) => {
                    if (err)
                        return console.log(err);

                    mkdirp(path + '/public/product_images/'+product._id).then((err) => {
                        if (imageFile != ""){
                            let productImage = req.files.image;

                            productImage.mv(path + '/public/product_images/' + product._id + '/' + productImage.name, (err) => {
                                return console.log(err);
                            })
                        }
                        return console.log(err);
                    });

                    mkdirp(path + '/public/product_images/' + product._id + '/gallery').then((err) => {
                        return console.log(err);
                    });

                    mkdirp(path + '/public/product_images/' + product._id + '/gallery/thumbs').then((err) => {
                        return console.log(err);
                    });

                    if (imageFile != "") {
                        let productImage = req.files.image;

                        productImage.mv('/public/product_images/' + product._id + '/' + imageFile.name,  (err) => {
                            return console.log(err);
                        });
                    }

                    res.redirect('/admin/products');
                })
            }
        });
    }

});

// 
// GET edit product
// 

router.get('/edit-product/:id', (req, res) => {

    Category.find( (err, categories) => {
        Brand.find ( (err, brands) => {
            Product.findById(req.params.id, (err, prod) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/products');
                } else {
                    let galleryDir = path + '/public/product_images/' + prod._id + '/gallery';
                    let galleryImages = null;
    
                    fs.readdir(galleryDir, (err, files) => {
                        if (err) {
                            console.log(err);
                        } else {
                            galleryImages = files;
    
                            res.render('./admin_layuots/edit_product', {
                                title: prod.title,
                                price: prod.price,
                                season: prod.season,
                                article: prod.article,
                                stock: prod.stock,
                                sex: prod.sex,
                                brand: prod.brand,
                                brands: brands,
                                categories: categories,
                                category: prod.category.replace(/\s+/g, '-').toLowerCase(),
                                price: prod.parse,
                                image: prod.image,
                                galleryImages: galleryImages,
                                id: prod._id
                            });
                        }
                    });
                }
            });
        })

    })

})

router.post('/edit-product/:id', function (req, res) {

    let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();
    let price = req.body.price;
    let category = req.body.category;
    let pimage = req.body.pimage;
    let id = req.params.id;

    let errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/' + id);
    } else {
        Product.findOne({slug: slug, _id: {'$ne': id}}, (err, p) => {
            if (err)
                console.log(err);

            if (p) {
                res.redirect('/admin/products/edit-product/' + id);
            } else {
                Product.findById(id, (err, p) => {
                    if (err)
                        console.log(err);

                    p.title = title;
                    p.slug = slug;
                    p.price = price
                    p.category = category;
                    if (imageFile != "") {
                        p.image = imageFile;
                    }

                    p.save( (err) => {
                        if (err)
                            console.log(err);

                        if (imageFile != "") {
                            if (pimage != "") {
                                fs.remove('public/product_images/' + id + '/' + pimage, (err) => {
                                    if (err)
                                        console.log(err);
                                });
                            }

                            let productImage = req.files.image;
                            let currentPath = 'public/product_images/' + id + '/' + imageFile;

                            productImage.mv(currentPath, (err) => {
                                return console.log(err);
                            });

                        }

                        res.redirect('/admin/products/edit-product/' + id);
                    });

                });
            }
        });
    }

});


router.post('/product-gallery/:id', (req, res) => {

    let productImage = req.files.file;
    let id = req.params.id;
    let galleryDir = path + '/public/product_images/' + id + '/gallery/' + req.files.file.name;
    console.log(galleryDir);
    let thumbsPath = path + '/public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;

    productImage.mv(galleryDir, (err) => {
        if (err)
            console.log(err);

        fs.readFileSync(galleryDir, (buf) => {
            fs.writeFileSync(thumbsPath, buf)
        })
    })

    res.sendStatus(200);

});

/*
 * GET delete image
 */
router.get('/delete-image/:image', (req, res) => {

    let originalImage = path + '/public/product_images/' + req.query.id + '/gallery/' + req.params.image;
    let thumbImage = path + '/public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;

    fs.remove(originalImage, (err) => {
        if (err) {
            console.log(err);
        } else {
            fs.remove(thumbImage, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/admin/products/edit-product/' + req.query.id);
                }
            });
        }
    });
});

/*
 * POST edit product
 */
router.post('/edit-product/:id', (req, res) => {

    Category.find( (err, categories) =>{
        if (err) {
            console.log(err);
            res.redirect('/admin/products');
        }
        Brand.find( (err, brands) => {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            }
            Product.findById(req.params.id, (err, prod) => {
                if (err) console.log(err);

                res.render('./admin_layuots/edit_product', {
                    title: prod.title,
                    price: prod.price,
                    season: prod.season,
                    article: prod.article,
                    stock: prod.stock,
                    sex: prod.sex,
                    brands: brands,
                    categories: categories,
                });
            })
        })
    });

})





/*
    GET delete product
*/

router.get('/delete-product/:id', (req, res) => {

    let id = req.params.id;
    let pathRm = path + '/public/product_images/' + id;

    fs.remove(pathRm, (err) => {
        if (err) {
            console.log(err);
        } else {
            Product.findByIdAndDelete(id, (err) => {
                console.log(err);
            });
            
            res.redirect('/admin/products');
        }
    });

});

module.exports = router;