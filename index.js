import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import walletRouter from "./Routes/walletRoute.js";
import transactionRouter from "./Routes/transactionRouter.js";

const config = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const connect = mongoose.connect("mongodb://localhost:27017/wallet", config);

connect
  .then((db) => {
    console.log("Connected correctly to server");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const port = 3100;
app.use(cors());

app.all("*", (req, res, next) => next());
app.use("/", walletRouter);
app.use("/", transactionRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
