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
const {
    accessChat,
    fetchChats,
    createGroupChat,
    removeFromGroup,
    addToGroup,
    renameGroup,
  } = require("../controllers/chatControllers.js");
  const {
    allMessages,
    sendMessage,
  } = require("../controllers/messageControllers");



Router.route('/characteristics').get(getAllCharacteristics)

Router.route('/users/login').post(checkLogin,login)
Router.route('/users/logout').get(checkToken, logout)
Router.route('/users/register').post(checkRegister, createUser)
Router.route('/users/all/').get(checkToken, getAllUsers)
Router.route('/users/me/').get(checkToken, getLoggedInUser).put(checkToken, checkCharacteristics, updateUser).delete(checkToken, deleteUser)
Router.route('/users/around').get(checkToken, appendUsersAround, getUsersAround)
Router.route('/users/getuser/:id/').get(checkToken, checkId, getUserById)
Router.route('/users/getmatches').get(checkToken, appendUsersAround, getMatches)
Router.route("/api/chat").post(checkToken, accessChat);
Router.route("/api/chat").get(checkToken, fetchChats);
Router.route("/api/chat/group").post(checkToken, createGroupChat);
Router.route("/api/chat/rename").put(checkToken, renameGroup);
Router.route("/api/chat/groupremove").put(checkToken, removeFromGroup);
Router.route("/api/chat/groupadd").put(checkToken, addToGroup);
Router.route("/api/message/:chatId").get(checkToken, allMessages);
Router.route("/api/message").post(checkToken, sendMessage);




module.exports = Router