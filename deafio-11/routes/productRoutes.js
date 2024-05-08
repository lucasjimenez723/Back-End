const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/productMongoDAO.js');

const ProductController = require('../controllers/productControllers.js');


const productManager = new ProductManager();


router.get('/', ProductController.getProducts )


router.get('/products',  ProductController.getProductsAvailable );


router.get('/:id', ProductController.getProductById );


router.post('/',ProductController.createProduct );


router.put('/:id', ProductController.updateProduct);



router.delete('/:id', ProductController.deleteProduct);


module.exports = router;