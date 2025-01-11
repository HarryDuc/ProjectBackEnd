const mongoose = require("mongoose");
const DB_URL = "mongodb://localhost:27017/online-store";
const productSchema = mongoose.Schema({
  name: String,
  img: String,
  price: Number,
  category: String,
  description: String,
});
const Product = mongoose.model("product", productSchema);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        Product.find()
          .then((products) => {
            mongoose.disconnect();
            resolve(products);
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

exports.getProductById = (id) => {
  return new Promise((resolve, reject) => {
    // connect to DB
    mongoose
      .connect(DB_URL)
      .then(() => {
        Product.findById(id)
          .then((product) => {
            resolve(product);
            mongoose.disconnect();
          })
          .catch((err) => {
            reject(err);
            mongoose.disconnect();
          });
      })
      .catch((err) => reject(err));
  });
};

exports.getFirstProduct = () => {
  return new Promise((resolve, reject) => {
    // connect to DB
    mongoose.connect(DB_URL).then(() => {
      Product.findOne()
        .then((product) => {
          mongoose.disconnect();
          resolve(product);
        })
        .catch((err) => reject(err));
    });
  });
};

exports.newProduct = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        let newProduct = new Product(data);
        newProduct
          .save()
          .then(() => {
            resolve(newProduct._id);
            mongoose.disconnect();
          })
          .catch((err) => {
            reject(err);
            mongoose.disconnect();
          });
      })
      .catch((err) => reject(err));
  });
};
