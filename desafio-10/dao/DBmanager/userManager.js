const  usersModels  = require('../models/usersModels.js')  



    class UsuariosManager {
        constructor() {
            
        }


    async create(usuario){
        let nuevoUsuario=await usersModels.create(usuario)
        return nuevoUsuario.toJSON()
    }

    async getBy(filtro){   // {email}
        return await usersModels.findOne(filtro).lean()
    }

}

module.exports = UsuariosManager