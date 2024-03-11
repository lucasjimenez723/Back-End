import express from "express";
import { v4 as uuidv4 } from "uuid";
import { ProductManager } from "../classes/productManager.js";
import { productsPath } from "../utils.js";
import { router } from "./viewsRouter.js";

const productRouter = express.Router();
const PM = new ProductManager(productsPath);


productRouter.get("/", (req, res) => {
  const { limit } = req.query;
  let result = PM.getProducts();

  if (!isNaN(limit) && limit > 0) {
    result = result.slice(0, limit);
  }

  res.status(200).json({ result });
});


productRouter.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = PM.getProductById(pid);

  if (!product) {
    return res
      .status(404)
      .json({ error: `No existe un producto con el id ${pid}` });
  }

  res.json(product);
});


productRouter.post("/", async (req, res) => {
  try {
    console.log("Ruta para agregar un nuevo producto alcanzada");
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails = [],
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios, excepto thumbnails",
      });
    }

    const id = uuidv4();

    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status: true,
    };

    if (!newProduct) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - El producto no ha podido crearse.`,
      });
    }

    req.io.emit("newProduct", newProduct);
    console.log("Evento 'newProduct' emitido desde el servidor");

    PM.addProduct(newProduct);

    res.status(201).json({
      message: "Producto agregado correctamente",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error asincrónico al agregar un nuevo producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

productRouter.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;

  const success = PM.updateProduct(Number(pid), updatedProduct);

  if (!success) {
    return res
      .status(404)
      .json({ error: `No existe un producto con el id ${pid}` });
  }

  res.json({ message: `Producto con id ${pid} actualizado correctamente` });
});

productRouter.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  const success = PM.deleteProduct(Number(pid));

  if (!success) {
    return res
      .status(404)
      .json({ error: `No existe un producto con el id ${pid}` });
  }

  res.json({ message: `Producto con id ${pid} eliminado correctamente` });
});

export { productRouter };