const express = require('express');
const router = express.Router();

const Category = require('../models/category');
const Brand = require('../models/brand');

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
            brands: brandsCash,
            cart: req.session.cart || "undefined"
        })    
});

router.get('/delivery', (req, res) => {
    res.render('delivery', {
            categories: categoryCash,
            brands: brandsCash,
            cart: req.session.cart || "undefined"
        })
});

router.get('/payment', (req, res) => {
    res.render('payment', {
        categories: categoryCash,
        brands: brandsCash,
        cart: req.session.cart || "undefined"
    })
})

router.get('/contacts', (req, res) => {
    res.render('contacts', {
            categories: categoryCash,
            brands: brandsCash,
            cart: req.session.cart || "undefined"
        })
})

module.exports = router;