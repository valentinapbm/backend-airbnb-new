const Review = require("../models/review.model");
const User = require("../models/user.model");

module.exports = {
  // Get
  list(req, res) {
    Review.find()
      .then((review) => {
        res.status(200).json(review);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
  //Get by id
  show(req, res) {
    const { reviewId } = req.params;
    Review.findById(reviewId)
      .populate({
        path: "user",
        Select: "name",
      })
      .then((review) => {
        res.status(200).json(review);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  },

  //post
  create(req, res) {
    const { userId } = req.params;

    Review.create({ ...req.body, user: userId })
      .then((review) => {
        User.findById(userId).then((user) => {
          user.reviews.push(review);
          user.save({ validateBeforeSave: false }).then(() => {
            res.status(201).json(review);
          });
        });
      })
      .catch((err) => res.status(400).json(err));
  },
  //update
  update(req, res) {
    const { reviewId } = req.params;
    Review.findByIdAndUpdate(reviewId, req.body, { new: true })
      .then((review) => {
        res.status(200).json({ message: "review updated", data: review });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ mmessage: "review could not be updated", data: err });
      });
  },
  //delete
  destroy(req, res) {
    const { reviewId } = req.params;

    Review.findByIdAndDelete(reviewId)
      .then((review) => {
        res.status(200).json({ message: "review deleted", data: review });
      })
      .catch((err) => {
        res.status(400).json({ message: "review cant be deleted" });
      });
  },
};
