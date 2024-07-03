const CartMongoDAO = require('../dao/cartMongoDAO.js');
const Cart = require('../dao/models/cartModels.js');
const { generateUniqueCode, calculateTotalAmount } = require('../utils/utils.js');

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
    static async purchaseCart(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await Cart.findById(cartId).populate('products.product');

            // Verificar el stock y realizar la compra
            const productsNotPurchased = [];
            for (const item of cart.products) {
                const product = item.product;
                const quantity = item.quantity;

                if (product.stock >= quantity) {
                    // Hay suficiente stock para comprar el producto
                    product.stock -= quantity;
                    await product.save();
                } else {
                    // No hay suficiente stock para el producto, agregarlo al arreglo de productos no comprados
                    productsNotPurchased.push(product._id);
                }
            }

            // Crear el ticket de compra
            const ticket = new Ticket({
                code: generateUniqueCode(), // Generar un código único para el ticket
                purchase_datetime: Date.now(),
                amount: calculateTotalAmount(cart.products), // Calcular el total de la compra
                purchaser: req.userDTO.email // Obtener el correo electrónico del comprador del DTO del usuario
            });
            await ticket.save();

            // Filtrar los productos no comprados y actualizar el carrito
            const productsPurchased = cart.products.filter(item => !productsNotPurchased.includes(item.product._id));
            cart.products = productsPurchased;
            await cart.save();

            // Responder con el ticket y los productos no comprados
            return res.status(200).json({ 
                ticket: ticket,
                productsNotPurchased: productsNotPurchased 
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = CartController;