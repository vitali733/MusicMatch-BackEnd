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
    getUsersWithinRadius,
    getMatches,
    testController
} = require('../controllers/userControllers.js')
const  checkToken  = require('../middlewares/checkToken.js')
const { checkId, checkRegister, checkLogin, checkRadiusSearch } = require('../middlewares/validateReq.js')
const checkCharacteristics = require('../middlewares/checkCharacteristics.js')
const { getAllCharacteristics } = require('../controllers/characteristicControllers.js')



Router.route('/users/login').post(checkLogin,login)
Router.route('/users/logout').get(checkToken, logout)
Router.route('/users/register').post(checkRegister, createUser)
Router.route('/users/all/').get(checkToken, getAllUsers)
Router.route('/users/me/').get(checkToken, getLoggedInUser).put(checkToken, checkCharacteristics, updateUser).delete(checkToken, deleteUser)
Router.route('/users/around').get(checkRadiusSearch, getUsersWithinRadius)
Router.route('/users/getuser/:id/').get(checkToken, checkId, getUserById)

Router.route('/characteristics').get(getAllCharacteristics)

Router.route('/matches').get(checkToken, getMatches)

Router.route('/test').get(testController)



module.exports = Router