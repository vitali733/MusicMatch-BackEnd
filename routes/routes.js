const Router = require('express').Router()
const { 
    createUser,
    getLoggedInUser,
    login,
    updateUser,
    deleteUser,
    logout,
    getAllUsers,
    getUserById,
    getUsersAround,
    getMatches,
    testController
} = require('../controllers/userControllers.js')
const  checkToken  = require('../middlewares/checkToken.js')
const { checkId, checkRegister, checkLogin } = require('../middlewares/validateReq.js')
const checkCharacteristics = require('../middlewares/checkCharacteristics.js')
const { getAllCharacteristics } = require('../controllers/characteristicControllers.js')
const appendUsersAround = require('../middlewares/appendUsersAround')



Router.route('/characteristics').get(getAllCharacteristics)

Router.route('/users/login').post(checkLogin,login)
Router.route('/users/logout').get(checkToken, logout)
Router.route('/users/register').post(checkRegister, createUser)
Router.route('/users/all/').get(checkToken, getAllUsers)
Router.route('/users/me/').get(checkToken, getLoggedInUser).put(checkToken, checkCharacteristics, updateUser).delete(checkToken, deleteUser)
Router.route('/users/around').get(checkToken, appendUsersAround, getUsersAround)
Router.route('/users/getuser/:id/').get(checkToken, checkId, getUserById)
Router.route('/users/getmatches').get(checkToken, appendUsersAround, getMatches)



module.exports = Router