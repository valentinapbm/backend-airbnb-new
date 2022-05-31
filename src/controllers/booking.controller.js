const Booking = require("../models/booking.model");
const User = require("../models/user.model");

module.exports = {
  //get
  list(req, res) {
    Booking.find()
      .then((booking) => {
        res.status(200).json({ message: "bookings found", data: booking });
      })
      .catch((err) => {
        res.status(404).json({ message: "bookings not found", data: err });
      });
  },

  //get by id
  show(req, res) {
    const { bookingId } = req.params;

    Booking.findById(bookingId)
      .populate({
        path: "user",
        select: "name",
      })
      .then((booking) => {
        res.status(200).json({ message: "booking found", data: booking });
      })
      .catch((err) => {
        res.status(404).json(err);
      });
  },

  // post
  create(req, res) {
    const { userId } = req.params;

    Booking.create({ ...req.body, user: userId })
      .then((booking) => {
        User.findById(userId).then((user) => {
          user.bookings.push(booking);
          user.save({ validateBeforeSave: false }).then(() => {
            res.status(201).json(booking);
          });
        });
      })
      .catch((err) => res.status(400).json(err));
  },
  //update
  update(req, res) {
    const { bookingId } = req.params;
    Booking.findByIdAndUpdate(bookingId, req.body, { new: true })
      .then((booking) => {
        res.status(200).json({ message: "booking updated", data: booking });
      })
      .catch((err) => {
        res
          .status(400)
          .json({ mmessage: "booking could not be updated", data: err });
      });
  },
  //delete
  destroy(req, res) {
    const { bookingId } = req.params;

    Booking.findByIdAndDelete(bookingId)
      .then((booking) => {
        res.status(200).json({ message: "booking deleted", data: booking });
      })
      .catch((err) => {
        res.status(400).json({ message: "booking cant be deleted" });
      });
  },
};
