const passport = require('passport');
const local = require('passport-local');
const github = require('passport-github2').Strategy;
const UserManager = require('../dao/userManager');
const { userModel } = require("../dao/models/users.modelo");
const bcrypt = require('bcrypt');
const config = require('./config');
const logger = require('../utils/logger');

const userManager = new UserManager();

// REGISTER PASSPORT

const passportConfig = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        try {
          const { username, role } = req.body;

          if (!username || !email || !password) {
            return done(null, false, { message: "Username, email, and password are required" });
          }

          const userExists = await userManager.getUserByFilter({ email });
          if (userExists) {
            return done(null, false, { message: "User already exists" });
          }

          const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
          const newUser = await userManager.addUser(username, email, hashedPassword, role);
          return done(null, newUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

      // github
        passport.use(
          "githubLogin",
            new github(
              {
                clientID:config.GITHUB_CLIENT_ID,
                clientSecret:config.GITHUB_CLIENT_SECRET,
                callbackURL:"http://localhost:8080/api/sessions/githubCallback",
              },
              async function(accessToken, refreshToken, profile, done){
                try{
                  let name = profile._json.username;
                  let email = profile._json.email;
                  let user = await userModel.findOne({email})
                  if(!user){
                    user = await userModel.create({name, email, profileGithub: profile})
                  }
                }
                catch(error){
                  return done(error);
                }
              }
            )
        )
    
      //  Login
      passport.use(
        "login",
        new local.Strategy(
          {
            usernameField: "email"
          },
          async (email, password, done) => {
            try {
              const user = await userManager.getUserByFilter({ email });
              if (!user) {
                return done(null, false, { message: "Credenciales incorrectas" });
              }
      
              const isPasswordValid = bcrypt.compareSync(password, user.password);
              if (!isPasswordValid) {
                return done(null, false, { message: "Credenciales incorrectas" });
              }
      
              return done(null, user);
            } catch (error) {
              return done(error);
            }
          }
        )
      );
    
    passport.serializeUser((user, done) => {
        return done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
            const user = await userManager.getUserByFilter({ _id: id });
            return done(null, user);
    });
}

module.exports = passportConfig;