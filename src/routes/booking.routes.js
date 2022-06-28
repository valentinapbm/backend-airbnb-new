const router = require("express").Router();
const bookingController = require("../controllers/booking.controller");
const { auth } = require("../utils/auth");

router.route("/").get(bookingController.list);
router.route("/:bookingId").get(bookingController.show);
router.route("/").post(auth, bookingController.create);
router.route("/:bookingId").put(bookingController.update);
router.route("/:bookingId").delete(bookingController.destroy);

module.exports = router;
