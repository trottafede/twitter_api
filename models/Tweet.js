"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  Text: String,
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tweet", tweetSchema);

//Comparar object.id con tweetSchema.likes.object.id
//articles.likes[0].id === user.object.id ---------------El .id devuelve el string! a diferencia del ._id

//clearing tech tracks will have rewards. T1, after clearing it we are going to have a Tech interview. Two more interviews
// probably in english, and the written exam. Technical tracks!
//25 000
//3000
