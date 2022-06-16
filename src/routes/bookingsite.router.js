const router = require("express").Router();
const bookingSiteController = require("../controllers/bookingsite.controller");
const { auth } = require("../../src/utils/auth");
const formData = require("../utils/formData");

router.route("/").get(bookingSiteController.list);
router.route("/:bookingSiteId").get(bookingSiteController.show);
router
  .route("/post")
  .post(auth, formData("booking-image"), bookingSiteController.create);
router.route("/:bookingSiteId").put(bookingSiteController.update);
router.route("/:bookingSiteId").delete(bookingSiteController.destroy);
router.route("/:userId").post(bookingSiteController.create);

module.exports = router;
