const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  bookingSite: {
    type: Schema.Types.ObjectId,
    ref: "BookingSite",
    required: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: [50, "title too long"],
  },
  message: {
    type: String,
    required: true,
    maxlength: [200, "title too long"],
  },
});

const Review = model("Review", reviewSchema);
module.exports = Review;
