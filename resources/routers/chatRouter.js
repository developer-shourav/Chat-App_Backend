const router = require("express").Router();
const { check } = require("express-validator");

const chatController = require("../controllers/chatController");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const uploadFilesMiddleware = require("../../middleware/multerMiddleware");
const {
  getPinMessage,
  getPinnedMessages,
} = require("../controllers/GetPinMessage");

router.get("/", authMiddleware, chatController.getAllChats);

/* -------------Delete Chat -------------------- */
router.delete(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  chatController.deleteChat
);

/* -------------Delete Message -------------------- */

router.delete(
  "/deleteMsg",
  authMiddleware,
  roleMiddleware("ADMIN"),
  chatController.deleteMessage
);


router.get("/:chatId", authMiddleware, chatController.getChat);

router.post(
  "/:chatId/sendPinMessage",
  authMiddleware,
  chatController.sendPinMessage
);
router.post("/:chatId/sendMessage", authMiddleware, chatController.sendMessage);

// Define the route to get pinned messages for a specific chat
router.post("/:chatId/pin", chatController.getPinMessage);
router.delete("/:chatId/deletePin", chatController.deletePinMessage);
router.put("/:chatId/updatePin", chatController.updatePinMessage);


// In your backend route handler
// In your backend route handler

// router.post(
//     "/:chatId/sendFile",
//     authMiddleware,
//     uploadFilesMiddleware,
//     chatController.sendFile
// );

router.post("/getFile", authMiddleware, chatController.getFile);

router.post(
  "/new",
  [check("chatName", "Chat Name can not be empty").notEmpty()],
  authMiddleware,
  roleMiddleware("ADMIN"),
  chatController.createNewChat
);

router.post(
  "/addUserToChat",
  [
    check("chatId", "chatId can not be empty").notEmpty(),
    check("userId", "userId can not be empty").notEmpty(),
  ],
  authMiddleware,
  roleMiddleware("ADMIN"),
  chatController.addUserToChat
);

router.put(
  "/addUserToChat",
  [
    check("chatId", "chatId can not be empty").notEmpty(),
    check("userId", "userId can not be empty").notEmpty(),
  ],
  authMiddleware,
  roleMiddleware("ADMIN"),
  chatController.addUserToChat
);

router.put(
  "/deleteUserFromChat",
  [
    check("chatId", "chatId can not be empty").notEmpty(),
    check("userId", "userId can not be empty").notEmpty(),
  ],
  authMiddleware,
  roleMiddleware("ADMIN"),
  chatController.deleteUserFromChat
);

router.put(
  "/addUsersArrToChat",
  [check("chatId", "chatId can not be empty").notEmpty()],
  authMiddleware,
  roleMiddleware("ADMIN"),
  chatController.addUsersArrToChat
);

module.exports = router;
