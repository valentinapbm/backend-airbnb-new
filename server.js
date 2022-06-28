const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connect } = require("./src/db");
const userRouter = require("./src/routes/user.routes");
const bookingRouter = require("./src/routes/booking.routes");
const reviewRouter = require("./src/routes/review.routes");
const bookingSiteRouter = require("./src/routes/bookingsite.router");
const { auth } = require("./src/utils/auth");
require("dotenv").config();
const { transporter, verify } = require("./src/utils/mailer");
const formData = require("./src/utils/formData");
const port = process.env.PORT;
const app = express();
connect();
verify(transporter);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", userRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);
app.use("/bookingsites", bookingSiteRouter);

app.listen(port, () => {
  console.log("App running OK");
});
