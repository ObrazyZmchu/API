const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {type: String, required: true},
    desc: {type: String, required: true},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    time: {type: Number, required: true},
    views: {type: Number, default: 0},
    pics: {type: Array, required: true},
    Rozmiar: {type: String, required: true},
    Kolor: {type: String, required: true},
    Wzór: {type: String, required: true},
});

module.exports = mongoose.model('Product', productSchema);