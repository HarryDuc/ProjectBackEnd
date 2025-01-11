const bodyParser = require("body-parser");
const router = require("express").Router();
const signupController = require("../controllers/signup-controller");
const check = require("express-validator").check;
const authGuard = require("./guards/auth-guard");

router.get("/", authGuard.notAuth, signupController.getSignup);

router.post(
  "/",
  authGuard.notAuth,
  bodyParser.urlencoded({ extended: true }),
  check("username").not().isEmpty().withMessage("Tên người dùng không được để trống!"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email không được để trống!")
    .isEmail()
    .withMessage("Định dạng email không đúng!"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Mật khẩu không được để trống!")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu không được ít hơn 6 ký tự!"),
  check("confirmPassword").custom((value, { req }) => {
    if (value === req.body.password) return true;
    else throw "Xác nhận mật khẩu không trùng khớp!";
  }),
  signupController.postSignup
);

module.exports = router;
