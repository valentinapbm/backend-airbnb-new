const BookingSite = require("../models/bookingsite.model");
const Booking = require("../models/booking.model");
const User = require("../models/user.model");
const {transporter, bookingCreatedHost, bookingCreatedGuest,cancelguest, cancelUser} = require("../utils/mailer")
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
      const bookingById = await Booking.findById(bookingId)
        .populate("userId", "name")
        .populate("bookingSiteId", "title");
      res.status(200).json({ message: "booking found", data: bookingById });
    } catch (err) {
      res.status(404).json(err);
    }
  },
  // post
  async create(req, res) {
    try {
      const { bookingSiteId, date, invoiceNum, description, amount} = req.body;
      const userId = req.user;
      console.log(userId)

      const customId = `${bookingSiteId}${userId}${date[0]}${date[1]}`;
      const startDate = `${new Date(date[0]).getDate()}/${new Date(date[0]).getMonth() + 1}/${new Date(date[0]).getFullYear()}`
      const endDate = `${new Date(date[1]).getDate()}/${new Date(date[1]).getMonth() + 1}/${new Date(date[1]).getFullYear()}`
      console.log("customID", startDate, endDate);

      const bookingSearch = await Booking.findOne({
        customId: customId,
      });

      if (bookingSearch) {
        console.log("entro al if de bookingg seacrh");
        throw new Error("Booking already exist");}

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Invalid user");
      }

      const bookingSite = await BookingSite.findById(bookingSiteId);
      if (!bookingSite) {
        throw new Error("Invalid bookingsite");
      }
      const userHostId = bookingSite.userId;
      const userHost = await User.findById(userHostId);

      const booking = await Booking.create({
        ...req.body,
        userId: user._id,
        bookingSiteId: bookingSite,
        customId: customId,
      });

      user.bookings.push(booking); 
      bookingSite.bookings.push(booking);
      console.log(userHost.email, userHost.name, description, user.email, amount, date[0], date[1], bookingSite.title)
      await user.save({ validateBeforeSave: false });
      await bookingSite.save({ validateBeforeSave: false });
      await transporter.sendMail(bookingCreatedHost(userHost.email, userHost.name, description, user.email, amount,startDate, endDate, bookingSite.title, invoiceNum));
      await transporter.sendMail(bookingCreatedGuest(userHost.email, user.name, description, user.email, amount,startDate, endDate, bookingSite.title, invoiceNum));
      res.status(201).json(booking);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  //cancel
  async cancel(req, res) {
    try {
      const { bookingId, description } = req.body;
      console.log(bookingId)
      const booking =await Booking.findByIdAndUpdate(bookingId, {statusBooking:"cancelled"}, {
        new: true,
        runValidators: true,
        context: "query",
      });
      console.log(booking)
      const guestId = booking.userId
      const guest = await User.findById(guestId);

      const bookingSiteId=booking.bookingSiteId;
      const bookingSite = await BookingSite.findById(bookingSiteId)
      const hostId= bookingSite.userId
      const host= await User.findById(hostId);
      bookingSite.bookings.filter(item => item.toString() !== bookingId);
      bookingSite.save({validateBeforeSave:false});
      res.status(200).json({ message: "booking cancelled", data: booking });
      await transporter.sendMail(cancelguest(guest.email, guest.name, host.name, bookingSite.title, description ));
    } catch (err) {
      res
        .status(400)
        .json({ mmessage: "booking not cancelled", data: err });
    }
  },

  //cancel
  async cancelUser(req, res) {
    try {
      const { bookingId } = req.body;
      console.log(bookingId)
      const booking =await Booking.findByIdAndUpdate(bookingId, {statusBooking:"cancelled"}, {
        new: true,
        runValidators: true,
        context: "query",
      });
      console.log(booking)
      const guestId = booking.userId
      const guest = await User.findById(guestId);

      const bookingSiteId=booking.bookingSiteId;
      const bookingSite = await BookingSite.findById(bookingSiteId)
      const hostId= bookingSite.userId
      const host= await User.findById(hostId);
      bookingSite.bookings.filter(item => item.toString() !== bookingId);
      bookingSite.save({validateBeforeSave:false});
      await transporter.sendMail(cancelUser(host.email, guest.name, host.name, bookingSite.title));
      res.status(200).json({ message: "booking cancelled", data: booking });
    } catch (err) {
      res
        .status(400)
        .json({ mmessage: "booking not cancelled", data: err });
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
