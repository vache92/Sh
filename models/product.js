let fs = require('fs');
let path = require('path');
const db = require('../db').dbo;
const formidable = require('formidable');
let Schema = db.Schema;
let productSchema = new Schema({
    id: {
        type: Number,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: String,
        allowNull: false
    },
    desc: {
        type: String,
        allowNull: true
    },
    file: {
        photo: {
            type: Object,
            allowNull: false
        },
        extName:{
            type: String,
            allowNull: false
        }
    },
    price: {
        type: Number,
        allowNull: false
    },
    productType: {
        type: String,
        allowNull: false
    },
    productCategory: {
        type: String,
        allowNull: false
    },
    productColor: {
        type: String,
        allowNull: false
    },
    created: {
        type: Date,
        allowNull: true
    },
    updated: {
        type: Date,
        allowNull: true
    }
});
const products = db.model('products', productSchema);
exports.list = function (req, res) {
    products.find({}, function (err, result) {
        if (err) throw err;

        res.render("dashboard", {data: result});
    });
};
exports.add = function (req, res) {

    if (req.method === 'GET') {

        res.render('addProduct');
    } else if (req.method === 'POST') {
        let error_obj = {};
        let err = false;
        let file_name = null;
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (!fields.name) {
                error_obj.name = "Name required";
                err = true;
            }
            if (!fields.desc) {
                error_obj.desc = "Desc required";
                err = true;
            }
            if (!fields.price) {
                error_obj.price = "Price required";
                err = true;
            }
            if (!fields.productType) {
                error_obj.productType = "Product type required";
                err = true;
            }
            if (!fields.productCategory) {
                error_obj.productCategory = "Product category required";
                err = true;
            }
            if (!fields.productColor) {
                error_obj.productColor = "Product color required";
                err = true;
            }
            if (!files.upload.name) {
                error_obj.upload = "Image required";
                err = true;
            }
            if (err) {
                res.render({error: error_obj});
            }
            if (files.upload.name) {
                let wait = true;
                let oldPath = files.upload.path;
                let ext = path.extname(files.upload.name);
                let newPath = path.join(__dirname, '../public');
                // file_name = Math.floor(Math.random() * 800 + 100) + new Date().getTime() + ext;
                // newPath = newPath + '\\uploads\\' + file_name;
                let product = new products;
                product.name = fields.name;
                product.desc = fields.desc;
                product.price = fields.price;
                product.productType = fields.productType;
                product.productCategory = fields.productCategory;
                product.productColor = fields.productColor;
                let file_encode = fs.readFileSync(oldPath,'base64');
                console.log(file_encode);
                product.file.photo = file_encode;
                product.created = new Date();
                product.updated = new Date();
                /* while (wait){
                     require('deasync').sleep(1);
                 }*/
                // fileUpload.file.data = fs.readFileSync(oldPath,'utf8');
                product.file.extName = ext;
                product.save(function (err) {
                    if (err) throw err;
                    const socket = require('../bin/www').socket;
                    console.log(socket);
                    socket.emit('pageRefresh', {description: 'Please refresh your page'});
                    res.redirect('/admin');
                });
                // fs.rename(oldPath, newPath, function (err) {
                //     if (err) {
                //         throw err;
                //     }
                //     wait = false;
                // });
                // while (wait) {
                //     require('deasync').sleep(1);//<img src="/uploads/<%=data.file%>" style="width:150px; height:150px">
                // }
                // if (err_upload) {
                //     res.end("Upload error");
                // }
            }
            // let data = {title: fields.title, content: fields.content};//, file: file_name
            /* news.insertMany(data, (err) => {
                 if (err) throw err;

             });*/
        });
    }
};
exports.productSchema = productSchema;