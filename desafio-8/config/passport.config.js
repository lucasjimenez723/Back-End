const passport = require('passport')
const local = require('passport-local');
const github = require('passport-github2')
const { creaHash, validaPassword } = require('../utils.js');
const usersManager = require('../dao/DBmanager/usersManager.js')


const usuariosManager = new usersManager

const initPassport = () => {
    

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email",
                passReqToCallback: true,
                
            },
            async function(req,username, password, done) {
                try {
                    let { username, email, role } = req.body;
                    if (!username || !email || !role) {
                        return done(null,false)
                    }
                    username
                    let existe = await usuariosManager.getBy({ email });
                    if (existe) {
                        return done (null, false)
                    }
                
                    password = creaHash(password)

                  
                    let nuevoUsuario=await usuariosManager.create({username, email, password})
            
                    // res.setHeader('Content-Type','application/json');
                    // return res.status(200).json({payload:"Registro exitoso", nuevoUsuario});
                    // return res.redirect(`/registro?mensaje=Registro exitoso para ${nombre}`)
                    return done(null, nuevoUsuario)
                   
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email"
            },
            async (username, password, done)=>{
                try {
                    console.log({username})
                    let usuario=await usuariosManager.getBy({email:username})
                    if(!usuario){
                        // res.setHeader('Content-Type','application/json');
                        // return res.status(401).json({error:`Credenciales incorrectas`})
                        return done(null, false)
                    }
                
                    // if(usuario.password!==creaHash(password)){
                    if(!validaPassword(usuario, password)){
                        // res.setHeader('Content-Type','application/json');
                        // return res.status(401).json({error:`Credenciales incorrectas`})
                        return done(null, false)
                    }
                
                    return done(null, usuario)
                                    
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

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

            passport.serializeUser((usuario, done)=> {
                return done(null, usuario._id)
            })

            passport.deserializeUser(async (id, done) => {
                let usuario=await usuariosManager.getBy({_id:id})
                return done(null, usuario)
            })
}

module.exports= initPassport;