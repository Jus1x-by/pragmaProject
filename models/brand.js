const mongoose = require('mongoose');

const BrandSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});

const Brand = module.exports = mongoose.model('Brand', BrandSchema);
