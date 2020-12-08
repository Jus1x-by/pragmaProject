const express = require('express');
const router = express.Router();
const fs = require('fs-extra')


const Category = require('../models/category');
const Brand = require('../models/brand');
const Product = require('../models/product');
const product = require('../models/product');

let categoryCash = Category.find( (err, categories) =>{
    if (err) console.log(err);
    categoryCash = categories;
})

let brandsCash = Brand.find ( (err, brands) => {
    if (err) console.log(err);
    brandsCash = brands;
})

/*

            CATALOG GET

*/
router.get('/', (req, res) => {
    Product.find( (err, products) => {
        if (err) console.log(err)
        res.render('catalog', {
            products:products,
            brands: brandsCash,
            categories: categoryCash,
            cart: req.session.cart || "undefined"
        })
    })
    
})

/*

            CATALOG/MEN GET

*/
router.get('/men', (req, res) => {

    Product.find( (err, products) => {
        if (err) console.log(err)
        res.render('./user_layuots/mencatalog', {
            products: products,
            brands: brandsCash,
            categories: categoryCash,
            cart: req.session.cart || "undefined"
        })
    })
    
})

router.get('/women', (req, res) => {

    Product.find( (err, products) => {
        if (err) console.log(err)
        res.render('./user_layuots/womencatalog', {
            products: products,
            brands: brandsCash,
            categories: categoryCash,
            cart: req.session.cart || "undefined"
        })
    })
    
})



router.get('/brands/:brand', (req, res) => {

    let brand = req.params.brand

    Product.find({brand: brand}, (err, products) => {
        if (err) console.log(err)

        res.render('./user_layuots/brand', {
            products: products,
            brands: brandsCash,
            categories: categoryCash,
            cart: req.session.cart || "undefined"
        })
    })
})



router.get('/categories/:category', (req, res) => {

    let category = req.params.category

    Product.find({category: category}, (err, products) => {
        if (err) console.log(err)

        res.render('./user_layuots/brand', {
            products: products,
            brands: brandsCash,
            categories: categoryCash,
            cart: req.session.cart || "undefined"
        })
    })
})

router.get('/product/:id', (req,res) => {

    let productID = req.params.id;

    Product.findById( productID, (err, product) =>{
        if(err) return console.log(err);
        
        let galleryDir = __dirname.substring(0, 26) + '/public/product_images/' + productID + '/gallery';
        let categoryProduct = "";

        categoryCash.forEach(cat => {
            if (cat.slug == product.category){
                categoryProduct = cat.title;
            }
        });

        fs.readdir(galleryDir, (err, files) => {
            res.render('product', {
                brand: product.brand,
                price: product.price,
                article: product.article,
                title: product.title,
                category: categoryProduct,
                sex: product.sex,
                stock: product.stock,
                image: product.image,
                galleryImages: files,
                id: product._id,
                categories: categoryCash,
                brands: brandsCash,
                cart: req.session.cart || "undefined"
            })
        })
    })

})

module.exports = router;