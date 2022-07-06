const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  transporter,
  recoverypassword,
  resetpassword,
} = require("../utils/mailer");

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
      const id = req.user;
      console.log("este es el id", id);
      const user = await User.findById(id)
        .select("-password")
        .populate({
          path: "bookings",
          populate: {
            path: "userId",
            select: "name",
          },
        })
        .populate("reviews", "title message")
        .populate({
          path: "bookingsites",
          populate: { path: "bookings", populate: "userId" },
        });
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json(err);
    }
  },

  //Update PUT
  async updateImage(req, res) {
    try {
      const id = req.user;
      const image = req.body.file.secure_url;

      const upImage = await User.findByIdAndUpdate(
        req.user,
        { image: image },
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      res.status(200).json({ message: "User  Image updated", data: upImage });
    } catch (err) {
      res.status(400).json({ message: "User could not be updated", data: err });
    }
  },

  //delete img
  async deleteImage(req, res) {
    try {
      const id = req.user;
      const upImage = await User.findByIdAndUpdate(
        req.user,
        { image: null },
        {
          new: true,
          runValidators: true,
          context: "query",
        }
      );

      res.status(200).json({ message: "User  Image updated", data: upImage });
    } catch (err) {
      res.status(400).json({ message: "User could not be updated", data: err });
    }
  },

  async update(req, res) {
    try {
      const userId = req.user;
      const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
        context: "query",
      })
        .select("-password")
        .populate("bookings", "date")
        .populate("reviews", "title message")
        .populate("bookingsites");
      res.status(200).json({ message: "User updated" });
    } catch (err) {
      res.status(400).json({ message: "User could not be updated", data: err });
    }
  },
  //Delete
  async destroy(req, res) {
    try {
      const  userId = req.user;
      const user = await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted", data: user });
    } catch (err) {
      res.status(400).json({ message: "User could not be deleted", data: err });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;
      const encPassword = await bcrypt.hash(data.password, 8);
      const newUser = { ...data, password: encPassword };
      const user = await User.create(newUser);

      const token = jwt.sign(
        { id: user._id }, //Payload ó datos usuario
        process.env.SECRET_KEY, //llave secreta
        { expiresIn: 60 * 60 * 24 }
      );
      res.status(201).json({
        message: "user created",
        data: { token, name: user.name, email: user.email },
      });
    } catch (err) {
      res.status(400).json({ message: "user could not be created", data: err });
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).populate("bookings");

      if (!user) {
        throw new Error("user or password invalid");
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new Error("user or password invalid");
      }

      const token = jwt.sign(
        { id: user._id }, //Payload ó datos usuario
        process.env.SECRET_KEY, //llave secreta
        { expiresIn: 60 * 60 * 24 }
      );

      res.status(201).json({ message: "user login successfully", data: token });
    } catch (err) {
      res.status(400).json({ message: "user cannot login" });
    }
  },

  async recoveryPass(req, res) {
    try {
      const { email } = req.body;
      console.log("this", email);
      const user = await User.findOne({ email: email });
      console.log("this", user);
      if (!user) {
        throw new Error("Email not found");
      }
      const token = jwt.sign(
        { email }, //Payload ó datos usuario
        process.env.SECRET_KEY, //llave secreta
        { expiresIn: 60 * 60 * 24 }
      );
      console.log(token);
      await transporter.sendMail(recoverypassword(email, token, user.name));
      res.status(201).json({ message: "email sent", data: token });
    } catch (err) {
      res.status(400).json({ message: "email was not sent" });
    }
  },
  async resetPass(req, res) {
    try {
      const email = req.email;
      const { newpassword } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Email not found");
      }
      const encPassword = await bcrypt.hash(newpassword, 8);
      await User.findByIdAndUpdate(
        user._id,
        { password: encPassword },
        { new: true, useFindAndModify: false, runValidators: true }
      );
      await transporter.sendMail(resetpassword(email, user.name));
      res.status(201).json({ message: "password updated successfully" });
    } catch (err) {
      res.status(400).json({ message: "'password was not updated" });
    }
  },
  async changePass(req, res) {
    try {
      const userId = req.user;
      let message = "Invalid old password";
      console.log("Userid:", userId);
      const { password, newpassword } = req.body;
      let authorization = false;
      console.log("Body: ", req.body);
      const user = await User.findById(userId);
      if (!user) {
        throw new Error({ message: "User not found" });
      }
      console.log("User: ", user);
      const isValid = await bcrypt.compare(password, user.password);
      console.log("IsValid:", isValid);
      if (isValid) {
        const encPassword = await bcrypt.hash(newpassword, 8);
        console.log("encPassword: ", encPassword);
        const user = await User.findByIdAndUpdate(
          userId,
          { password: encPassword },
          { new: true, runValidators: true, context: "query" }
        );
        console.log("paso");
        authorization = true;
        message = "password update successfully";
        console.log("User: ", message);
        //await transporter.sendMail(resetpassword(user.email, user.name));
      } /*else {
        //throw new Error({ message: "Invalid Password" });
      }*/
      res.status(201).json({
        message: message,
        data: authorization,
      });
    } catch (err) {
      res.status(400).json({ message: "password was not updated", data: err });
    }
  }, 
};
