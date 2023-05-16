const userRouter = require('express').Router()
const { createUser, getOneUser, login,  } = require('../controllers/userControllers.js')
const  checkToken  = require('../middlewares/checkToken.js')

//mounted on /user
userRouter.route('/login').post(login)
userRouter.route('/register').post(createUser)
userRouter.route('/user').get(checkToken, getOneUser)

module.exports = userRouter