const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { checkToken } = require("../middlewares/checkToken");

const router = express.Router();

router.route("/").post(checkToken, accessChat);
router.route("/").get(checkToken, fetchChats);
router.route("/group").post(checkToken, createGroupChat);
router.route("/rename").put(checkToken, renameGroup);
router.route("/groupremove").put(checkToken, removeFromGroup);
router.route("/groupadd").put(checkToken, addToGroup);

module.exports = router;
