const router = require("express").Router();
const bodyParser = require("body-parser");
const authGuard = require("./guards/auth-guard");
const check = require("express-validator").check;
const ordersController = require("../controllers/orders-controller");

router.post(
  "/new-one",
  authGuard.isAuth,
  bodyParser.urlencoded({ extended: true }),
  check("address").not().isEmpty().withMessage("Vui lòng nhập địa chỉ!"),
  ordersController.buyOne
);

router.post(
  "/new-all",
  authGuard.isAuth,
  bodyParser.urlencoded({ extended: true }),
  check("address").not().isEmpty().withMessage("Vui lòng nhập địa chỉ!"),
  ordersController.buyAll
);

router.get("/", authGuard.isAuth, ordersController.getOrders);

router.post(
  "/cancel",
  authGuard.isAuth,
  bodyParser.urlencoded({ extended: true }),
  ordersController.deleteFromOrder
);

module.exports = router;