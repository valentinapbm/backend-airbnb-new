const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { auth } = require("../../src/utils/auth");

router.route("/").get(userController.list);
router.route("/getid").get(auth, userController.show);
router.route("/singup").post(userController.create);
router.route("/login").post(userController.signin);
router.route("/update").put(auth, userController.update);
router.route("/:userId").delete(userController.destroy);

module.exports = router;
