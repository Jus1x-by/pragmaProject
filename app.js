const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const expressValidation = require("express-validator");
const fileUpload = require('express-fileupload');

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
    saveUninitialized: false,
    resave: false,
  })
);


app.use(expressValidation({
  errorFormatter: function (param, msg, value) {
      var namespace = param.split('.')
              , root = namespace.shift()
              , formParam = root;

      while (namespace.length) {
          formParam += '[' + namespace.shift() + ']';
      }
      return {
          param: formParam,
          msg: msg,
          value: value
      };
  },
  customValidators: {
      isImage: function (value, filename) {
          var extension = (path.extname(filename)).toLowerCase();
          switch (extension) {
              case '.jpg':
                  return '.jpg';
              case '.jpeg':
                  return '.jpeg';
              case '.png':
                  return '.png';
              case '':
                  return '.jpg';
              default:
                  return false;
          }
      }
  }
}));

// Вывод сообщений
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// настройка путей
const userPages = require('./routes/userPages.js');
const adminCategories = require('./routes/adminCategory.js');
const adminProducts = require('./routes/adminProducts.js');
const adminBrands = require('./routes/adminBrands');

app.use('/admin/brands', adminBrands);
app.use('/admin/products', adminProducts);
app.use('/admin/categories', adminCategories);
app.use('/', userPages);

// Запуск сервера
const port = 3000;
app.listen(port, function() {
    console.log('Server started on port ' + port);
});