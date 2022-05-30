const router = require("express").Router();
const bookingSiteController = require("../controllers/bookingsite.controller");

router.route("/").get(bookingSiteController.list);
router.route("/:userId").get(bookingSiteController.show);
router.route("/").post(bookingSiteController.create);
router.route("/:userId").put(bookingSiteController.update);
router.route("/:userId").delete(bookingSiteController.destroy);


module.exports=router;
