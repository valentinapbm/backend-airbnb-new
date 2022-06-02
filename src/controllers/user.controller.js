const User = require("../models/user.model");

module.exports = {
  //GET -READ
  async list(req, res) {
    try {
      const users = await User.find();
      res.status(200).json({ message: "Users found", data: users });
    } catch (err) {
      res.status(404).json({ message: "User not found" });
    }
  },
  //show ID
  async show(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId)
        .select("-password")
        .populate("bookings", "date")
        .populate("reviews", "title message")
        .populate("bookingsites", "title description");
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json(err);
    }
  },

  //Create -POST
  async create(req, res) {
    try {
      const data = req.body;
      const newUser = { ...data };
      const user = await User.create(newUser);
      res.status(201).json({ message: "user created", data: user });
    } catch (err) {
      res.status(400).json({ message: "user could not be created", data: err });
    }
  },
  //Update PUT
  async update(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
        context: "query",
      });
      res.status(200).json({ message: "User updated", data: user });
    } catch (err) {
      res.status(400).json({ message: "User could not be updated", data: err });
    }
  },
  //Delete
  async destroy(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted", data: user });
    } catch (err) {
      res.status(400).json({ message: "User could not be deleted", data: err });
    }
  },
};
