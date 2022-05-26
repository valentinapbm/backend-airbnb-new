const { create } = require("../models/user.model");
const User = require("../models/user.model");

module.exports = {

    //GET -READ
    list(req, res){
        User.find()
        .then((users) => {
            res.status(200).json({ message: "Users found", data: users });
        })
        .catch((err) => {
            res.status(404).json({ message: "User not found" });
        });
    },
    //show ID
    show(req, res) {
        const { userId } = req.params;
    
        User.findById(userId)
        .then((user) => {
            res.status(200).json({ message: "User found", data: user });
        })
        .catch((err) => {
            res.status(404).json({ message: "User not found" });
        });
    },


    //Create -POST
    create(req,res){
        const data =req.body;
        const newUser = {
            ...data,
            
        };

        User.create(newUser)
        .then((user) => {
            res.status(201).json({ message: "user created", data: user });
        })
        .catch((err) => {
            res
            .status(400)
            .json({ message: "user could not be created", data: err });
        });
    },
    //Update PUT
    update(req, res){
        const { userId } = req.params;

    User.findByIdAndUpdate(userId, req.body, { new: true })
    .then((user) => {
        res.status(200).json({ message: "User updated", data: user });
    })
    .catch((err) => {
        res
        .status(400)
        .json({ message: "User could not be updated", data: err });
    });
    },
    //Delete
    destroy(req, res) {
        const { userId } = req.params;
    
        User.findByIdAndDelete(userId)
        .then((user) => {
            res.status(200).json({ message: "User deleted", data: user });
        })
        .catch((err) => {
            res
            .status(400)
            .json({ message: "User could not be deleted", data: err });
        });
    },
}