const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

path = __dirname.substring(0, 26);

const Product = require('../models/product');
const Category = require('../models/category');
const Brand = require('../models/brand');
const product = require('../models/product');

// GET product index

router.get('/', function (req, res) {
    let count;

    Product.count(function (err, c) {
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
    let description = "";
    let article = "";
    let stock = "";

    Category.find( (err, categories) =>{
        Brand.find( (err, brands) => {
            res.render('./admin_layuots/add_product', {
                title: title,
                price: price,
                season: season,
                description: description,
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

    // req.checkBody('image', 'You must upload an image').isImage(imageFile);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
    let imageFile = req.files.image;    
    let title = req.body.title;
    let description = req.body.description;
    let article = req.body.article;
    let sex = req.body.sex;
    let price = req.body.price;
    let season = req.body.season;
    let category = req.body.category;
    let brand = req.body.brand;

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
                    description: description,
                    article: article,
                    sex: sex,
                    price: price,
                    season: season,
                    category: category,
                    stock: 0,
                    brand: brand,
                    image: imageFile.name
                });
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
                        var productImage = req.files.image;

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