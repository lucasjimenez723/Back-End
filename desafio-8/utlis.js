const bcrypt = require('bcrypt');
const SECRET = "CoderCoder123";

const creaHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const validaPassword = (usuario, password) => bcrypt.compareSync(password, usuario.password)



module.exports = {creaHash, SECRET, validaPassword};