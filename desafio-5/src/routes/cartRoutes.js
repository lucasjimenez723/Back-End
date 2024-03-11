import express from "express";
import { CartManager } from "../classes/cartManager.js";
import { cartsPath } from "../utils.js";

const cartRouter = express.Router();
const CM = new CartManager(cartsPath);

cartRouter.get("/", (req, res) => {
  const allCarts = CM.getAllCarts();
  res.json(allCarts);
});

cartRouter.post("/", (req, res) => {
  const newCart = CM.createCart();
  res.status(201).json({ message: "Nuevo carrito creado", cart: newCart });
});


cartRouter.get("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const result = CM.getProductById(cid, pid);

  if (!result.success) {
    return res.status(404).json({ error: result.message });
  }

  res.json({ message: result.message, product: result.product });
});


cartRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;
  const cart = CM.getCartById(cid);

  if (!cart) {
    return res
      .status(404)
      .json({ error: `No existe un carrito con el id ${cid}` });
  }

  res.json(cart);
});


cartRouter.delete("/:cid", (req, res) => {
  const { cid } = req.params;
  const success = CM.deleteCart(cid);

  if (!success) {
    return res
      .status(404)
      .json({ error: `No existe un carrito con el id ${cid}` });
  }

  res.json({ message: `Carrito con id ${cid} eliminado correctamente` });
});


cartRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  const result = CM.addProductToCart(cid, pid, quantity);

  if (!result.success) {
    return res.status(404).json({ error: result.message });
  }

  res.json({ message: result.message, cart: result.cart });
});


cartRouter.delete("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const result = CM.removeProductFromCart(cid, pid);

  if (!result.success) {
    return res.status(404).json({ error: result.message });
  }

  res.json({ message: result.message, cart: result.cart });
});

export { cartRouter };