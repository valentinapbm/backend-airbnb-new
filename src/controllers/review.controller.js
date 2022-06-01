const BookingSite = require("../models/bookingsite.model");
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
      // .populate({
      //   path: "user",
      //   Select: "name",
      // })
      .populate("userId", "name lastname email")
      .populate("bookingSiteId")
      .then((review) => {
        res.status(200).json(review);
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  },

  //post
  async create(req, res) {
    try {
      // const { userId } = req.params;
      const { userId, bookingSiteId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Invalid user");
      }

      const bookingSite = await BookingSite.findById(bookingSiteId);
      if (!bookingSite) {
        throw new Error("Invalid bookingsite");
      }

      const review = await Review.create({ ...req.body });

      user.reviews.push(review);
      bookingSite.reviews.push(review);

      await user.save({ validateBeforeSave: false });
      await bookingSite.save({ validateBeforeSave: false });

      res.status(201).json(review);
    } catch (err) {
      res.status(400).json(err);
    }
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
