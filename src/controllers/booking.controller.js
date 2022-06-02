const BookingSite = require("../models/bookingsite.model");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");

module.exports = {
  //get
  async list(req, res) {
    try {
      const booking = await Booking.find();
      res.status(200).json({ message: "bookings found", data: booking });
    } catch (err) {
      res.status(404).json({ message: "bookings not found", data: err });
    }
  },
  //get by id
  async show(req, res) {
    try {
      const { bookingId } = req.params;
      const bookingById = await Booking.findById(bookingId).populate({
        path: "user",
        select: "name",
      });
      res.status(200).json({ message: "booking found", data: bookingById });
    } catch (err) {
      res.status(404).json(err);
    }
  },
  // post
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

        const booking = await Booking.create({ ...req.body });

        user.bookings.push(booking);
        bookingSite.bookings.push(booking);

        await user.save({ validateBeforeSave: false });
        await bookingSite.save({ validateBeforeSave: false });

        res.status(201).json(booking);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  //update
  async update(req, res) {
    try {
      const { bookingId } = req.params;
      const booking = Booking.findByIdAndUpdate(bookingId, req.body, {
        new: true,
        runValidators: true, context: 'query'
      });
      res.status(200).json({ message: "booking updated", data: booking });
    } catch (err) {
      res
        .status(400)
        .json({ mmessage: "booking could not be updated", data: err });
    }
  },
  //delete
  async destroy(req, res) {
    try {
      const { bookingId } = req.params;
      const booking = Booking.findByIdAndDelete(bookingId);
      res.status(200).json({ message: "booking deleted", data: booking });
    } catch (err) {
      res.status(400).json({ message: "booking cant be deleted" });
    }
  },
};
