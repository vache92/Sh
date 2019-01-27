const db = require('../db').dbo;
const userSchema = require('../db').userSchema;

const user = db.model('user',userSchema,'user');//The third argument there is the collection name to be used rather than what will be determined based on the model name.
exports.get = function (req, res) {

    res.render('login',{error:""});
};
exports.post = function (req, res) {
    user.findOne({email:req.body.email}, function(err, result){
        if (err) throw err;
        if(result){
            if(result.password === req.body.password){
                req.session.user = result._id;
                res.redirect('/admin');
            }else{
                res.render('login',{wrong:"Incorrect password"});
            }
        }else{
            console.log(result);
            res.render('login',{notUser:"User not found"});
        }
    });
};