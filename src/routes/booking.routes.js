const router = require("express").Router();
const bookingController = require("../controllers/booking.controller");

router.route("/").get(bookingController.list);
router.route("/:bookingId").get(bookingController.show);
router.route("/:userId").post(bookingController.create);
router.route("/:bookingId").put(bookingController.update);
router.route("/:bookingId").delete(bookingController.destroy);

module.exports = router;
