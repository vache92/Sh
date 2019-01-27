let formidable = require('formidable');
let fs = require('fs');
let wait = true;
let err_upload = false;
let path = require('path');
const dbo = require('../db').dbo;
const base64 = require('file-base64');
let Schema = dbo.Schema;
let newsSchema = new Schema({
    title: String,
    content: String,
    file: {data: Buffer, contentType: String },
});
const news = dbo.model('new', newsSchema);
exports.list = function (req, res) {
    news.find({}, function (err, result) {
        if (err) throw err;
        /*const socket = require('../bin/www').socket;
        socket.emit('news', {data: result});*/
        res.render("dashboard", {data: result});
    });
    /*dbo.collection("news").find({}).toArray((err, result) => {
        if (err) throw err;
        console.log(result);
        const socket = require('../bin/www').socket;
        socket.emit('news', {data: result});
        res.render("dashboard", {data: result});
    });*/
};
exports.edit = function (req, res) {
    let ObjectId = require('mongodb').ObjectId;
    let edit_id = new ObjectId(req.params.id);
    let query = {_id: edit_id};
    if (req.method === 'GET') {
        news.findOne(query, (err, result) => {
            if (err) throw err;
            // let buff = new Buffer(result.file.data, 'base64');
            console.log(result.file.data);
            fs.writeFileSync('parse.pdf', result.file.data);
            // let text = buff.toString('utf-8');
            const socket = require('../bin/www').socket;
            socket.emit('pageRefresh', {description: result.file.data});
            res.render("editNews", {data: result});
        });
    } else if (req.method === 'POST') {
        let error_obj = {};
        let err = false;
        let form = new formidable.IncomingForm();
        let data = null;
        // console.log(edit_id); res.end();return;
        form.parse(req, function (err, fields, files) {
            if (!fields.title) {
                error_obj.title = "Title required";
                err = true;
            }
            if (!fields.content) {
                error_obj.content = "Content required";
                err = true;
            }
            if (err) {
                res.render({error: error_obj});
            }
            if (files.upload.name) {
                let oldPath = files.upload.path;
                let ext = path.extname(files.upload.name);
                let newPath = path.join(__dirname, '../public');
                let file_name = Math.floor(Math.random() * 800 + 100) + new Date().getTime() + ext;
                newPath = newPath + '\\uploads\\' + file_name;
                fs.rename(oldPath, newPath, function (err) {
                    if (err) {
                        throw err;
                    }
                });
                data = {$set: {title: fields.title, content: fields.content, file: file_name}};
            } else {
                data = {$set: {title: fields.title, content: fields.content}};
            }
           news.updateOne(query, data, (err) => {
                if (err) throw err;
                const socket = require('../bin/www').socket;
                socket.emit('pageRefresh', {description: 'Please refresh your page'});
                res.redirect('/admin');
            });
        });
    }
};
exports.add = function (req, res) {

    if (req.method === 'GET') {

        res.render('addNews');
    } else if (req.method === 'POST') {
        let error_obj = {};
        let err = false;
        let file_name = null;
        let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (!fields.title) {
                error_obj.title = "Title required";
                err = true;
            }
            if (!fields.content) {
                error_obj.content = "Content required";
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
                let fileUpload = new news;
                fileUpload.title = fields.title;
                fileUpload.content =  fields.content;
                let file_encode = fs.readFileSync(oldPath);
                console.log(file_encode);
                fileUpload.file.data = file_encode;
               /* while (wait){
                    require('deasync').sleep(1);
                }*/
                // fileUpload.file.data = fs.readFileSync(oldPath,'utf8');
                fileUpload.file.contentType = ext;
                fileUpload.save(function (err) {
                    if (err) throw err;
                    const socket = require('../bin/www').socket;
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
            let data = {title: fields.title, content: fields.content};//, file: file_name
           /* news.insertMany(data, (err) => {
                if (err) throw err;

            });*/
        });
    }
};
exports.delete = function (req, res) {
    let ObjectId = require('mongodb').ObjectId;
    let edit_id = new ObjectId(req.params.id);
    let query = {_id: edit_id};
    news.findOne(query, (err, result) => {
        if (err) throw err;
        if (fs.existsSync('./public/uploads/' + result.file)) {
            try{
                fs.unlinkSync('./public/uploads/' + result.file);
            }catch (e) {//1543266521696

            }
        }
        news.remove(query, (err, photo) => {
            if (err) throw err;
           /* const socket = require('../bin/www').socket;
            socket.emit('pageRefresh', {description: 'Please refresh your page'});*/
            res.redirect('back');
            const socket = require('../bin/www').socket;
            socket.emit('pageRefresh', {description: 'Please refresh your page'});
        });
    });
};
exports.deleteImg = function (req, res) {
    if (fs.existsSync('./public/uploads/' + req.params.id)) {
        fs.unlinkSync('./public/uploads/' + req.params.id);
    }
    let query = {file: req.params.id};
    let data = {$set: {file: null}};
    news.updateOne(query, data, (err) => {
        if (err) throw err;
        // db.close();
        res.redirect('back');
    });
};

// module.exports.socketEmit = socketEmit;

