const bcrypt = require('bcrypt');
const SECRET = "CoderCoder123";

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

module.exports = {creaHash, SECRET, validaPassword, calculateTotalAmount, generateUniqueCode};