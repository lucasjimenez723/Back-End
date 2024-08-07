const dotenv = require("dotenv")

dotenv.config(
    {
        path: "./src/.env",
        override: true
    }
)


const config = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    PERSISTENCE: process.env.PERSISTENCE || 'mongo',
    EMAIL: process.env.EMAIL,
    MAILPASSWORD: process.env.MAILPASSWORD,
};

module.exports = config;