const Router = require('express').Router;
const productRouter=Router()
const ProductController = require('../controller/product.controller');
const { isAdmin } = require('../middlewares/roleAuth');



productRouter.get('/mockingproducts', ProductController.mockProducts)

productRouter.get('/loggerTest', ProductController.loggerTest)

// METODO GET PARA OBTENER LOS PRODUCTOS
productRouter.get('/', ProductController.getAllProducts);

productRouter.get('/:id', ProductController.getProductById);


// SOLO LOS ADMINS TIENEN PERMISO DE AGREGAR, MODIFICAR O ELIMINAR PRODUCTOS

// METODO POST PARA AGREGAR UN PRODUCTO NUEVO
productRouter.post('/', isAdmin, ProductController.createProduct);

// METODO PUT PARA CAMBIAR UN PRODUCTO
productRouter.put('/:id', isAdmin, ProductController.updateProduct);

// METODO DELETE PARA ELIMINAR UN PRODUCTO
productRouter.delete('/:id', isAdmin, ProductController.deleteProduct);


module.exports = productRouter;