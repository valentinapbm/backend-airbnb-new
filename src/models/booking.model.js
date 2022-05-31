const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    bookingSite: {
      type: Schema.Types.ObjectId, // sitio con id unico
      ref: "BookingSite",
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
