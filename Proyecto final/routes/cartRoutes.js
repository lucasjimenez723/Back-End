const Router = require('express').Router;
const cartRouter=Router()
const CartController = require('../controller/cart.controller');
const { isUser } = require('../middlewares/roleAuth');



cartRouter.get('/', CartController.getAllCarts);

// Ruta POST para crear un nuevo carrito
cartRouter.post('/', CartController.createCart);


// RUTA GET PARA CONSEGUIR EL CARRITO POR ID 
cartRouter.get('/:id', CartController.getCartById);

// Ruta POST para agregar un producto al carrito (SOLO USUARIOS PUEDEN HACER ESTO)
cartRouter.post('/:id/products', isUser, CartController.addProductToCart);

// Ruta DELETE para eliminar un producto del carrito

cartRouter.delete('/:cartId/products/:productId', CartController.removeProductFromCart);

cartRouter.put('/:cartId/products/:productId', CartController.updateProductQuantity);

cartRouter.delete('/:cartId', CartController.removeAllProductsFromCart);

cartRouter.post('/:cartId/purchase', isUser, CartController.purchaseCart);

module.exports = cartRouter;