const Router = require("express").Router();
const {
  createUser,
  getLoggedInUser,
  login,
  updateUser,
  deleteUser,
  logout,
  getAllUsers,
  allUsers,
  getUserById,
  getUsersAround,
  addSkinTerest,
  deleteSkinTerest,
} = require("../controllers/userControllers.js");
const { getMatches } = require("../controllers/matchControllers.js");
const checkToken = require("../middlewares/checkToken.js");
const checkSkinTerest = require("../middlewares/checkSkinTerest.js");
const {
  checkId,
  checkRegister,
  checkLogin,
} = require("../middlewares/validateReq.js");
const checkCharacteristics = require("../middlewares/checkCharacteristics.js");
const {
  getAllCharacteristics,
} = require("../controllers/characteristicControllers.js");
const appendUsersAround = require("../middlewares/appendUsersAround");
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


//characteristics routes
Router.route("/characteristics").get(getAllCharacteristics);

//user routes
Router.route("/users/login").post(checkLogin, login);
Router.route("/users/logout").get(checkToken, logout);
Router.route("/users/register").post(checkRegister, createUser);
Router.route("/users/all/").get(checkToken, getAllUsers);
Router.route("/users/me/")
  .get(checkToken, getLoggedInUser)
  .put(checkToken, checkCharacteristics, updateUser)
  .delete(checkToken, deleteUser);
Router.route("/users/me/interests").post(
  checkToken,
  checkSkinTerest,
  addSkinTerest
);
Router.route("/users/me/interests/delete").put(
  checkToken,
  checkSkinTerest,
  deleteSkinTerest
);

Router.route("/users/around").get(
  checkToken,
  appendUsersAround,
  getUsersAround
);
Router.route("/users/getuser/:id/").get(checkToken, checkId, getUserById);
Router.route("/users/getmatches").get(
  checkToken,
  appendUsersAround,
  getMatches
);


//Interests - Skills routes
Router.route("/users/me/skills").post(
  checkToken,
  checkSkinTerest,
  addSkinTerest
);
Router.route("/users/me/skills/delete").put(
  checkToken,
  checkSkinTerest,
  deleteSkinTerest
);


//chat routes
Router.route("/api/user").get(checkToken, allUsers);

Router.route("/api/chat").post(checkToken, accessChat);
Router.route("/api/chat").get(checkToken, fetchChats);
Router.route("/api/chat/group").post(checkToken, createGroupChat);
Router.route("/api/chat/rename").put(checkToken, renameGroup);
Router.route("/api/chat/groupremove").put(checkToken, removeFromGroup);
Router.route("/api/chat/groupadd").put(checkToken, addToGroup);

Router.route("/api/message/:chatId").get(checkToken, allMessages);
Router.route("/api/message").post(checkToken, sendMessage);

module.exports = Router;
