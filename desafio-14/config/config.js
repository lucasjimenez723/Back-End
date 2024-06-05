const dotenv = require('dotenv');

dotenv.config(
    {
        override: true
    }
);

const config = {
    PORT:process.env.PORT || 8080,
    MONGO_URL:process.env.MONGO_URL ,
    PERSISTENCE: process.env.PERSISTENCE || 'MONGO',

}

module.exports = config;