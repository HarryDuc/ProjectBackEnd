const productsModel = require("../models/products-model");

exports.getProduct = (req, res, next) => {
  const id = req.params.id;
  productsModel
    .getProductById(id)
    .then((product) => {
      res.render("product", {
        pageTitle: "View " + product.name,
        product: product,
        isUser: req.session.userId,
        cartErrors: req.flash("cartErrors")[0],
        isAdmin: req.session.isAdmin,
      });
    })
    .catch((err) => next(err));
  // render
};

exports.firstProduct = (req, res, next) => {
  productsModel.getFirstProduct().then((product) => {
    res.render("product", {
      pageTitle: "View " + product.name,
      product: product,
      isUser: req.session.userId,
      isAdmin: req.session.isAdmin,
    });
  });
};
