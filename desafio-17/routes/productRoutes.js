const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ProductController = require('../controllers/productControllers');

// Obtener todos los productos
router.get('/', auth('premium', 'admin'), ProductController.getProducts);

// Obtener productos disponibles
router.get('/products', auth('premium', 'admin'), ProductController.getProductsAvailable);

// Obtener un producto por ID
router.get('/:id', auth('premium', 'admin'), ProductController.getProductById);

// Crear un nuevo producto
router.post('/', auth('premium', 'admin'), ProductController.createProduct);

// Actualizar un producto por ID
router.put('/:id', auth('premium', 'admin'), ProductController.updateProduct);

// Eliminar un producto por ID
router.delete('/:id', auth('premium', 'admin'), ProductController.deleteProduct);

module.exports = router;