const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const expressValidation = require("express-validator");
const fileUpload = require('express-fileupload');
const passport = require('passport')

const config = require('./config/database');

//Подключение к БД
mongoose.connect(config.database, {
  useUnifiedTopology: true
}).then(() => console.log('MongoDB has started ...'))
  .catch(e => console.log('MongoDB crashed'));

//Настройки движка "вьюшек"
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Указание паблик папки
app.use(express.static(path.join(__dirname, 'public')));

// Обозначаем ошибки глобально
app.locals.errors = null;

// express fileUpload
app.use(fileUpload());

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(
  expressSession({
    secret: "somethingSecret",
    saveUninitialized: true,
    resave: true,
  })
);

// Passport
require('./config/passport.js')(passport)

app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req,res,next) => {
   res.locals.cart = req.session.cart;
   res.locals.user = req.user || null;
   next();
});

app.use(expressValidation());

// Вывод сообщений
app.use(require('connect-flash')());
app.use( (req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// настройка путей
const adminCategories = require('./routes/adminCategory.js');
const adminBrands = require('./routes/adminBrands.js');
const adminProducts = require('./routes/adminProducts.js');
const userPages = require('./routes/userPages.js');
const userCatalog = require('./routes/userCatalog.js');
const users = require('./routes/users.js');
const cart = require('./routes/cart.js');


app.use('/cart', cart);
app.use('/users', users);
app.use('/admin/categories', adminCategories);
app.use('/admin/brands', adminBrands);
app.use('/admin/products', adminProducts);
app.use('/', userPages);
app.use('/catalog', userCatalog);



// Запуск сервера
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server started on port:  ', PORT)
})