const ErrorStatus = require('../utils/errorStatus.js')
const jwt = require('jsonwebtoken')

const checkToken = (req, res, next) => {

    try {
        const {token} = req.cookies;
        if(!token) throw new ErrorStatus('no token sent', 400);

        //jwt.verify() returns payload if successfull
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        // append userId to req object
        req.userId = _id;
        req.user = { _id };
      
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = checkToken;