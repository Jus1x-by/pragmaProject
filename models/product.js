const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sizes: {
        type: [Number],
        required: true,
    },
    stock: {
        type: Number,
        required: true
    },
    season: {
        type: String,
        required: false
    },
    sex: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);