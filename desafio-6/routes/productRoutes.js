const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/DBmanager/productManager.js');


const productManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto por ID' });
    }
});


router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const newProduct = await productManager.addProduct({
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        });
        res.status(201).json({ message: 'Producto agregado correctamente', newProduct });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});


router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(productId, {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        });
        if (updatedProduct) {
            res.json({ message: 'Producto actualizado correctamente', updatedProduct });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});


router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const result = await productManager.deleteProductById(productId);
        if (result) {
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;