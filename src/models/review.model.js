const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  bookingSiteId: {
    type: Schema.Types.ObjectId,
    ref: "BookingSite",
    required: false,
  },
  userId: {
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
  rating: {
    type: Array,
    required:true,
  },
});

const Review = model("Review", reviewSchema);
module.exports = Review;
