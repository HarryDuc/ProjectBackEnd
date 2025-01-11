const authModel = require("../models/auth-model");
const validationResult = require("express-validator").validationResult;
exports.getLogin = (req, res, next) => {
  res.render("login", {
    pageTitle: "Đăng nhập",
    authError: req.flash("authError")[0],
    validationErrors: req.flash("validationErrors"),
    isUser: req.session.userId,
    isAdmin: false,
  });
};

exports.postLogin = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    let user = req.body;
    authModel
      .validateLogin(user.email, user.password)
      .then((result) => {
        req.session.userId = result.id;
        req.session.isAdmin = result.isAdmin;
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("authError", err);
        res.redirect("/login");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/login");
  }
};
