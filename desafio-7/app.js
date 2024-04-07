const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const handlebars = require('express-handlebars');
const vistaRoutes = require('./routes/vistasRoutes');
const path = require('path');
const connectDB = require('./db'); 
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app); 

const PORT = process.env.PORT || 8080;
const io = socketIO(server); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', vistaRoutes);
app.use('/realtimeproducts', vistaRoutes);

app.get('*', (req, res) => {
    res.status(404).send("error 404, not found.");
});

let mensajes = [];
let usuarios = [];

io.on("connection", socket => {
    console.log(`Se conectó un cliente con id ${socket.id}`);

    socket.on("presentacion", userData => { 
        usuarios.push({ id: socket.id, ...userData }); 
        socket.emit("historial", mensajes);
        socket.broadcast.emit("nuevoUsuario", userData.nombre);
    });

    socket.on("mensaje", async (userData, mensaje) => {
        mensajes.push({ nombre: userData.nombre, mensaje }); 
    
        try {
            await messageManager.addMessage({ userId: userData.id, text: mensaje });
            io.emit("nuevoMensaje", userData.nombre, mensaje);
        } catch (error) {
            console.error('Error al guardar el mensaje en la base de datos:', error);
        }
    });
    
    

    socket.on("disconnect", () => {
        let usuario = usuarios.find(u => u.id === socket.id);
        if (usuario) {
            socket.broadcast.emit("saleUsuario", usuario.nombre);
        }
    });
});

connectDB();

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 