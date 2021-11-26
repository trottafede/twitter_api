"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  age: Number,
  email: String,
  password: String,
  description: String,

  image: {
    type: String,
    default:
      "https://i1.wp.com/9tailedkitsune.com/wp-content/uploads/2021/06/luckystaranime.jpg?resize=800%2C600&ssl=1",
  },
  tweetsList: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

module.exports = mongoose.model("User", userSchema);
