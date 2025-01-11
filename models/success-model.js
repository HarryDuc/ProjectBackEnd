// const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/online-store", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", (err) => {
//   console.error("Lỗi kết nối MongoDB:", err);
// });
// db.once("open", () => {
//   console.log("Kết nối MongoDB thành công.");
// });
// const db = require("../database/connection");
// db.connect("mongodb://localhost:27017/online-store", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

// exports.getOrderById = (orderId) => {
//   return db
//     .collection("orders")
//     .findOne({ _id: orderId })
//     .then((order) => order)
//     .catch((err) => {
//       console.error("Lỗi khi truy vấn đơn hàng:", err);
//       throw err;
//     });
// };


// const ordersSchema = new mongoose.Schema({
//   _id: String, // ID phải khớp với kiểu dữ liệu của `orderId`
//   status: String,
//   amount: Number,
//   userId: String,
//   timestamp: Number,
// });

// const Order = mongoose.model("Order", ordersSchema);

// exports.getOrderById = (orderId) => {
//   return Order.findById(orderId).exec();
// };

// exports.updateOrderById = (orderId, updateData) => {
//   return Order.findByIdAndUpdate(orderId, updateData).exec();
// };
