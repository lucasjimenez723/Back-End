const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js')

router.get('/',(req,res)=>{

    res.status(200).render('home', {login:req.session.usuario})
})

router.get("/chat",auth(['user', 'admin']), (req, res) => {  // Agregar manejo de la ruta /chat
    res.render("chat", {login:req.session.usuario});
});

router.get('/registro',(req,res)=>{

    let {error, mensaje} = req.query

    res.status(200).render('registro', {error, mensaje}), {login:req.session.usuario}
})

router.get('/login',(req,res)=>{

    res.status(200).render('login', {login:req.session.usuario})
})

router.get('/perfil', auth(['user', 'admin']), (req, res) => {
    console.log('Usuario en sesión:', req.session.usuario);
    console.log('UserDTO adjunto:', req.userDTO);
    let usuario = req.userDTO;
    if (!usuario) {
        console.log('Usuario no definido en sesión. Redirigiendo a login.');
        return res.redirect('/login');
    }
    console.log('Renderizando perfil para usuario:', usuario);
    res.status(200).render('perfil', { usuario, login: req.session.usuario });
});

module.exports = router;