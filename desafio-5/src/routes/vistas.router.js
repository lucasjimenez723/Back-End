import { Router } from "express";
import { productsPath } from "../utils.js";
import { ProductManager } from "../classes/productManager.js";
export const router = Router();

let productManager = new ProductManager(productsPath);
let products = productManager.getProducts();

router.get("/", (req, res) => {
  res.status(200).render("home", {
    products,
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.status(200).render("realtimeproducts", {
    products,
  });
});