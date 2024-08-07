const logger = require('../utils/logger');
const { modeloProductos } = require('./models/productos.modelo');

 class ProductManager {
  constructor() {
  }


  async getProducts(limit = 2) {
    try {
      const products = await modeloProductos.find().limit(limit);
      return products;
    } catch (error) {
      throw new Error('Error al obtener los productos desde MongoDB: ' + error.message);
    }
  }

  async addProduct(productData) {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = productData;

        if (!title || !price || !stock) {
            throw new Error('Los campos title, price y stock son requeridos');
        }

        const existingProduct = await modeloProductos.findOne({ code });
        if (existingProduct) {
          throw new Error('El código del producto ya existe. Por favor, elige otro código.');
        }

        const newProduct = await modeloProductos.create({
            title: String(title), 
            description: description,
            price: Number(price),  
            thumbnail: thumbnail,
            code: code,
            stock: Number(stock),  
            status: Boolean(status),  
            category: category
        });

        return newProduct;
    } catch (error) {
      if(error.code === 11000) {
        throw new Error('El código del producto ya está en uso. Por favor, elige un código diferente.');
      }
      throw new Error('Error al agregar un producto en MongoDB. ' + error.message);
    }
}

  async getProductById(id) {
    try {
        return await modeloProductos.findOne({ _id: id });
    } catch (error) {
        logger.error('Error al obtener el producto por ID desde MongoDB: ' + error.message);
        throw error;
    }
  }
  async updateProduct(id, updatedFields) {
    try {
      // Utiliza el método findOneAndUpdate de Mongoose para actualizar un producto por su ID
      const updatedProduct = await modeloProductos.findOneAndUpdate(
        { _id: id },
        updatedFields,
        { new: true } // Devuelve el producto actualizado
      );
      if (!updatedProduct) {
        throw new Error('Producto no encontrado para actualizar');
      }
      return updatedProduct;
    } catch (error) {
      throw new Error('Error al actualizar el producto en MongoDB: ' + error.message);
    }
  }


  async deleteProduct(id) {
    try {
      const deletedProduct = await modeloProductos.findOneAndDelete({ _id: id });
      if (!deletedProduct) {
        throw new Error('Producto no encontrado para eliminar');
      }
      return deletedProduct;
    } catch (error) {
      throw new Error('Error al eliminar el producto desde MongoDB: ' + error.message);
    }
  }
}

module.exports = ProductManager;