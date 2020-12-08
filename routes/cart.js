const express = require('express');
const router = express.Router();

const Product = require('../models/product');


/*
    CART ADD PRODUCT
*/

router.get('/add/:id', (req, res) => {

    let idProduct = req.params.id;

    Product.findById(idProduct, (err, product) => {
        if (err) console.log(err);

        if(typeof req.session.cart == "undefined"){
            req.session.cart = []
            req.session.cart.push({
                id: idProduct,
                title: product.title,
                price: product.price,
                brand: product.brand,
                qty: 1,
                image: '/product_images/' + product._id + '/' + product.image
            })
        } else {
            let cart = req.session.cart
            let newItem = true

            for (let i = 0; i < cart.length; i++) {
                if(cart[i].id == product._id){
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if(newItem){
                cart.push({
                    id: idProduct,
                    brand: product.brand,
                    title: product.title,
                    price: product.price,
                    qty: 1,
                    image: '/product_images/' + product._id + '/' + product.image
                })
            }
        }

        res.redirect('back');
    })
})

router.get('/flush', (req, res) => {

    delete req.session.cart;

    res.redirect('/');

})


module.exports = router;