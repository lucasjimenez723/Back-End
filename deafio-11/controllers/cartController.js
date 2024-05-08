const CartMongoDAO = require('../dao/cartMongoDAO.js');
const Cart = require('../dao/models/cartModels.js');

const cartDAO = new CartMongoDAO();

class CartController {
    static async createCart(req, res) {
        const initialProducts = req.body.products || [];
        console.log("Productos iniciales recibidos:", initialProducts);

        try {
            const newCart = await cartDAO.createCart(initialProducts);
            console.log("Nuevo carrito creado:", newCart);
            res.status(201).json(newCart);
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }


    static async getCartById(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await Cart.findById(cartId).populate({
                path: "products.productId",
                select: "title price description code category stock status",
            });

            if (!cart) {
                return res.status(400).json({ error: "Carrito no encontrado" });
            }

            res.json(cart);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            res.status(500).json({ error: "Error del servidor: " + error.message });
        }
    }

    static async addProductToCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        try {
            const addProduct = await cartDAO.addProductCart(cartId, productId);
            res.status(200).json(addProduct);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async removeProductFromCart(req, res) {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        
        try {
            await cartDAO.removeProductsCart(cartId, productId);

            res.json({ message: "Producto eliminado del carrito exitosamente" });
        } catch (error) {
            res.status(500).json({
                error: "Error al eliminar el producto del carrito: " + error.message,
            });
        }
    }
    static async removeAllProducts(req, res) {
        const cartId = req.params.cartId;
        try {
            await cartDAO.removeAllProducts(cartId);
            res.json({
                message: "Todos los productos han sido eliminados del carrito exitosamente",
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al eliminar todos los productos del carrito: " + error.message,
            });
        }
    }
    static async updateProductQuantity(req, res) {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
      
        try {
            await cartDAO.updateProductQuantity(cartId, productId, quantity);
            res.json({
                message: "Cantidad del producto actualizada exitosamente en el carrito",
            });
        } catch (error) {
            res.status(500).json({
                error: "Error al actualizar la cantidad del producto en el carrito: " + error.message,
            });
        }
    }
}

module.exports = CartController;