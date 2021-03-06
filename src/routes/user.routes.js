const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { auth } = require("../../src/utils/auth");
const formData = require("../utils/formData");

router.route("/").get(userController.list);
router.route("/:getid").get(auth, userController.show);
router.route("/singup").post(userController.create);
router.route("/login").post(userController.signin);
router.route("/update").put(auth, userController.update);
router
  .route("/updateImage")
  .put(auth, formData("profile-image"), userController.updateImage);
router.route("/deleteImage").put(auth, userController.deleteImage);
router.route("/deleteUser").delete(auth, userController.destroy);
router.route("/recoverypassword").post(userController.recoveryPass);
router.route("/resetpassword").post(auth, userController.resetPass);
router.route("/changepassword").put(auth, userController.changePass);

module.exports = router;
