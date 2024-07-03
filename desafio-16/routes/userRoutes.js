const express = require('express');
const router = express.Router();
const User = require('../dao/models/usersModels.js');

router.put('/premium/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Cambiar el rol del usuario
        user.role = user.role === 'usuario' ? 'premium' : 'usuario';
        await user.save();

        res.status(200).json({ message: `Rol cambiado a ${user.role}` });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;