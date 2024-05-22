const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartControllers.js');
const auth = require('../middlewares/auth.js');

router.post('/', auth('usuario'),CartController.createCart)

router.get('/:cid',auth('usuario'), CartController.getCartById);

router.post('/:cid/:pid',auth('usuario'), CartController.addProductToCart);

router.delete('/:cartId/products/:productId',auth('usuario'), CartController.removeProductFromCart);
  
router.delete("/:cartId",auth('usuario'), CartController.removeAllProducts);
  
router.put("/:cartId/products/:productId",auth('usuario'), CartController.updateProductQuantity);

router.post("/:cid/purchase", auth('usuario'), CartController.purchaseCart);

module.exports = router;    