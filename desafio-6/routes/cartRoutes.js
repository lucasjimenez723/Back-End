const express = require('express');
const router = express.Router();
const CartManager = require('../dao/FS/cart-manager.js');
const ProductManager = require('../dao/FS/product-manager.js'); 

const cartManager = new CartManager('carts.json'); 
const productManager = new ProductManager('products.json');

router.post('/', (req, res) => {
    const newCartId = cartManager.generateUniqueId();
    const newCart = {
        id: newCartId,
        products: []
    };

    cartManager.createCart(newCart);

    res.status(201).json({ message: 'Carrito creado correctamente', cart: newCart });
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        const products = cart.products.map(productId => productManager.getProductById(productId));
        res.json({ products: products });
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const product = productManager.getProductById(productId);

    if (product) {
        const cart = cartManager.getCartById(cartId);

        if (cart) {
            cartManager.saveToFile(productId, cartId); 

            res.status(200).json({ message: 'Producto agregado al carrito correctamente', cart: cart });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } else {
        res.status(404).json({ error: 'El producto no existe' });
    }
});



module.exports = router;
