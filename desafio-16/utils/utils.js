const bcrypt = require('bcrypt');
const nodemailer = require ("nodemailer")

const trasnporter=nodemailer.createTransport(
    {
        service:"gmail", 
        port:"587",
        auth:{
            user:"eddykratochvil@gmail.com",
            pass: "ivsq akbq fdna pupq"
        }
    }
)
const enviarMail=async(to, subject, message)=>{
    return await trasnporter.sendMail(
        {
            from:"Sistemas Pirulito eddykratochvil@gmail.com",
            to, subject, 
            html: message
        }
    )
}

const creaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const validaPassword = (usuario, password) => bcrypt.compareSync(password, usuario.password)

function generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 10;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

// Función para calcular el total de la compra
function calculateTotalAmount(products) {
    let total = 0;

    for (const item of products) {
        total += item.quantity * item.product.price;
    }

    return total;
}

module.exports = {creaHash, validaPassword, calculateTotalAmount, generateUniqueCode, enviarMail};