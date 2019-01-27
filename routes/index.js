let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', require('../models/showProduct').list);
router.get('/home', require('../models/showProduct').list);
router.get('/home-02', function (req,res) {
    res.render('home-02');
});
router.get('/home-03', function (req,res) {
    res.render('home-03');
});
router.get('/product', function (req,res) {
    res.render('product');
});
router.get('/cart', function (req,res) {
    res.render('cart');
});
router.get('/blog', function (req,res) {
    res.render('blog');
});
router.get('/blog-detail', function (req,res) {
    res.render('blog-detail');
});
router.get('/about', function (req,res) {
    res.render('about');
});
router.get('/contact', function (req,res) {
    res.render('contact');
});
router.get('/dresses', function (req,res) {
    res.render('dresses');
});
router.get('/watches', function (req,res) {
    res.render('watches');
});
router.get('/bags', function (req,res) {
    res.render('bags');
});
router.get('/sunglasses',require('../models/sunglasses').list);
router.get('/footwear', function (req,res) {
    res.render('footwear');
});
router.get('/login', require('./login').get);
router.post('/login', require('./login').post);
router.get('/register', require('./register').get);
router.post('/register', require('./register').post);

module.exports = router;
