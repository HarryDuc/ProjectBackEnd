const validationResult = require("express-validator").validationResult;
const cartModel = require("../models/cart-model");

exports.getCart = (req, res, next) => {
  cartModel
    .getItemsByUserId(req.session.userId)
    .then((items) =>
      res.render("cart", {
        pageTitle: "Giỏ hàng",
        cartErrors: req.flash("cartErrors")[0],
        isUser: req.session.userId,
        items: items,
        isAdmin: req.session.isAdmin,
      })
    )
    .catch((err) => next(err));
};

exports.postCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    cartModel
      .addNewItem({
        name: req.body.productName,
        price: req.body.productPrice,
        amount: req.body.amount,
        productId: req.body.productId,
        userId: req.session.userId,
        timeStamp: Date.now(),
      })
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => next(err));
  } else {
    req.flash("cartErrors", validationResult(req).array());
    res.redirect(req.body.redirectTo);
  }
};

exports.deleteFromCart = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    cartModel
      .deleteItemById(req.body.cartId)
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => next(err));
  } else {
    req.flash("cartErrors", validationResult(req).array());
    res.redirect("/cart");
  }
};

exports.deleteAll = (req, res, next) => {
  cartModel
    .deleteAllByUserId(req.session.userId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => next(err));
};

exports.confirmOnePost = (req, res, next) => {
  res.redirect("/cart/confirm/" + req.body.cartId);
};

exports.confirmAllPost = (req, res, next) => {
  res.redirect("/cart/confirm/all");
};
exports.paymentOne = (req, res, next) => {
  let itemId = req.params.itemId;
  cartModel
    .getItemById(itemId)
    .then((itemToConfirm) =>
      res.render("payment", {
        pageTitle: "Thanh toán",
        isUser: req.session.userId,
        itemsToConfirm: [itemToConfirm],
        oneOrder: true,
        addressErrors: req.flash("addressErrors")[0],
        isAdmin: req.session.isAdmin,
      })
    )
    .catch((err) => next(err));
}
exports.confirmOneGet = (req, res, next) => {
  let itemId = req.params.itemId;
  cartModel
    .getItemById(itemId)
    .then((itemToConfirm) =>
      res.render("cart-confirm", {
        pageTitle: "Xác nhận thanh toán.",
        isUser: req.session.userId,
        itemsToConfirm: [itemToConfirm],
        oneOrder: true,
        addressErrors: req.flash("addressErrors")[0],
        isAdmin: req.session.isAdmin,
      })
    )
    .catch((err) => next(err));
};

exports.confirmAllGet = (req, res, next) => {
  let userId = req.session.userId;
  cartModel
    .getItemsByUserId(userId)
    .then((itemsToConfirm) => {
      res.render("cart-confirm", {
        pageTitle: "Giỏ hàng",
        isUser: req.session.userId,
        itemsToConfirm: itemsToConfirm,
        oneOrder: false,
        addressErrors: req.flash("addressErrors")[0],
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => next(err));
};
