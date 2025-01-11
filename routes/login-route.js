const bodyParser = require("body-parser");
const router = require("express").Router();
const loginController = require("../controllers/login-controller");
const check = require("express-validator").check;
const authGuard = require("./guards/auth-guard");

router.get("/", authGuard.notAuth, loginController.getLogin);

router.post(
  "/",
  authGuard.notAuth,
  bodyParser.urlencoded({ extended: true }),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Vui lòng nhập email!")
    .isEmail()
    .withMessage("Nhập đúng định dạng email ví dụ abc@gmail.com!"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Vui lòng nhập mật khẩu!")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu dài ít nhật 6 ký tự."),
  loginController.postLogin
);

module.exports = router;
