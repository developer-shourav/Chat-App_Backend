const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const { secret } = require("../../common/config");
const User = require("../models/User");
const Role = require("../models/Role");

const generateAccessToken = (id, role, username) => {
  const payload = {
    id,
    role,
    username,
  };
  return jwt.sign(payload, secret, { expiresIn: "48h" });
};

module.exports = {
  userSignUp: async (req, res) => {
    try {
      // console.log('this is userSignUp')

      const errors = validationResult(req);
    /*   console.log("----"); */
      console.log(errors);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: `validation error:`, ...errors });
      }
      const { username, authKey } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with this username already exist" });
      }
      const hashAuthKey = bcrypt.hashSync(authKey, 7);
      const userRole = await Role.findOne({ value: "USER" });
      // console.log(userRole)
      const user = new User({
        username,
        authKey: hashAuthKey,
        role: userRole.value,
      });
      await user.save();
      const users = await User.find();
      return res.json({ message: "User registration successfully", users });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error", error: e });
    }
  },

  userLogin: async (req, res) => {
    try {
      /* console.log("this is login"); */
      const { authKey } = req.body;
     /*  console.log(authKey); */
      const users = await User.find();
     /*  console.log(users); */
      let user;
      users.forEach((el, i) => {
       /*  console.log(`this is iteration ${i} ${authKey}, ${el.authKey}`); */
        const validAuthKey = bcrypt.compareSync(authKey, el.authKey);
        if (validAuthKey) {
          user = el;
        }
      });
      if (!user) {
        return res.status(400).json({ message: `User didn't find` });
      }
      // const validPassword = bcrypt.compareSync(password, user.password);
      // if (!validPassword) {
      //     return res.status(400).json({ message: "Password incorrect" });
      // }
      const token = generateAccessToken(user._id, user.role, user.username);
      return res.json({ user, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Login error" });
    }
  },

  jwt: async (req, res) => {
    try {
      // console.log("this is jwt");
      let { token } = req.body;
     /*  console.log("1111111111111111"); */
      const decodedData = jwt.verify(token, secret);
     /*  console.log(decodedData);
      console.log("22222222222222222"); */
      const userId = decodedData.id;
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res
          .status(400)
          .json({ message: `User with id ${userId} didn't find` });
      }
      token = generateAccessToken(user._id, user.role, user.username);
      return res.json({ user, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Jwt error" });
    }
  },
};
