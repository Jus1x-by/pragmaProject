const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
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

// Регистрация

router.get('/register', (req, res) =>{

    res.render('./user_layuots/register', {
        title: "Регистрация",
        categories: categoryCash,
        brands: brandsCash,
        error: ""
    })

});

router.post('/register', (req, res) => {

    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('email', 'Почта обязательна!').isEmail();
    req.checkBody('password', 'Пароль обязателен!').notEmpty();
    req.checkBody('password2', 'Пароли не совпадают!').equals(password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('./user_layuots/register', {
            errors: errors,
            user: null,
            categories: categoryCash,
            brands: brandsCash,
            title: 'Регистрация'
        });
    } else {
        User.findOne({email: email}, (err, user) => {
            if (err)
                console.log(err);

            if (user) {
                res.redirect('/users/register');
            } else {
                let user = new User({
                    email: email,
                    password: password,
                    admin: 0
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err)
                            console.log(err);

                        user.password = hash;

                        user.save( (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                res.redirect('/users/login')
                            }
                        });
                    });
                });
            }
        });
    }

});


// Авторизация

router.get('/login', (req, res) => {

    if (res.locals.user) res.redirect('/');
    
    res.render('./user_layuots/login', {
        title: 'Авторизация',
        brands: brandsCash,
        categories:categoryCash,
        error: ""
    });

});

router.post('/login', (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
    })(req, res, next);
    
});

router.get('/logout', (req, res) => {

    req.logout();
    
    res.redirect('/users/login');

});

module.exports = router;