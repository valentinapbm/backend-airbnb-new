const { Schema, model, models } = require("mongoose");

const emailRegex = new RegExp(
    "[a-z0-9._-]*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?[.])+[a-z0-9]{2,}"
);
const nameRegex = new RegExp("(?:[a-zA-Z](?:[a-zA-Z]*[a-zA-Z]+$)+$)+$");
const birthdayRegex = new RegExp("[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$");
const passRegex = new RegExp("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
const commentRegex = new RegExp("[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$");
const userSchema = new Schema(

    {
        role: {
            type: String,
            required: true,
            enum: {
                values: ["host", "guest", "admin"],
                message: "invalid role",
            }
        },
        name: {
            type: String,
            required: true,
            match: [nameRegex, "name must contain only letters"],
            minlength: [2, "name too short"],
            maxlength: [10, "name too long"],
        },
        lastname: {
            type: String,
            required: true,
            match: [nameRegex, "lastname must contain only letters"],
            minlength: [2, "lastname too short"],
            maxlength: [10, "name too long"],
        },
        email: {
            type: String,
            required: true,
            match: [emailRegex, "invalid email"],
            validate: [{
                validator(value) {
                    return models.User.findOne({ email: value })
                        .then((user) => !user)
                        .catch(() => false)
                },
                message: "email already exist",
            }]
        },
        birthday: {
            type: Date,
            required: true,

        },
        password: {
            type: String,
            required: true,
            match: [passRegex, "password invalid"],

        },
        description: {
            type: String,
            maxlength: [100, "too long description"],
            match: [commentRegex, "invalid comment"]
        },
        image: {
            type: String
        },
        bookingsites: {
            type: [{ type: Schema.Types.ObjectId, ref: "BookingSite" }],
            required: false,
        },
        bookings: {
            type: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
            required: false,
        },
        reviews: {
            type: [{ type: Schema.Types.ObjectId, ref: "Review" }],
            required: false,
        },

    }, { timestamps: true }

);
const User = model("User", userSchema);
module.exports = User;
