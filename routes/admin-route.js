const router = require("express").Router();
const bodyParser = require("body-parser");
const adminGuard = require("./guards/admin-guard");
const adminController = require("../controllers/admin-controller");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const check = require("express-validator").check;

router.get("/add", adminGuard, adminController.getAdd);
router.post(
  "/add",
  adminGuard,
  multer({ storage: storage }).single("image"),
  check("name").not().isEmpty().withMessage("Vui lòng nhập tên sản phẩm."),
  check("price")
    .not()
    .isEmpty()
    .withMessage("Vui lòng nhập giá sản phẩm.")
    .isFloat({ min: 1000 })
    .withMessage("Giá sản phẩm phải lớn hơn 1000."),
  check("description").not().isEmpty().withMessage("Yêu cầu nhập mô tả sản phẩm."),
  check("category").not().isEmpty().withMessage("Vui lòng nhập danh mục sản phẩm."),
  check("image").custom((value, { req }) => {
    if (req.file) return true;
    else throw "Vui lòng chọn ảnh sản phẩm.";
  }),
  adminController.postAdd
);

router.get("/orders", adminGuard, adminController.getOrders);

router.post(
  "/orders/update",
  adminGuard,
  bodyParser.urlencoded({ extended: true }),
  adminController.updateStatus
);

module.exports = router;
