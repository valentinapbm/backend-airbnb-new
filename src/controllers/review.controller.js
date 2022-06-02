const BookingSite = require("../models/bookingsite.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");

module.exports = {
  // Get
  async list(req, res) {
    try {
      const review = await Review.find();
      res.status(200).json(review);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  //Get by id
  async show(req, res) {
    try {
      const { reviewId } = req.params;
      const review = await Review.findById(reviewId)
        .populate("userId", "name lastname email")
        .populate("bookingSiteId", "title description");
      res.status(200).json(review);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  //post
  async create(req, res) {
    try {
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
  async update(req, res) {
    try {
      const { reviewId } = req.params;
      const review = await Review.findByIdAndUpdate(reviewId, req.body, {
        new: true,
        runValidators: true, context: 'query'
      });
      res.status(200).json({ message: "review updated", data: review });
    } catch (err) {
      res
        .status(400)
        .json({ mmessage: "review could not be updated", data: err });
    }
  },
  //delete
  async destroy(req, res) {
    try {
      const { reviewId } = req.params;
      const { userId, bookingSiteId } = req.body;

      const review = await Review.findByIdAndDelete(reviewId,userId, bookingSiteId);


      res.status(200).json({ message: "review deleted", data: review });
    } catch (err) {
      res.status(400).json({ message: "review cant be deleted", data: err });
    }
  },
};
