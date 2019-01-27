let express = require('express');
let router = express.Router();
const auth = require('../middleware').middlewareAuth;
/* GET users listing. */
router.get('/',require('../models/product').list);//auth,
router.all('/add',require('./admin').add);//auth,
router.all('/addProduct',require('../models/product').add);//auth,
router.all('/edit_news/:id',require('./admin').edit);//auth,
router.all('/deleteImg/:id',auth,require('./admin').deleteImg);
router.all('/delete_news/:id',auth,require('./admin').delete);

module.exports = router;
