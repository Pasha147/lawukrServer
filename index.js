const express = require("express");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
const fs = require("fs");
const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

//чтоб можно было достучаться с других доменов, обойти защиту cors
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", "*"); // разрешает принимать запросы со всех доменов
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE"); // какие методы в запросах разрешается принимать
  res.append("Access-Control-Allow-Headers", "Origin, Content-Type");
  next();
});

let resp = "";

//=======Mongoose=====================
const schema = new Schema({
  message: { type: String, required: true },
});
const Mod = model("message", schema);

async function saveToDb(message) {
  const mod = new Mod({ message });
  await mod.save();
}
//=================================

//Send email and refresh text=====================

async function sendF(dateStr, res) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pasha147223s@gmail.com",
      pass: "@P1471472v",
    },
  });

  try {
    await transporter.sendMail({
      from: "pasha147223s",
      //   to: "pasha147223@gmail.com",
      to: "naukaoksana@gmail.com",
      //   to: "oksanazay@ukr.net",
      subject: "Node js",
      text: "",
      attachments: [{ filename: "text.txt", path: "./text.txt" }],
    });
    resp = "The email has been sent\n";
    console.log("1.", resp);
  } catch (error) {
    console.log("Can't send the email>>", error);
  }
  fs.writeFile("./text.txt", dateStr + "\n\n", (err) => {
    if (err) {
      throw err;
    }
    resp = resp + " The data file has been refreshed";
    console.log("2. ", resp);
    res.status(200).json(resp);
    resp = "";
  });
}
//======================================

//POST
app.post("/api/data/:id", (req, res) => {
  resp = "";
  const date = new Date();
  const dateStr =
    `${date.getFullYear()}.${date.getMonth() + 1}.` +
    `${date.getDate()} ${date.getHours()}:` +
    `${date.getMinutes()}:${date.getSeconds()}`;
  //   console.log("req.params>>", req.params);
  //   console.log("req.body>>", req.body);

  //   let reqBodyStr = JSON.stringify(req.body);
  //   console.log(reqBodyStr);
  //   console.log(JSON.parse(reqBodyStr));

  if (req.body.name === "OksanaLawyer" && req.body.text === "SendMe") {
    sendF(dateStr, res);
  } else {
    let message = { ...req.body };
    message.date = dateStr;
    let messageStr =
      message.date +
      ", " +
      message.name +
      ", " +
      message.bearthday +
      ", " +
      message.email +
      ", " +
      message.phone +
      ",\n\t" +
      message.text +
      "\n";
    console.log(messageStr);
    fs.appendFile("./text.txt", messageStr, (err) => {
      if (err) {
        throw err;
      }
    });
    saveToDb(JSON.stringify(message));
    resp = `The message from ${req.body.name} has been reseived`;
    res.status(200).json(resp);
    console.log("resp>>>", resp, "<<<");
    resp = "";
  }
});

async function start() {
  try {
    url =
      "mongodb+srv://Pasha147:P1471472@cluster0.ytmzn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    await mongoose.connect(url, {});
    app.listen(PORT, () => {
      console.log("Server has been started at PORT ", PORT);
    });
  } catch (e) {
    console.log("Server error>>", e);
  }
}

start();
