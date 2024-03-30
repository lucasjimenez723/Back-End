const Product = require('../models/productModels');

class ProductManager {
    constructor() {
        
    }

    async addProduct(productData) {
        try {
            return await Product.create(productData);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async getProductByCode(code) {
        try {
            return await Product.findOne({ code });
        } catch (error) {
            console.error('Error al obtener producto por código:', error);
            throw error;
        }
    }

    async getAllProducts() {
        try {
            return await Product.find({});
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    async updateProduct(updatedProduct) {
        try {
            return await Product.findByIdAndUpdate(updatedProduct.id, updatedProduct, { new: true });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProductById(id) {
        try {
            return await Product.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }

    // Otros métodos según sea necesario
}

module.exports = ProductManager;