const router = require("express").Router();
const reviewController = require("../controllers/review.controller");

router.route("/").get(reviewController.list);
router.route("/:reviewId").get(reviewController.show);
router.route("/").post(reviewController.create);
router.route("/:reviewId").put(reviewController.update);
router.route("/:reviewId").delete(reviewController.destroy);

module.exports = router;
