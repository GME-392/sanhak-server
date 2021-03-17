"use strict";
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  bojname: {
    type: String,
    required: true,
  },
  groups: {
    type: [String],
    required: false,
    default: [],
  },
  email: {
    type: String,
    required: true,
    default: "",
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date().toISOString(),
  },
});

let connection = null;

const connect = async () => {
  if (connection && mongoose.connection.readyState === 1) {
    return Promise.resolve(connection);
  }
  return mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((conn) => {
      console.log("connected");
      connection = conn;
      return connection;
    });
};

exports.handler = async (event, context, callback) => {
  await connect();
  let User = mongoose.model("user", userSchema);
  const users = await User.find();
  return users;
};
