const express = require('express');
const router = express.Router();
const tr = require('transliteration');

// Get Brand model
const Brand = require('../models/brand');

// Get Brand index
router.get('/', (req, res) => {
    Brand.find( (err, brands) => {
        if (err) console.log(err);
        res.render('./admin_layuots/brands', {
            brands:brands
        })
    })
})

// Get ADD brand
router.get('/add-brand', (req, res) => {

    let title = "";

    res.render('./admin_layuots/add_brand', {
        title:title
    })

})

// Post ADD brand
router.post('/add-brand', (req, res) => {

    let title = req.body.title;
    let tmp = tr.slugify(title);
    let slug = tr.transliterate(tmp);

    const errors = req.validationErrors();

    if(errors) {
        res.render('./admin_layuots/brands', {
            errors: errors,
            title:title
        })
    } else {
        Brand.findOne({slug:slug}, (brand) => {
            if (brand) {
                res.render('./admin_layuots/add_brand', {
                    title:title
                })
            } else {
                let brand = new Brand({
                    title: title,
                    slug: slug
                })
                brand.save( (err) => {
                    if (err) console.log(err);
                })
                res.redirect('/admin/brands');
            }
        })
    }

})

// Get EDIT brand
router.get('/edit-brand/:id', (req, res) => {

    Brand.findById(req.params.id, (err, brand) => {
        if(err) return console.log(err);

        res.render('./admin_layuots/edit_brand', {
            title: brand.title,
            id: brand._id
        })
    })

})

// Post EDIT brand
router.post('/edit-brand/:id', (req,res) => {

    let title = req.body.title;
    let tmp = tr.slugify(title);
    let slug = tr.transliterate(tmp);
    let id = req.params.id;

    const errors = req.validationErrors();

    if(errors) {
        res.render('./admin_layuots/edit_brands', {
            errors:errors,
            title:title,
            id:id
        })
    } else {

        Brand.findOne({slug:slug, _id : { '$ne' : id }}, (err, brand) => {
            if(brand) {
                res.render('./admin_layuots/edit_brands', {
                    title:title,
                    id:id
                })
            } else {

                Brand.findById(id, (req, brand) => {
                    brand.title = title;
                    brand.slug = slug;
                    brand.save( (err) => {
                        if(err) return console.log(err);
                    })
                    res.redirect('/admin/brands');
                })

            }
        })

    }
    
})

// Get DELETE brand
router.get('/delete-brand/:id', (req, res) => { 
    Brand.findByIdAndDelete(req.params.id, (err, brand) =>{
        if(err) return console.log(err);

        res.redirect('/admin/brands');
    })
})

module.exports = router;