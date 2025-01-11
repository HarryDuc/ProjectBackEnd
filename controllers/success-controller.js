// const ordersModel = require("../models/orders-model");

// exports.getSuccessPayment = (req, res, next) => {
//   const orderId = req.query.orderId;
//   if (!orderId) {
//     return res.status(400).send("Thiếu thông tin orderId.");
//   }

//   ordersModel
//     .getOrderById(orderId)
//     .then((order) => {
//       if (!order) {
//         return res.status(404).send("Không tìm thấy đơn hàng.");
//       }
//       res.render("success", {
//         pageTitle: "Thanh toán thành công",
//         orderId: orderId,
//         orderDetails: order, // Chi tiết đơn hàng
//         isUser: req.session.userId,
//         isAdmin: req.session.isAdmin,
//       });
//     })
//     .catch((err) => {
//       console.error("Lỗi khi lấy thông tin đơn hàng:", err);
//       next(err);
//     });
// };


// const ordersModel = require("../models/orders-model");
// const ejs = require("ejs");

// exports.getSuccessPayment = async (req, res, next) => {
//   const orderId = req.query.requestId;
//   const resultCode = req.query.resultCode;
//   console.log("Order ID:", orderId);
//   console.log("Result code:", resultCode);
//   if (!orderId || !resultCode) {
//     return res.status(400).send("Thiếu thông tin orderId hoặc resultCode.");
//   }

//   try {
//     if (resultCode === "0") {

//       const order = await ordersModel.getOrderById(orderId);
//       if (!order) {
//         return res.status(404).send("Không tìm thấy đơn hàng.");
//       }
//       await ordersModel.updateOrderById(orderId, { status: "complete" });
//       console.log("Cập nhật đơn hàng thành công:", orderId);

//       return res.render("success", {
//         pageTitle: "Thanh toán thành công",
//         orderId: orderId,
//         orderDetails: order,
//         isUser: req.session.userId,
//         isAdmin: req.session.isAdmin,
//       });
//     } else {
//       console.log("Result code không phải 0.");
//       return res.render("success", {
//         pageTitle: "Thanh toán không thành công",
//         orderId: "Không hợp lệ hoặc không hoàn thành",
//         isUser: req.session.userId,
//         isAdmin: req.session.isAdmin,
//       });
//     }
//   } catch (err) {
//     console.error("Lỗi khi xử lý thanh toán:", err);
//     next(err);
//   }
// };
