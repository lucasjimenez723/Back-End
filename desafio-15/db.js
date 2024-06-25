const mongoose = require('mongoose');
const config = require('./config/config');

const connect = async () => {
    try {
        await mongoose.connect(config.MONGO_URL,{dbName:"ecommerse"});
        console.log("DB Online...!!!");
    } catch (error) {
        console.log("Fallo conexión. Detalle:", error.message);
    }
};

module.exports = connect;