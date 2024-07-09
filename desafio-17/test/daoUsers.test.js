const config = require("../../../src/config/config");
const UsuariosMongoDAO = require("../../../src/dao/usersMongoDAO");
const mongoose = require("mongoose");
const Assert = require("assert");
const { describe, it, before, after } = require("mocha");

const assert = Assert.strict;

describe("Prueba al DAO de users", function() {
    this.timeout(8000); // Por defecto es de 2000ms

    let usuariosMongoDAO;

    before(async function() {
        // Conectar a la base de datos antes de ejecutar las pruebas
        try {
            await mongoose.connect("mongodb+srv://eddykratochvil:581120eRHM@cluster0.ipkkxpa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        } catch (error) {
            console.error(error.message);
            process.exit(1);
        }

        // Inicializar la instancia de UsuariosMongoDAO
        usuariosMongoDAO = new UsuariosMongoDAO();
    });

    it('El método getAll del DAO retorna un array de usuarios', async function() {
        let resultado = await usuariosMongoDAO.getAll();

        assert.equal(Array.isArray(resultado), true);
        if(Array.isArray(resultado) && resultado.length>0){
            assert.ok(resultado[0]._id)
            assert.ok(resultado[0].email)
            // console.log(Object.keys(resultado[0].toJSON()))
            assert.equal(Object.keys(resultado[0].toJSON()).includes("email"), true)
        }
    });

    beforeEach(async()=> {
        await mongoose.connection.collection("users").deleteMany({email:"juanperez@test.com"})
    })

    it('El método create permite grabar un user en DB', async function() {
        let mockUser = {
            first_name: "Juan",
            last_name: "Perez",
            email: "juanperez@test.com",
            password: "123123",
            age: 23,
            role: "user"
        };
        let resultado = await usuariosMongoDAO.create(mockUser);
        assert.ok(resultado._id);
    });


    beforeEach(async()=> {
        await mongoose.connection.collection("users").deleteMany({email:"juanperez@test.com"})
    })


    it("El método create permite grabar un user en DB, y el usuario retorna con una property carts, de tipo array sin datos", async function(){
        let mockUser = {
            first_name: "Juan",
            last_name: "Perez",
            email: "juanperez@test.com",
            password: "123123",
            age: 23,
            role: "user",
        };

        let resultado = await usuariosMongoDAO.create(mockUser);
         assert.ok(resultado.cart)
         assert.equal(Array.isArray(resultado.cart), true)
         assert.equal(resultado.cart.length, 0)

    })
});
