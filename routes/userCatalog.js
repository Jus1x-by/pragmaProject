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
    Product.find( (err, products) => {
        if (err) console.log(err)
        res.render('catalog', {
            products:products,
            brands: brandsCash,
            categories: categoryCash
        })
    })
    
})


module.exports = router;