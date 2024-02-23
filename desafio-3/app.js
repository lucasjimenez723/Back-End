
const express = require('express');
const ProductManager = require('./product-manager');

const app = express();
const PORT = process.env.PORT || 3000; 
const productManager = new ProductManager('products.json');

app.get('/', (req, res) => {
    res.send('Bienvenido a la tienda de productos.');
}
);


app.get('/products/:pid', (req, res) => {
    const productId = parseInt(req.params.pid); 
    const product = productManager.getProductById(productId); 
    if (product) {
        res.json(product); 
    } else {
        res.status(404).json({ error: 'Producto no encontrado' }); 
    }
});


app.get('/products', (req, res) => {
    let limit = req.query.limit; 
    let products = productManager.getAllProducts();

    if (limit && !isNaN(limit)) {
        limit = parseInt(limit);
        products = products.slice(0, limit); 
    }

    res.json(products);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});