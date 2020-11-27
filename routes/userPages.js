const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
    res.render('index');    
});

router.get('/delivery', function(req, res){
    res.render('delivery');
});

router.get('/payment', function(req, res){
    res.render('payment');
})

router.get('/contacts', function(req,res){
    res.render('contacts');
})

router.get('/catalog', function(req,res){
    res.render('catalog');
})


module.exports = router;