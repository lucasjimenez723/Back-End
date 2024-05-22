const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');
const ProductManager = require('../dao/productMongoDAO.js');

const ProductController = require('../controllers/productControllers.js');


const productManager = new ProductManager();


router.get('/',auth('administrador'), ProductController.getProducts )

router.get('/products',auth('administrador'),  ProductController.getProductsAvailable );

router.get('/:id',auth('administrador'), ProductController.getProductById );

router.post('/', auth('administrador'),ProductController.createProduct );

router.put('/:id',auth('administrador'), ProductController.updateProduct);

router.delete('/:id',auth('administrador'), ProductController.deleteProduct);


module.exports = router;