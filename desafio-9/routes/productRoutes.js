const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/DBmanager/productManager.js');
const mongoose = require('mongoose')
const productModels = require('../dao/models/productModels.js')


const productManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 5, sort = "asc" } = req.query;
        const options = {
          page: parseInt(page),
          limit: parseInt(limit),
          sort: { price: sort === "asc" ? 1 : -1 },
        };
        const products = await productModels.paginate({}, options);
        
        // let products =await productManager.getAllProducts()
        res.status(200).json({
            products
        })
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
})


router.get('/products',  async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit)
        };
        const products = await productModels.aggregate([
            { $match: { status: "Disponible" } },
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" } // Agrupa los productos dentro de cada categoría
                }
            }
        ]);

        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
            detalle: error.message
        });
    }
});


router.get('/:id', async (req, res) => {
    let { id } = req.params; 
    if(!mongoose.Types.ObjectId.isValid(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Id invalido`})
    }
    try {
        let product= await productManager.getProductById(id)
        if (product) {
            console.log(product)
            console.log(Object.keys(product))

            res.status(200).json({
                product
            })
        } else {
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existen productos con id ${id}`})
        }
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
        
    }
});




router.post('/', async (req, res) => {
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {

        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Faltan datos obligatorios`})
    }
    try {
        let newProduct= await productManager.addProduct({title, description, code, price, status, stock, category, thumbnails})
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({payload:newProduct})
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:error.message
            })
    }
    
});


router.put('/:id', async (req, res) => {
    let { id } = req.params;
    let { title, description, code, price, status, stock, category, thumbnails } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `ID inválido` });
    }

    if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Faltan datos obligatorios` });
    }

    try {
        let existingProduct = await productManager.getProductById(id);

        if (!existingProduct) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `No existe un producto con ID ${id}` });
        }

       
        existingProduct.title = title;
        existingProduct.description = description;
        existingProduct.code = code;
        existingProduct.price = price;
        existingProduct.status = status;
        existingProduct.stock = stock;
        existingProduct.category = category;
        existingProduct.thumbnails = thumbnails;

        let updatedProduct = await productManager.updateProduct(existingProduct);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ product: updatedProduct });
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: error.message
        });
    }
});



router.delete('/:id', async (req, res) => {
    let { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        let result = await productManager.deleteProductById(id);
        
        if (result === null) {
            return res.status(404).json({ error: `No existe un producto con el ID ${id}` });
        }

        res.status(200).json({ message: `Producto eliminado con ID ${id}` });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;