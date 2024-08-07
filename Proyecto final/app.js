const express = require("express");
const path = require("path")
const mongoose = require("mongoose")
const http = require("http")
const handlebars = require("express-handlebars")
const productRouter = require("./routes/products.router")
const cartRouter = require("./routes/cart.router")
const {viewsRouter, handleRealTimeProductsSocket} = require("./routes/views.router");
const sessionsRouter = require("./routes/sessions.router")
const socketIO = require("socket.io");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./config/passport.config");
const connectMongo = require("connect-mongo");
const config = require("./config/config");
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const ticketRouter = require("./routes/tickets.router");
const authenticate = require("./middlewares/auth");
const PORT = 8080;

const app = express();
const server = http.createServer(app)
const io = socketIO(server);

app.use((req, res, next) =>{
    logger.http(`${req.method} - ${req.url}`);
    next();
});

app.use(errorHandler);

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "API de Coderhousse",
            version: "1.0.0",
            description: "API de Backend para el curso de Coderhouse"
        },
    },
        apis: ["./docs/Products.yaml"]
}
    
const spec = swaggerJsDoc(options);


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use(session({
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
    store: connectMongo.create({mongoUrl: "mongodb+srv://ivanrosales:cursoCoder@backend-db.g9wu9xl.mongodb.net/?retryWrites=true&w=majority&appName=backend-db&dbName=curso-coderhouse"})
}))


// inicializacion de passport
passportConfig()
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, "public")))
app.engine("handlebars", handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers:{
        calculateTotal: function(cart){
            let total = 0;
            if (cart && cart.products){
                for (let product of cart.products){
                    total += product.price * product.quantity;
                }
            }
            return total.toFixed(2);
        },
        eq: function (a, b) {
            return a === b;
        }
    }
}))
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, "views"))

//RUTAS
app.use(authenticate)
app.use("/", viewsRouter)
app.use("/api/products", productRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/carts", cartRouter)
app.use("/api/tickets", ticketRouter)

handleRealTimeProductsSocket(io);





app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

server.listen(PORT, () => {
    logger.info(`Servidor escuchando ahora en ${PORT}`);
  });

const connect = async()=>{
    try{
        await mongoose.connect(config.MONGO_URL)
        logger.info("Conectado a MongoDB")
    }catch(error){
        logger.error(`Error al conectar a MongoDB: ${error.message}`)
    }
}


connect()