const UserService = require('../services/user.service');
const UserDTO = require('../dto/user.dto');
const logger = require("../utils/logger");
const { userModel } = require('../dao/models/users.modelo');
const { envioMail } = require('../config/mailing.config');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userService = require('../services/user.service');


class SessionController{

    // GET USERS
    static async getUsers(req, res) {
        try {
            const users = await UserService.getUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // REGISTER

    static async registerError(req, res) {
        return res.status(500).json({error: "Error en registro"});
    }
    static async register(req, res) {
        try {
            const { username, first_name, last_name, age, email, password, role } = req.body;
            const existingUser = await userService.getUserByFilter({ email });
            if (existingUser) {
                return res.status(409).json({ error: 'El usuario ya está registrado con este email.' });
            }
            const newUser = await userService.addUser({ username, first_name, last_name, age, email, password, role });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // LOGIN NATIVO

    static async loginError(req, res) {
        return res.status(401).json({error: "Error en login"});
    }

    static async login(req, res) {
        const { email, password } = req.body;
    
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
            }

            const cartId = user.cartId;
    
            req.session.user = { ...user._doc, cartId };
            delete req.session.user.password;
    
            return res.status(200).json({ payload: "Login successful", user: req.session.user });
        } catch (error) {
            return res.status(500).json({ error: 'Error en el servidor, por favor intente más tarde.' });
        }
    }
    

    // GITHUB ERROR

    static async githubError(req, res) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({
            error: "Error en servidor",
            detalle: "Error en login con Github"
        })
    }

    // GITHUB CALLBACK
    static async githubCallback(req, res) {
        req.session.user = req.user;
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({payload: "Login successful", user: req.user});
    }

    // LOGOUT
    static async logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                logger.error('Error al cerrar sesión.', err);
                res.status(500).send('Error al cerrar sesión.');
            } else {
                res.status(200).json({ message: 'Sesión cerrada' }); 
            }
        });
    }


    // CURRENT USER
    static async currentUser(req, res) {
        try {
          if (!req.session.user || !req.session.user._id) {
            return res.status(401).json({ error: 'No hay usuario logueado.' });
          }
      
          const userId = req.session.user._id;
          const user = await UserService.getUserByFilter({ _id: userId });
      
          if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
          }
      
          const userDTO = new UserDTO(user);
          res.status(200).json(userDTO);
        } catch (error) {
          res.status(500).json({ error: 'Error al obtener usuario actual.' });
        }
      }

    // DELETE USER INACTIVE
    static async deleteUserInactive(req, res) {
        try {
           const threeDaysAgo = new Date();
           threeDaysAgo.setDate(oneDayOff.getDate() - 3);
           const inactiveUsers = await userModel.find({
            $or: [
                { lastConnection: { $exists: true, $lt: threeDaysAgo } },
                { lastConnection: { $exists: false } }
            ]
        });
        if (inactiveUsers.length === 0) {
            return res.status(200).json({ message: 'No hay usuarios inactivos para eliminar' });
        }

        const emailsDeleting = inactiveUsers.map(user => user.email);

        for (const email of emailsDeleting) {
            await envioMail(email, 'Cuenta eliminada', 'Tu cuenta ha sido eliminada por inactividad');
        }

        await userModel.deleteMany({_id: { $in: inactiveUsers.map(user => user._id) }});
        logger.info('Usuarios eliminados por inactividad', emailsDeleting);

        } catch (error) {
            logger.error('Error al eliminar usuarios inactivos', error);
            res.status(500).json({ error: error.message });
        }
    }

    // UPDATE USER ROLE
    static async updateUserRole(req, res) {
        const { userId, role } = req.body;
        console.log('Received userId:', userId); 

        try {
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error('ID de usuario inválido');
            }
    
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
    
            user.role = role;
            await user.save();
            logger.info('Rol de usuario actualizado', { userId, role });
            res.status(200).json({ message: 'Rol de usuario actualizado' });
        } catch (error) {
            if (!res.headersSent) {
                res.status(500).json({ error: error.message });
            }
            logger.error('Error al actualizar el rol de usuario', error);
        }
    }

    // DELETE SINGLE USER
    static async deleteUser(req, res) {
        const { userId } = req.body;

        try{
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            await userModel.deleteOne({ _id: userId });
            res.status(200).json({ message: 'Usuario eliminado' });
            logger.info('Usuario eliminado', { userId });
        }
        catch(error){
            res.status(500).json({error:error.message})
        }  
    }

}

module.exports = SessionController;