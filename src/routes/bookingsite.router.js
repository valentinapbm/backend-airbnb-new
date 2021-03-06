const router = require("express").Router();
const bookingSiteController = require("../controllers/bookingsite.controller");
const { auth } = require("../../src/utils/auth");
const formData = require("../utils/formData");

router.route("/").get(bookingSiteController.list);
router.route("/filter").get(bookingSiteController.filter);
router.route("/:bookingSiteId").get(bookingSiteController.show);
router.route("/post").post(auth,formData("booking-image"),bookingSiteController.create);
router.route("/update/:bookingSiteId").put(auth,formData("booking-image"),bookingSiteController.update);
router.route("/:bookingSiteId").delete(auth,bookingSiteController.destroy);
router.route("/:userId").post(bookingSiteController.create);

module.exports = router;
