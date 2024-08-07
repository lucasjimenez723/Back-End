const authenticate = (req, res, next) => { 
    if (req.session && req.session.user) {
        res.locals.isAuthenticated = true;
        res.locals.isAdmin = req.session.user.role === 'admin'; 
        next();
    } else {
        res.locals.isAuthenticated = false;
        res.locals.isAdmin = false;
        next();
    }
}

module.exports = authenticate;