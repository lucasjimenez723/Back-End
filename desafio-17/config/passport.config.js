const passport = require('passport')
const local = require('passport-local');
const github = require('passport-github2')
const { creaHash, validaPassword } = require('../utils/utils.js');
const usersManager = require('../dao/usersMongoDAO.js')
const usuariosService = require('../services/usersServices.js')
const bcrypt = require ('bcrypt')


const usuariosManager = new usersManager

const initPassport = () => {
    

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true,
            },
            async function(req, email, password, done) {
                try {
                    const { first_name, last_name, age, role } = req.body;
                    if (!first_name || !last_name || !email || !age || !password || !role) {
                        return done(null, false, { message: "Todos los campos son obligatorios." });
                    }
    
                    let existeUsuario = await usuariosService.getUserEmail(email);
                    if (existeUsuario) {
                        return done(null, false, { message: "El correo electrónico ya está en uso." });
                    }
    
                    const hashedPassword = await bcrypt.hash(password, 10);
    
                    const nuevoUsuario = await usuariosService.createUser({
                        first_name,
                        last_name,
                        email,
                        age,
                        password: hashedPassword,
                        role
                    });
    
                    return done(null, nuevoUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    


    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (email, password, done) => {
                try {
                    let usuario = await usuariosService.getUserEmail(email);
                    if (!usuario) {
                        return done(null, false, { message: "Credenciales incorrectas." });
                    }
    
                    const isValidPassword = await bcrypt.compare(password, usuario.password);
                    if (!isValidPassword) {
                        return done(null, false, { message: "Credenciales incorrectas." });
                    }
    
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID:"Iv1.a6bf0b427b35c1e0",
                clientSecret:"2160f0fc5d4c65b2dd441e1d963b369eb4591ccc",
                callbackURL:"http://localhost:8080/api/sessions/callbackGithub"
            },
            async function(accessToken, refreshToken, profile, done){
                try {
                    let username=profile._json.name
                    let email=profile._json.email
                    if(!email){
                        return done(null, false)
                    }
                    let usuario=await usuariosManager.getBy({email})
                    if(!usuario){
                        usuario=await usuariosManager.create({
                            username, email, 
                            profileGithub: profile
                        })
                    }

                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    

    
//1) solo si usamos sessions (sesiones), definir serializer y deserializer
passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let usuario = await usuariosService.getUserById(id);
        done(null, usuario);
    } catch (error) {
        done(error);
    }
});

}

module.exports= initPassport;