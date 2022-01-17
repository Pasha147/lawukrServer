const express = require("express");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

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

//POST
app.post("/api/data/:id", (req, res) => {
  //   console.log("req.params>>", req.params);
  //   console.log("req.body>>", req.body);

  //   let reqBodyStr = JSON.stringify(req.body);
  //   console.log(reqBodyStr);
  //   console.log(JSON.parse(reqBodyStr));

  const date = new Date();
  const dateStr =
    `${date.getFullYear()}.${date.getMonth() + 1}.` +
    `${date.getDate()} ${date.getHours()}:` +
    `${date.getMinutes()}:${date.getSeconds()}`;
  let message = { ...req.body };
  message.date = dateStr;

  console.log(message);
  saveToDb(JSON.stringify(message));
  res.status(200).json(`The message from ${req.body.name} has been reseived`);
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
