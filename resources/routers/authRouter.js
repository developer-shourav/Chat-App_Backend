const router = require("express").Router();
const { check } = require("express-validator");

const authController = require("../controllers/authController");

router.post(
  "/signup",
  // [
  //   check("username", "Username can not be empty").notEmpty(),
  //   check("authKey", "authKey must be 4-20 symbols").isLength({
  //     min: 4,
  //     max: 20,
  //   }),
  // ],
  authController.userSignUp
);

router.post("/login", authController.userLogin);
router.post("/jwt", authController.jwt);

module.exports = router;
