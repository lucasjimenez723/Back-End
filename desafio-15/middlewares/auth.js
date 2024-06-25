const userDTO = require("../dto/userDTO.js");

const auth = (role) => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "No hay usuario autenticado." });
        }

        const userDTO = new UserDTO(req.user);

        if (role && userDTO.role !== role) {
            return res.status(403).json({ error: "No tienes permiso para acceder a este recurso." });
        }

        req.userDTO = userDTO;  // Adjuntamos el userDTO al request para su uso posterior
        next();
    };
};

module.exports = auth;