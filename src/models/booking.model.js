const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    bookingSiteId: {
      type: Schema.Types.ObjectId,
      ref: "BookingSite",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
