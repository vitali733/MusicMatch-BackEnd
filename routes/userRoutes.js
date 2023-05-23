const userRouter = require('express').Router()
const { createUser, getLoggedInUser, login, updateUser, deleteUser, logout, getAllUsers, getUserById, getUsersWithinRadius } = require('../controllers/userControllers.js')
const  checkToken  = require('../middlewares/checkToken.js')
const { checkErrors, checkId, checkRegister, checkLogin, checkRadiusSearch } = require('../middlewares/validateReq.js')
const checkCharacteristics = require('../middlewares/checkCharacteristics.js')


userRouter.route('/login').post(checkLogin,login)
userRouter.route('/logout').get(checkToken, logout)
userRouter.route('/register').post(checkRegister, createUser)
userRouter.route('/users/all/').get(checkToken, getAllUsers)
userRouter.route('/users/me/').get(checkToken, getLoggedInUser).put(checkToken, checkCharacteristics, updateUser).delete(checkToken, deleteUser)
userRouter.route('/users/around').get(checkRadiusSearch, getUsersWithinRadius)
userRouter.route('/users/getuser/:id/').get(checkToken, checkId, getUserById)


module.exports = userRouter