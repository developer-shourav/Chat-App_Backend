const User = require("../models/User");
const Role = require("../models/Role");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      // console.log("getAllUsersWorks");
      const users = await User.find().select("-authKey");
      res.json(users);
    } catch (e) {
      console.log(e);
    }
  },
  getUserByJwt: async (req, res) => {
    try {
      /* console.log("getUserByJwt works");
      console.log(req.user); */
      const { id: userId } = req.user;
      const user = await User.findOne({ _id: userId });
      res.json(user);
    } catch (e) {
      console.log(e);
    }
  },
  getUserById: async (req, res) => {
    try {
      /* console.log("getUserById works");
      console.log(req.body); */
      const { userId } = req.body;
      const user = await User.findOne({ _id: userId }).populate("cards");
      res.json(user);
    } catch (e) {
      console.log(e);
    }
  },

  deleteUserById: async (req, res) => {
    try {
      /* console.log("deleteUserById");
      console.log(req.body); */
      const { userId } = req.body;
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(400).json({
          message: `User with id ${userId} didn't find`,
        });
      }
      await User.findByIdAndDelete({ _id: userId });
      const users = await User.find().select("-authKey");
      res.status(200).json({
        message: `User with id ${userId} deleted`,
        users: users,
      });
    } catch (e) {
      console.log(e);
    }
  },

  updateUserRole: async (req, res) => {
    try {
     /*  console.log("updateUserRole");

      // console.log(req.user);
      console.log(req.body); */
      const { userId, newRole } = req.body;
      /* console.log(userId); */
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(400).json({
          message: `User with id ${userId} didn't find`,
        });
      }
      await User.findByIdAndUpdate(userId, {
        role: newRole,
      });
      const users = await User.find().select("-authKey");
      res.status(200).json({
        message: `User with id ${userId} role updated`,
        users: users,
      });
    } catch (e) {
      console.log(e);
    }
  },
};
