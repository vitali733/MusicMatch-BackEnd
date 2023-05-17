const userRouter = require('express').Router()
const { createUser, getOneUser, login, updateUser } = require('../controllers/userControllers.js')
const  checkToken  = require('../middlewares/checkToken.js')

//mounted on '/users' in server.js
userRouter.route('/login').post(login)
userRouter.route('/register').post(createUser)
userRouter.route('/me/profile').get(checkToken, getOneUser).put(checkToken, updateUser)

// TO DO: GET REQUEST userRouter route for getting all users back from the database
// TO DO: logout user

module.exports = userRouter