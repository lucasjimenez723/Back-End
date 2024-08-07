const Router = require('express').Router;
const sessionRouter = Router();
const { session } = require('passport');
const passport = require('passport');
const SessionController = require('../controller/session.controller');
const authenticate = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/roleAuth');


sessionRouter.get('/', SessionController.getUsers);

// current
sessionRouter.get('/current', authenticate, SessionController.currentUser);

// Registro
sessionRouter.post("/register", SessionController.register)
sessionRouter.get("/registerError", SessionController.registerError);
  
  // Login 
  sessionRouter.get("/loginError", SessionController.loginError);
  
  sessionRouter.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/loginError",}), SessionController.login);

  // github

  sessionRouter.get("/github", passport.authenticate("githubLogin", {}), (req, res)=>{});

  sessionRouter.get("/githubError", SessionController.githubError);

  sessionRouter.get("/githubCallback", passport.authenticate("githubLogin", {failureRedirect:"api/sessions/githubError"}), SessionController.githubCallback);

  sessionRouter.delete("/inactive", isAdmin, SessionController.deleteUserInactive)
  

  // delete user para la vista de admin
  sessionRouter.post("/:id", isAdmin, SessionController.deleteUser)

  sessionRouter.post("/:id/role", isAdmin, SessionController.updateUserRole)

// LOGOUT
sessionRouter.get('/logout', SessionController.logout);



module.exports = sessionRouter;