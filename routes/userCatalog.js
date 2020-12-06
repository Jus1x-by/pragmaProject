const express = require('express');
const router = express.Router();
const fs = require('fs-extra')


const Category = require('../models/category');
const Brand = require('../models/brand');
const Product = require('../models/product');

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
            categories: categoryCash
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
            categories: categoryCash
        })
    })
    
})

router.get('/women', (req, res) => {

    Product.find( (err, products) => {
        if (err) console.log(err)
        res.render('./user_layuots/womencatalog', {
            products: products,
            brands: brandsCash,
            categories: categoryCash
        })
    })
    
})

/*
    SORTED BY BRANDS
*/


router.get('/brands/:brand', (req, res) => {

    let brand = req.params.brand

    Product.find( (err, products) =>{
        if (err) return console.log(err)

        res.render('./user_layuots/brand', {
            cond: brand,
            products: products,
            brands: brandsCash,
            categories: categoryCash
        })
    })

})


/*
    SORTED BY CATEGORIES
*/


router.get('/categories/:category', (req, res) => {

    let cat = req.params.category

    Product.find( (err, products) =>{
        if (err) return console.log(err)

        res.render('./user_layuots/category', {
            cond: cat,
            products: products,
            brands: brandsCash,
            categories: categoryCash
        })
    } )

})



router.get('/product/:id', (req,res) => {

    let productID = req.params.id;

    Product.findById( productID, (err, product) =>{
        if(err) return console.log(err);
        
        let galleryDir = __dirname.substring(0, 26) + '/public/product_images/' + productID + '/gallery';

        fs.readdir(galleryDir, (err, files) => {
            res.render('product', {
                brand: product.brand,
                price: product.price,
                article: product.article,
                title: product.title,
                category: product.category,
                sex: product.sex,
                stock: product.stock,
                image: product.image,
                galleryImages: files,
                id: product._id,
                categories: categoryCash,
                brands: brandsCash
            })
        })
    })

})

module.exports = router;