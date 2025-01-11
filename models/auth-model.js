const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vuminhduc.contact@gmail.com",
    pass: "wgcoppocikmbxpub",
  },
});

const DB_URL = "mongodb://localhost:27017/online-store";
const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
const User = mongoose.model("user", userSchema);

exports.registerNewUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      User.findOne({ email: email }).then((user) => {
        if (user) {
          reject("Tài khoản email đã được đăng ký.");
          mongoose.disconnect();
        } else {
          bcrypt.hash(password, 10).then((encryptedPassword) => {
            let newUser = new User({
              username: username,
              email: email,
              password: encryptedPassword,
            });
            newUser
              .save()
              .then(() => {
                resolve();
                mongoose.disconnect();
              })
              .catch((err) => {
                reject(err);
                mongoose.disconnect();
              });
          });
        }
      })
      .then(() => {
        return transporter.sendMail({
          from: '"Shop Online" <vuminhduc.contact@gmail.com>',
          to: email,
          subject: "Đăng ký tài khoản thành công!",
          text: "Cảm ơn bạn đã đăng ký tài khoản.",
          html: "<b>Chào mừng bạn!</b><p>Cảm ơn bạn đã đăng ký tài khoản với chúng tôi.</p>",
        });
      })
      .then((info) => {
        console.log("Email sent: %s", info.messageId);
        mongoose.disconnect();
        resolve("Tài khoản đã được tạo thành công.");
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
};

exports.validateLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(DB_URL).then(() => {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            reject("Không có tài khoản nào được tìm thấy.");
            mongoose.disconnect();
          } else {
            bcrypt.compare(password, user.password).then((same) => {
              if (!same) {
                reject("Mật khẩu không chính xác!");
                mongoose.disconnect();
              } else {
                mongoose.disconnect();
                resolve({
                  id: user._id,
                  isAdmin: user.isAdmin,
                });
              }
            });
          }
        })
        .then(() => {
          return transporter.sendMail({
            from: '"Shop Online" <vuminhduc.contact@gmail.com>',
            to: email,
            subject: "Chào mừng bạn đến với Shop!",
            text: "Chào mừng bạn đã trở lại trang của chúng tôi.",
            html: "<b>Chào mừng bạn!</b><p>Cảm ơn bạn đã trở lại với chúng tôi.</p>",
          });
        })
        .then((info) => {
          console.log("Email sent: %s", info.messageId);
          mongoose.disconnect();
          resolve("Đăng nhập thành công.");
        })
        .catch((err) => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
};
exports.UserModel = User;
