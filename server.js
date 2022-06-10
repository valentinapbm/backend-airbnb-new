const express = require("express");
const cors = require("cors");
const { connect } = require("./src/db");
const userRouter = require("./src/routes/user.routes");
const bookingRouter = require("./src/routes/booking.routes");
const reviewRouter = require("./src/routes/review.routes");
const bookingSiteRouter = require("./src/routes/bookingsite.router");
const { use } = require("express/lib/application");
const { auth } = require("./src/utils/auth");
require("dotenv").config();

const port = process.env.PORT;
const app = express();
connect();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);
app.use("/bookingsites", bookingSiteRouter);

app.get("/", auth, (req, res) => {
  console.log(req.user);
  res.sendStatus(200);
});


app.listen(port, () => {
  console.log("App running OK");
});
