const express = require('express')
const router = express.Router()

const User = require('../models/user')


// Регистрация

router.get('/', (req, res) => {
    res.render('./user_layuots/register');
})

router.get('/register', (req, res) =>{

    res.render('./user_layuots/register', {
        title: "Регистрация"
    })

})

router.post('/register', (req, res) => {



})

// Авторизация

router.get('/login', (req, res) => {

    res.render('./user_layuots/login', {
        title: "Авторизация"
    })

})