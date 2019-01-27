let fs = require('fs');
let path = require('path');
const db = require('../db').dbo;
const formidable = require('formidable');
let productSchema = require('./product').productSchema;
 const products = db.model('products', productSchema);
exports.list = function (req, res) {
    products.find({}, function (err, result) {
        if (err) throw err;
        res.render("index", {data: result});
    });
};

