const router = require("express").Router();
const bookingController = require("../controllers/booking.controller");
const { auth } = require("../utils/auth");

router.route("/").get(bookingController.list);
router.route("/:bookingId").get(bookingController.show);
router.route("/").post(auth, bookingController.create);
router.route("/cancel").put(auth,bookingController.cancel);
router.route("/cancelUser").put(auth,bookingController.cancelUser);
router.route("/:bookingId").delete(bookingController.destroy);

module.exports = router;
