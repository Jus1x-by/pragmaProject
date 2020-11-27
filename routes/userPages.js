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

router.get('/', (req, res) => {
    res.render('index', {
            categories: categoryCash,
            brands: brandsCash
        })    
});

router.get('/delivery', (req, res) => {
    res.render('delivery', {
            categories: categoryCash,
            brands: brandsCash
        })
});

router.get('/payment', (req, res) => {
    res.render('payment', {
        categories: categoryCash,
        brands: brandsCash
    })
})

router.get('/contacts', (req, res) => {
    res.render('contacts', {
            categories: categoryCash,
            brands: brandsCash
        })
})

router.get('/catalog', (req,res) => {
    Product.find( (err, products) => {
        if (err) console.log(err);
        res.render('catalog', {
            products: products,
            categories: categoryCash,
            brands: brandsCash
        })
    })
})


module.exports = router;