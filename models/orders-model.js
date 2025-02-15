const mongoose = require("mongoose");
const { UserModel } = require("./auth-model");
const authModel = require("./auth-model").UserModel;
require("dotenv").config();

const DB_URL = process.env.MONGODB_URI;
const orderSchema = mongoose.Schema({
  name: String,
  amount: Number,
  price: Number,
  userId: String,
  username: String,
  productId: String,
  timeStamp: String,
  address: String,
  status: {
    type: String,
    default: "pending",
  },
});

orderSchema.pre("validate", function () {
  if (this.userId) {
    return UserModel.findById(this.userId)
      .then((result) => {
        this.username = result.username;
      })
      .catch((err) => {
        next(err);
      });
  }
});
const Order = mongoose.model("order", orderSchema);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
exports.addNewOrder = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        let newItem = new Order(data);
        return newItem.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((saveErr) => {
        mongoose.disconnect();
        reject(saveErr);
      })
      .catch((connectionErr) => {
        reject(connectionErr);
      });
  });
};

exports.addManyOrders = (items, address) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        let newOrders = [];
        for (let item of items) {
          newOrders.push(
            new Order({
              name: item.name,
              price: item.price,
              amount: item.amount,
              userId: item.userId,
              productId: item.productId,
              timeStamp: Date.now(),
              address: address,
            })
          );
        }
        return Order.insertMany(newOrders);
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((saveErr) => {
        mongoose.disconnect();
        reject(saveErr);
      })

      .catch((connectionErr) => {
        reject(connectionErr);
      });
  });
};

exports.getOrdersByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      Order.find({ userId: userId }, {}, { sort: { timeStamp: -1 } })
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
exports.getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Hóa đơn không tồn tại");
    }
    console.log(order);
    return order;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


exports.updateOrderById = (orderId, newData) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      mongoose.set("useFindAndModify", false);
      Order.findByIdAndUpdate(orderId, newData)
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

exports.deleteOrderById = (orderId) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      mongoose.set("useFindAndModify", false);
      Order.findByIdAndDelete(orderId)
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

exports.getAllOrders = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        Order.find()
          .then((allOrders) => {
            resolve(allOrders);
            mongoose.disconnect();
          })
          .catch((findErr) => {
            reject(findErr);
            mongoose.disconnect();
          });
      })
      .catch((connectionErr) => {
        reject(connectionErr);
      });
  });
};

exports.getOrdersByStatus = (status) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        Order.find({ status: status })
          .then((orders) => {
            resolve(orders);
            mongoose.disconnect();
          })
          .catch((findErr) => {
            reject(findErr);
            mongoose.disconnect();
          });
      })
      .catch((connectionErr) => {
        reject(connectionErr);
      });
  });
};
