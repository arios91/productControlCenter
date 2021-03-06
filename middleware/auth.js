const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = function(req, res, next) {
    //get token from header
    const token = req.header('x-auth-token');
    
    //check if no token
    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    //verify token if found
    try{
        const decoded = jwt.verify(token, keys.jwtSecret);
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg: 'Invalid token'})
    }
}