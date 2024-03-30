const Cart = require('../models/cartModels.js');

class CartManager {
    constructor() {
        
    }

    async addCart(cartData) {
        try {
            return await Cart.create(cartData);
        } catch (error) {
            console.error('Error al agregar carrito:', error);
            throw error;
        }
    }

    async getAllCarts() {
        try {
            return await Cart.find({});
        } catch (error) {
            console.error('Error al obtener todos los carritos:', error);
            throw error;
        }
    }

    // Otros métodos según sea necesario
}

module.exports = CartManager;