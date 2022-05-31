const express = require("express");
const cors = require("cors");
const { connect } = require("./src/db");
const userRouter = require("./src/routes/user.routes");
const bookingRouter = require("./src/routes/booking.routes");
const reviewRouter = require("./src/routes/review.routes");
const { use } = require("express/lib/application");

const port = 8080;
const app = express();
connect();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/bookings", bookingRouter);
app.use("/reviews", reviewRouter);

app.listen(port, () => {
  console.log("App running OK");
});
