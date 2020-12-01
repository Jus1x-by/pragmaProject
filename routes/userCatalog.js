const express = require('express');
const router = express.Router();

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

module.exports = router;