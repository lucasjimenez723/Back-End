const express = require('express');
const http = require('http');
const logger = require('./utils/logger.js')
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const {engine} = require('express-handlebars');
const vistaRoutes = require('./routes/vistasRoutes');
const sessionsRoutes = require('./routes/sessionsRoutes')
const mockingproducts = require('./routes/mockingRoutes.js')
const path = require('path');
const connectDB = require('./db'); 
const session = require('express-session')
const {Server} = require('socket.io')
const initPassport = require('./config/passport.config.js');
const passport = require('passport');

const PORT = 8080;

const app = express();
const server = http.createServer(app); 


app.use(session(
    {
        secret:"CoderCoder123",
        resave: true,
        saveUninitialized: true
    }
))

//paso numero 2, inicializo en el app.js
initPassport()
app.use(passport.initialize())
app.use(passport.session()) //solo si usamos sesiones


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(err.statusCode || 500).json({ error: err.message });
  });

  app.get('/loggerTest', (req, res) => {
    logger.debug('Probando log de nivel debug');
    logger.http('Probando log de nivel http');
    logger.info('Probando log de nivel info');
    logger.warn('Probando log de nivel warning');
    logger.error('Probando log de nivel error');
    logger.fatal('Probando log de nivel fatal');
    res.json({ message: 'Prueba de logger completada' });
  }); 

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);
app.use('/api/carts', cartRoutes);
app.use('/', vistaRoutes);
app.use('/realtimeproducts', vistaRoutes);
app.use('/api/sessions', sessionsRoutes)
app.use('mockingproducts', mockingproducts)

app.get('*', (req, res) => {
    res.status(404).send("error 404, not found.");
    
});

connectDB();

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


let mensajes=[]
let usuarios=[]

const io=new Server(server)   // websocket server

io.on("connection", socket => {
    console.log(`Se conectó un cliente con id ${socket.id}`);
    
    socket.on("presentacion", nombre => {
        usuarios.push({ id: socket.id, nombre });
        socket.emit("historial", mensajes);
        socket.broadcast.emit("nuevoUsuario", nombre);
    });

    socket.on("mensaje", (nombre, mensaje)=>{
        mensajes.push({nombre, mensaje})
        io.emit("nuevoMensaje", nombre, mensaje)
    })

    socket.on("disconnect", ()=>{
        let usuario=usuarios.find(u=>u.id===socket.id)
        if(usuario){
            socket.broadcast.emit("saleUsuario", usuario.nombre)
        }
    })

}) 