const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

const Product = require('../models/product');
const Category = require('../models/category');
const Brand = require('../models/brand');

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
                categories: categories
            });
        })
    });
});

router.post('/add-product', (req, res) => {

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
                res.send('Есть такой товар');
                // res.render('./admin_layuots/add_product', {
                //     title:title
                // });
            }
            else {
                let product = new Product({
                    title:title,
                    description:description,
                    article:article,
                    sex:sex,
                    price:price,
                    season:season,
                    category:category,
                    stock: 0,
                    brand: brand
                });
                product.save( (err) => {
                    if (err) console.log(err);
                });
                res.redirect('/admin/products');
            }
        });
    }

});

module.exports = router;