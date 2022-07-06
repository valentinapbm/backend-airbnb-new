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
    date: [
      {
        type: String,
        required: true,
      },
    ],
    customId: {
      type: String,
      required: true,
    },
    invoiceNum:{
      type:String
    },
    description:{
      type:String
    },
    totalNights: {
      type:Number
    },
    amount: {
      type:Number
    },
    currency:{
      type:String},

  statusBooking:{
    type:String
  },
  },
  {
    timestamps: true,
  }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
