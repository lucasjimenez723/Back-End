const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartControllers.js');

router.post('/', CartController.createCart)

router.get('/:cid', CartController.getCartById);

router.post('/:cid/:pid', CartController.addProductToCart);

router.delete('/:cartId/products/:productId', CartController.removeProductFromCart);
  
router.delete("/:cartId", CartController.removeAllProducts);
  
router.put("/:cartId/products/:productId", CartController.updateProductQuantity);

module.exports = router;
