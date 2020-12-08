const express = require('express');
const router = express.Router();
const tr = require('transliteration')


// Get Category model
const Category = require('../models/category');

/*
 * GET category index
 */
router.get('/', (req, res) => {
    Category.find( (err, categories) => {
        if (err) return console.log(err);
        res.render('./admin_layuots/categories', {
            categories: categories
        });
    });
});

/*
 * GET add category
 */
router.get('/add-category', (req, res) => {

    let title = "";

    res.render('./admin_layuots/add_category', {
        title: title
    });

});

/*
 * POST add category
 */

router.post('/add-category', (req, res) => {
    
    let title = req.body.title;
    let tmp = tr.slugify(title);
    let slug = tr.transliterate(tmp);

    const errors = req.validationErrors();

    if(errors){
        res.render('./admin_layuots/categories', {
            errors: errors,
            title: title
        })
    } else {
        Category.findOne({slug: slug}, (category) => {
            if (category) {
                res.render('./admin_layuots/add_category', {
                    title:title
                });
            } else {
                let category = new Category({
                    slug: slug,
                    title: title
                });
                category.save(function (err){
                    if (err) return console.log(err);
                });
                res.redirect('/admin/categories');
            }
        })
    }

});

/*
    Get edit category
*/

router.get('/edit-category/:id', (req,res) => {

    Category.findById(req.params.id, (err, category) => {
        if(err) return console.log(err);

        res.render('./admin_layuots/edit_category', {
            title: category.title,
            id: category._id
        });
    });

});

/*
    POST edit category
*/ 

router.post('/edit-category/:id', (req, res) => {
  
    let title = req.body.title;
    let tmp = tr.slugify(title);
    let slug = tr.transliterate(tmp);
    let id = req.params.id;

    const errors = req.validationErrors();

    if(errors){
        res.render('./admin_layuots/edit_categories', {
            errors: errors,
            title: title,
            id: id
        })
    }
    else {
        Category.findOne({slug: slug, _id : { '$ne' : id} }, (err, category) => {
            if (category) {
                res.render('./admin_layuots/edit_category', {
                    title: title,
                    id: id
                });
            } else {
                Category.findById(id, (req, category) => {
                    category.title = title;
                    category.slug = slug;
                    category.save( (err) => {
                        if (err) return console.log(err);
                    });
                    res.redirect('/admin/categories/');
                });
            }
        });
    }

});

/*
    GET delete category
*/

router.get('/delete-category/:id', (req,res) => {

    Category.findByIdAndRemove(req.params.id, (err, category) => {
        if(err) return console.log(err);

        res.redirect('/admin/categories/');
    });

});

module.exports = router;