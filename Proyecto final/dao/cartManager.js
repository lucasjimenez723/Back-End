const { modeloCarts } = require('./models/carts.modelo');


class CartManager {
  constructor() {
  }

  async addProductToCart(cartId, productId) {
    try {
        // Buscar el carrito por su ID en MongoDB
        const cart = await modeloCarts.findById(cartId);

        if (!cart) {
            throw new Error(`Carrito no encontrado para el ID ${cartId}`);
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.find(product => product.productId.equals(productId));

        if (existingProduct) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            existingProduct.quantity++;
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            cart.products.push({ productId, quantity: 1 });
        }

        // Guardar el carrito actualizado en MongoDB
        await cart.save();

        // Devolver el producto agregado o actualizado
        return cart.products.find(product => product.productId.equals(productId));
    } catch (error) {
        throw new Error('Error al agregar el producto al carrito: ' + error.message);
    }
}

  async getAllCarts() {
    try {
        // Obtener todos los carritos de MongoDB
        return await modeloCarts.find();
    } catch (error) {
        throw new Error('Error al obtener los carritos: ' + error.message);
    }
  }


  async getCartById(cartId) {
    try {
        // Buscar un carrito por su ID en MongoDB
        return await modeloCarts.findById(cartId);
    } catch (error) {
        throw new Error('Error al obtener el carrito por ID: ' + error.message);
    }
}

  async createCart(initialProducts = []) {
    try {
        // Crear un nuevo carrito en MongoDB con los productos iniciales
        const newCart = await modeloCarts.create({ products: initialProducts });
        return newCart;
    } catch (error) {
        throw new Error('Error al crear el carrito: ' + error.message);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
        const cart = await modeloCarts.findById(cartId);

        if (!cart) {
            throw new Error(`Carrito no encontrado para el ID ${cartId}`);
        }

        cart.products = cart.products.filter(product => !product.productId.equals(productId));
        await cart.save();

        return cart;
    } catch (error) {
        throw new Error('Error al eliminar el producto del carrito: ' + error.message);
    }
}

async updateProductQuantity(cartId, productId, newQuantity) {
    try {
        
        const cart = await modeloCarts.findById(cartId);

        if (!cart) {
            throw new Error(`Carrito no encontrado para el ID ${cartId}`);
        }
        
        const productToUpdate = cart.products.find(product => product.productId.equals(productId));

        if (!productToUpdate) {
            throw new Error(`Producto no encontrado en el carrito`);
        }
        
        productToUpdate.quantity = newQuantity;

        await cart.save();

        return cart;
    } catch (error) {
        throw new Error('Error al actualizar la cantidad del producto en el carrito: ' + error.message);
    }
}

async removeAllProductsFromCart(cartId) {
    try {
        const cart = await modeloCarts.findById(cartId);

        if (!cart) {
            throw new Error(`Carrito no encontrado para el ID ${cartId}`);
        }

        cart.products = [];

        await cart.save();

        return cart;
    } catch (error) {
        throw new Error('Error al eliminar todos los productos del carrito: ' + error.message);
    }
}

}

module.exports = CartManager;