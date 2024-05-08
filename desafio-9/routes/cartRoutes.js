const express = require('express');
const router = express.Router();
const CartManager = require('../dao/DBmanager/cartManager.js');
const ProductManager = require('../dao/DBmanager/productManager.js'); 
const cartModels = require('../dao/models/cartModels.js')

const cartManager = new CartManager();

const productManager = new ProductManager();



router.post("/", async (req, res) => {
    const initialProducts = req.body.products || [];
    console.log("Productos iniciales recibidos:", initialProducts);
    try {
      const newCart = await cartManager.createCart(initialProducts); 
      console.log("Nuevo carrito creado:", newCart);
      res.status(201).json(newCart);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
});

  


  router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
  
    try {
      const cart = await cartModels.findById(cartId).populate({
        path: "products.productId",
        select: "title price description code category stock status",
      });
      if (!cart) {
        res.status(400).json({ error: "Carrito no encontrado" });
        return;
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({
        error: "Error del servidor" + error.message,
      });
    }
  });


  //Añadir productos al carrito
router.post("/:cid/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
  
    try {
      const addProduct = await cartManager.addProductCart(cartId, productId);
      res.status(200).json(addProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  //Eliminar producto del carrito
router.delete("/:cartId/products/:productId", async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    try {
      await cartManager.removeProductsCart(cartId, productId);
      res.json({ message: "Producto eliminado del carrito exitosamente" });
    } catch (error) {
      res.status(500).json({
        error: "Error al eliminar el producto del carrito: " + error.message,
      });
    }
  });
  
  //Eliminar TODOS los productos del carrito
  router.delete("/:cartId", async (req, res) => {
    const cartId = req.params.cartId;
    try {
      await cartManager.removeAllProducts(cartId);
      res.json({
        message:
          "Todos los productos han sido eliminados del carrito exitosamente",
      });
    } catch (error) {
      res.status(500).json({
        error:
          "Error al eliminar todos los productos del carrito: " + error.message,
      });
    }
  });
  
  router.put("/:cartId/products/:productId", async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
  
    try {
      await cartManager.updateQuantityProduct(cartId, productId, quantity);
      res.json({
        message: "Cantidad del producto actualizada exitosamente en el carrito",
      });
    } catch (error) {
      res.status(500).json({
        error:
          "Error al actualizar la cantidad del producto en el carrito: " +
          error.message,
      });
    }
  });

  

module.exports = router;
