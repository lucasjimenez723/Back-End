import fs from "fs";
import { generateUniqueId } from "../utils.js";
import { cartsPath } from "../utils.js";

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al cargar carritos: ${error.message}`);
      throw error;
    }
  }

  saveCarts() {
    const data = JSON.stringify(this.carts, null, 2);
    fs.writeFileSync(this.path, data, "utf8");
  }

  createCart() {
    const newCart = {
      id: generateUniqueId(),
      products: [],
    };

    this.carts.push(newCart);
    this.saveCarts();

    return newCart;
  }

  getCartById(id) {
    return this.carts.find((cart) => cart.id === id);
  }

  getAllCarts() {
    return this.carts;
  }

  getProductById(cartId, productId) {
    const cart = this.getCartById(cartId);

    if (!cart) {
      return {
        success: false,
        message: `No existe un carrito con el id ${cartId}`,
      };
    }

    const product = cart.products.find((p) => p.id === productId);

    if (!product) {
      return {
        success: false,
        message: `No existe un producto con el id ${productId} en el carrito`,
      };
    }

    return {
      success: true,
      message: "Producto encontrado en el carrito",
      product,
    };
  }

  addProductToCart(cartId, productId, quantity) {
    const cart = this.getCartById(cartId);

    if (!cart) {
      throw new Error(`No existe un carrito con el id ${cartId}`);
    }

    const existingProduct = cart.products.find(
      (product) => product.id === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }

    this.saveCarts();

    return cart;
  }

  deleteCart(cartId) {
    const updatedCarts = this.carts.filter((cart) => cart.id !== cartId);

    if (updatedCarts.length === this.carts.length) {
      return {
        success: false,
        message: `No existe un carrito con el id ${cartId}`,
      };
    }

    this.carts = updatedCarts;
    this.saveCarts();

    return {
      success: true,
      message: `Carrito con id ${cartId} eliminado correctamente`,
    };
  }

  removeProductFromCart(cartId, productId) {
    const cart = this.getCartById(cartId);

    if (!cart) {
      throw new Error(`No existe un carrito con el id ${cartId}`);
    }

    const productIndex = cart.products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      throw new Error(
        `No existe un producto con el id ${productId} en el carrito`
      );
    }

    const product = cart.products[productIndex];

    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1);
    }

    this.saveCarts();

    return cart;
  }
}

const CM = new CartManager(cartsPath);

export let arrayCarts = CM.getAllCarts();
export { CartManager };