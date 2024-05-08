const express = require('express');
const router = express.Router();
const usersManager = require('../dao/DBmanager/usersManager.js')
const { validaPassword } = require('../utils.js');

const passport = require('passport')

let usuariosManager= new usersManager()

router.get("/errorGitHub", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`Fallo al autenticar con GitHub`
        }
    )
    
})

router.get('/errorRegistro', (req, res)=> {
    return res.redirect('registro?error=Error en el proceso de registro')
})

router.post('/registro', passport.authenticate("registro", {failureRedirect:"/api/sessions/errorRegistro"}), async(req,res)=>{

    
    console.log(req.user) // passport, si ejecuta correctamente, deja en la request una propiedad user
    return res.redirect(`/registro?mensaje=Registro exitoso para ${req.user.username}`)
});

router.get("/errorLogin", (req, res)=>{
    return res.status(400).json({error:`Error en el proceso de login... :(`})
})


router.post('/login', passport.authenticate("login", {failureRedirect:"/api/sessions/errorLogin"}), async(req,res)=>{

    let usuario=req.user
    usuario={...usuario}
    delete usuario.password
    req.session.usuario=usuario // en un punto de mi proyecto

    res.setHeader('Content-Type','application/json')
    res.status(200).json({
        message:"Login correcto", usuario
    })
})

router.get("/github", passport.authenticate("github", {}), (req, res) => {})

router.get('/callbackGithub', passport.authenticate("github", {failureRedirect:"/api/sessions/errorGitHub"}), (req,res)=>{

    req.session.usuario=req.user
    return res.redirect('/perfil');
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({
        payload:"Login correcto", 
        usuario:req.user
        
    });
})




router.get('/logout',(req,res)=>{

    req.session.destroy(e=>{
        if(e){
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`${e.message}`
                }
            )
            
        }
    })
    
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message:"Logout exitoso"
    });
});


module.exports = router;