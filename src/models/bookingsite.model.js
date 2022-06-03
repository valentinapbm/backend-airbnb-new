const { Schema, model, models } = require("mongoose");
const Booking = require("./booking.model");
const Reviews = require("./review.model");
const User = require("./user.model");

const coordinatesRegex = new RegExp(
  "[-]?[0-9]*[.][0-9]*[,][-]?[0-9]*[.][0-9]*"
);
const commentRegex = new RegExp("[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$");
const BookingSiteSchema = new Schema(
  {
    home_type: {
      type: String,
      required: true,
      enum: {
        values: [
          "apartment",
          "house",
          "attachedhouse",
          "uniqueaccommodation",
          "bedandbreakfasts",
          "hotelboutique",
        ],
        message: "invalid home_type",
      },
    },
    description_type: {
      type: String,
      required: true,
      enum: {
        values: [
          "lodging",
          "cottage",
          "villa",
          "terraced-house",
          "cabin",
          "bungalow",
          "hut",
          "farm",
          "dome",
          "chalet",
          "tiny-house",
          "houseroom",
          "holiday-accommodation",
        ],
        message: "invalid description_type",
      },
    },
    room_type: {
      type: String,
      required: true,
      enum: {
        values: ["entire", "private", "shared"],
        message: "invalid room_type",
      },
    },
    total_occupancy: {
      type: Number,
      required: true,
      min: [1, "must be greater than zero"],
      max: [16, "must be lower than sixteen"],
    },
    total_rooms: {
      type: Number,
      required: true,
      min: [1, "must be greater than zero"],
      max: [50, "must be lower than 50"],
    },
    total_beds: {
      type: Number,
      required: true,
      min: [1, "must be greater than zero"],
      max: [50, "must be lower than 50"],
    },
    total_bathrooms: {
      type: Number,
      required: true,
      min: [1, "must be greater than zero"],
      max: [50, "must be lower than 50"],
    },
    services: {
      type: [String],
      required: true,
      enum: {
        values: [
          "pool",
          "jacuzzi",
          "bbq",
          "woodfire",
          "essentialservices",
          "hotwater",
          "wifi",
          "tv",
          "kitchen",
          "washer",
          "airconditioner",
          "firstaidkit",
        ],
        message: "invalid services",
      },
    },
    coordinates: {
      type: String,
      required: true,
      match: [coordinatesRegex, "invalid coordinates"],
    },
    title: {
      type: String,
      required: true,
      match: [commentRegex, "title must contain only letters and numbers"],
      minlength: [10, "title too short"],
      maxlength: [50, "title too long"],
    },
    description: {
      type: String,
      required: true,
      match: [
        commentRegex,
        "description must contain only letters and numbers",
      ],
      minlength: [20, "description too short"],
      maxlength: [200, "description too long"],
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId, //Usuario con id único
      ref: "User",
      required: true,
    },
    reviews: {
      type: [{ type: Schema.Types.ObjectId, ref: "Review" }],
      required: false,
    },
      bookings: {
      type: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
      required: false,
    },
  },
  { timestamps: true }
);
BookingSiteSchema.pre("deleteOne", async function(next){
  try{
    await Booking.deleteMany({bookingSiteId:this.getFilter()["_id"]})
    await Reviews.deleteMany({bookingSiteId:this.getFilter()["_id"]})
    next()
  }catch (err){
    next(err)
  }
} )
const BookingSite = model("BookingSite", BookingSiteSchema);
module.exports = BookingSite;
