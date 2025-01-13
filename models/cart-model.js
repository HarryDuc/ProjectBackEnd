const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.MONGODB_URI;
const cartSchema = mongoose.Schema({
  name: String,
  amount: Number,
  price: Number,
  userId: String,
  productId: String,
  timeStamp: Number,
});
const CartItem = mongoose.model("cart", cartSchema);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
exports.addNewItem = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        CartItem.findOne({ userId: data.userId, productId: data.productId })
          .then((existingItem) => {
            if (existingItem) {
              existingItem.amount += +data.amount;
              existingItem.timeStamp = Date.now();
              return existingItem.save();
            } else {
              let newItem = new CartItem(data);
              return newItem.save();
            }
          })
          .then(() => {
            mongoose.disconnect();
            resolve();
          })
          .catch((saveErr) => {
            mongoose.disconnect();
            reject(saveErr);
          })
          .catch((findErr) => {
            mongoose.disconnect();
            reject(findErr);
          });
      })
      .catch((connectionErr) => {
        reject(connectionErr);
      });
  });
};

exports.getItemsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      CartItem.find({ userId: userId }, {}, { sort: { timeStamp: -1 } })
        .then((result) => {
          resolve(result);
          mongoose.disconnect();
        })
        .catch((err) => {
          reject(err);
          mongoose.disconnect();
        });
    });
  });
};

exports.updateItemById = (cartId, newData) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      mongoose.set("useFindAndModify", false);
      CartItem.findByIdAndUpdate(cartId, newData)
        .then(() => {
          resolve();
          mongoose.disconnect();
        })
        .catch((err) => {
          reject(err);
          mongoose.disconnect();
        });
    });
  });
};

exports.deleteItemById = (cartId) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      mongoose.set("useFindAndModify", false);
      CartItem.findByIdAndDelete(cartId)
        .then(() => {
          resolve();
          mongoose.disconnect();
        })
        .catch((err) => {
          reject(err);
          mongoose.disconnect();
        });
    });
  });
};

exports.deleteAllByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      CartItem.deleteMany({ userId: userId })
        .then(() => {
          resolve();
          mongoose.disconnect();
        })
        .catch((deletionError) => {
          reject(deletionError);
        });
    });
  });
};

exports.getItemById = (itemId) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      CartItem.findById(itemId)
        .then((result) => {
          if (!result) {
            reject("Không khớp với mục nào trong giỏ hàng!");
            mongoose.disconnect();
          } else {
            resolve(result);
            mongoose.disconnect();
          }
        })
        .catch((err) => {
          reject(err);
          mongoose.disconnect();
        });
    });
  });
};
