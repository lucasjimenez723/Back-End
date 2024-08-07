const nodeMailer = require('nodemailer');
const  config  = require('./config');
const logger = require("../utils/logger");

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.EMAIL,
        pass: config.MAILPASSWORD
    }
});

const envioMail = async (to, subject, message) => {
    const options = {
        from: config.EMAIL,
        to, subject,
        html: message
    }
    try {
        const info = await transporter.sendMail(options);
        logger.info("Email enviado", info)
    } catch (error) {
        logger.error("Error al enviar email", error)
        throw error
    }
}

module.exports = { envioMail }