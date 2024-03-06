const router = require("express").Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const userController = require("../controllers/userController");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.getAllUsers
);

router.post(
  "/getUserById",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.getUserById
);

router.delete(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.deleteUserById
);

router.get("/me", authMiddleware, userController.getUserByJwt);

router.put(
  "/updateUserRole",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.updateUserRole
);

// router.post("/addCard", authMiddleware, userController.addCard);
// router.post("/deleteCard", authMiddleware, userController.deleteCard);

module.exports = router;
