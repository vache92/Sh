let error_obj = {};
let email_validator = require("email-validator");
const db = require('../db').dbo;
const userSchema = require('../db').userSchema;
const user = db.model('user', userSchema, 'user');
exports.get = function (req, res) {

    error_obj = {};
    res.render("register", {error: error_obj});
};
exports.post = function (req, res) {
    error_obj = {};
    let err = false;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let confirmation = req.body.confirmation;
    console.log(req.body);
    if (!name) {
        error_obj.name = "Name is required";
        err = true;
    }
    if (!password) {
        error_obj.password = "Password  is required and should be more 6 letters";
        err = true;

    } else if (password.length < 6) {
        error_obj.password = "Password  is required and should be more 6 letters";
        err = true;
    }

    if (!confirmation || (password !== confirmation)) {
        error_obj.confirmation = "This field should be same as Password";
        err = true;
    }
    if (!email) {
        error_obj.email = "This required  should be valid email address";
        err = true;
    } else if (!email_validator.validate(email)) {
        error_obj.email = "This required  should be valid email address";
        err = true;
    }

    if (err) {
        res.render("register", {error: error_obj});
    }

    let data = {name: name, email: email, password: password};

    user.insertMany(data, (err, result) => {
        if (err) throw err;
        console.log("Record inserted successfully");
        res.redirect('/login');
    });

};
