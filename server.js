const express = require("express");
const path = require("path");
const session = require("express-session");
const SessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const app = express();
const axios = require("axios");
const crypto = require("crypto");
const os = require("os");
require("dotenv").config();
const STORE = new SessionStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const homeRouter = require("./routes/home-route");
const productRouter = require("./routes/product-route");
const signupRouter = require("./routes/signup-route");
const loginRouter = require("./routes/login-route");
const logoutRouter = require("./routes/logout-route");
const cartRouter = require("./routes/cart-route");
const ordersModel = require("./models/orders-model");
const ordersRouter = require("./routes/orders-route");
const adminRouter = require("./routes/admin-route");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Tin nhắn mã hóa cho các lần đăng nhập.",
    saveUninitialized: false,
    resave: true,
    store: STORE,
  })
);
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));

app.use(flash());
app.use("/", homeRouter);
app.use("/product", productRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/admin", adminRouter);

app.get("/orders", async (req, res) => {
  try {
    const orders = await ordersModel.getOrdersByUserId(req.session.userId);
    console.log(orders);
    res.render("orders", { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.use("/payment-success", (req, res) => {
  const orderId = req.query.requestId;
  console.log("Order ID:", orderId);
  const resultCode = req.query.resultCode;
  console.log("Result code:", resultCode);

  if (resultCode === "0") {
    ordersModel
      .updateOrderById(orderId, { status: "complete" })
      .then(() => {
        console.log("Cập nhật đơn hàng thành công");
        res.render("success", {
          pageTitle: "Thanh toán thành công",
          orderId: orderId,
          isUser: req.session.userId,
          isAdmin: req.session.isAdmin,
        });
      })
      .catch((err) => {
        console.error("Cập nhật đơn hàng thất bại:", err);
        res.status(500).send("Lỗi khi cập nhật đơn hàng");
      });
  } else {
    console.log("Result code không phải 0");
    res.render("success", { orderId: "Không hợp lệ hoặc không hoàn thành" });
  }
});
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  const localIPs = [];

  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        localIPs.push(iface.address);
      }
    }
  }
  return localIPs[localIPs.length - 1];
}
const localIPs = getLocalIP();
app.post("/payment", async (req, res) => {
  const userId = req.session.userId;
  const orderIdPayment = req.body.orderId;
  const timeStamp = req.body.timeStamp;
  const totalPrice = req.body.totalPrice;
  console.log(userId);
  console.log(orderIdPayment);
  console.log(timeStamp);
  console.log(totalPrice);
  if (!userId) {
    return res.status(400).json({ message: "Người dùng chưa đăng nhập" });
  }
  try {
    const ordersItem = await ordersModel.getOrdersByUserId(userId);
    if (!ordersItem || ordersItem.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng không tồn tại" });
    }
    console.log(ordersItem);
    const accessKey = process.env.ACCESS_KEY;
    const secretKey = process.env.SECRET_KEY;
    const partnerCode = "MOMO";
    const orderInfo = `Thanh toán đơn hàng ${orderIdPayment}`;
    const redirectUrl = `http://${localIPs}:3000/payment-success`;
    const ipnUrl = "https://0778-14-178-58-205.ngrok-free.app/callback";
    const requestType = "payWithMethod";
    const extraData = "";
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";
    const orderId = partnerCode + orderIdPayment;
    const requestId = orderIdPayment;

    const rawSignature = `accessKey=${accessKey}&amount=${totalPrice}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: totalPrice,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature,
    });

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const result = await axios(options);
    console.log(result.data.payUrl);
    return res.redirect(result.data.payUrl);
  } catch (error) {
    console.error("Lỗi trong quá trình thanh toán:", error);
    return res.status(500).json({ message: error.message });
  }
});

app.get("/not-admin", (req, res, next) => {
  res.status(403);
  res.render("not-admin", {
    pageTitle: "Không có quyền truy cập!",
    isUser: req.session.userId,
    isAdmin: false,
  });
});
app.get("/error", (req, res, next) => {
  res.status(500);
  res.render("error", {
    pageTitle: "Lỗi trang",
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin,
  });
});
app.use((error, req, res, next) => {
  res.redirect("/error");
});

app.use((req, res, next) => {
  res.status(404);
  res.render("not-found", {
    pageTitle: "404 | Trang không tồn tại",
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin,
  });
});

app.listen(3000, (err) => console.log(`http://${localIPs}:3000/`));
