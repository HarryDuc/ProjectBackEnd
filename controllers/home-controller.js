const productsModel = require("../models/products-model");

exports.getHome = (req, res, next) => {
  let productsModelPromise = productsModel.getAllProducts();
  productsModelPromise.then((products) => {
    res.render("index", {
      pageTitle: "Trang chủ",
      products: products,
      isUser: req.session.userId,
      cartErrors: req.flash("cartErrors")[0],
      isAdmin: req.session.isAdmin,
    });
  });
};
