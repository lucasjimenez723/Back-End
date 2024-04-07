const express = require('express');
const router = express.Router();





router.get("/", (req, res) => {

    
    res.render("home");
});

router.get("/chat", (req, res) => {  // Agregar manejo de la ruta /chat
    res.render("chat");
});

module.exports = router;