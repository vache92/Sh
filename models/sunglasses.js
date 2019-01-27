let fs = require('fs');
let path = require('path');
const db = require('../db').dbo;
const formidable = require('formidable');
let productSchema = require('./product').productSchema;
 const products = db.model('products', productSchema);
exports.list = function (req, res) {
    products.find({productType:'sunglasses'}, function (err, result) {
        if (err) throw err;

        res.render("sunglasses", {data: result});
    });
};
    /*const socket = require('../bin/www').socket;
    console.log(socket);*/
exports.sunglassesColor = function(socket){
    socket.on('sunglassesColor', (filters)=>{
        console.log(filters);//return;
        if(filters.colors.length){
            products.find({productType:'sunglasses', price:{$gt: filters.price.vl, $lte: filters.price.vu },productColor: { $in: filters.colors }}, function (err, result) {
                if (err) throw err;

                socket.emit('sunglassesColor',{result});
            });
        }else{
            products.find({productType:'sunglasses', price:{$gt: filters.price.vl, $lte: filters.price.vu }}, function (err, result) {
                if (err) throw err;

                socket.emit('sunglassesColor',{result});
            });
        }
    });
};

