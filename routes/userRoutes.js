const userRouter = require('express').Router()
const { createUser, getLoggedInUser, login, updateUser, deleteUser, logout, getAllUsers, getUserById, getUsersWithinRadius } = require('../controllers/userControllers.js')
const  checkToken  = require('../middlewares/checkToken.js')
const { checkErrors, checkId, checkRegister, checkLogin, checkRadiusSearch } = require('../middlewares/validateReq.js')


//mounted on '/users' in server.js
userRouter.route('/login').post(checkLogin,login)
userRouter.route('/logout').get(checkToken, logout)
userRouter.route('/register').post(checkRegister, createUser)
userRouter.route('/users/all/').get(checkToken, getAllUsers)
userRouter.route('/users/me/').get(checkToken, getLoggedInUser).put(checkToken, updateUser).delete(checkToken, deleteUser)
userRouter.route('/users/around').get(checkRadiusSearch, getUsersWithinRadius)
userRouter.route('/users/getuser/:id/').get(checkToken, checkId, getUserById)


// TO DO: GET REQUEST userRouter route for getting all users back from the database [DONE]
// TO DO: logout user [DONE]

module.exports = userRouter