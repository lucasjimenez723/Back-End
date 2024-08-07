const Router = require('express').Router;
const viewsRouter = Router();
const ViewsController = require('../controller/views.controller');
const logger = require('../utils/logger');
const { isAdmin } = require('../middlewares/roleAuth');


function handleRealTimeProductsSocket(io) {
  io.on('connection', async(socket) => {
      logger.info('Un cliente se ha conectado a /realtimeproducts');
      const products = await productManager.getProducts();
      socket.emit('products', products);
  });
}

// RUTA DE LA HOME
viewsRouter.get('/', ViewsController.getHome);

// RUTA DE PRODUCTS
viewsRouter.get('/products', ViewsController.getProducts);

// Ruta para mostrar los detalles de un producto
viewsRouter.get('/products/:id', ViewsController.getProductById);

// VISTA DEL CART
viewsRouter.get('/cart/:id', ViewsController.getCartById);

// VISTA LOGIN
viewsRouter.get('/login', ViewsController.getLogin);

// VISTA TICKET 
viewsRouter.get('/purchase/:cartId/ticket', ViewsController.getTicket);

// VISTA Register
viewsRouter.get('/register', ViewsController.getRegister);

// PROFILE PAGE VIEW
viewsRouter.get('/profile', ViewsController.getProfile);

// RUTA REALTIME PRODUCTS
viewsRouter.get('/realtimeproducts', ViewsController.getRealtimeProducts);

viewsRouter.get('/admin', isAdmin, ViewsController.getAdminPanel)

  module.exports = { viewsRouter, handleRealTimeProductsSocket };