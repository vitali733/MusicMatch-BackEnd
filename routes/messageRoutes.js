const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { checkToken } = require("../middlewares/checkToken");

const router = express.Router();

router.route("/:chatId").get(checkToken, allMessages);
router.route("/").post(checkToken, sendMessage);

module.exports = router;
