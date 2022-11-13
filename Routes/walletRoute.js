import express from "express";
import bodyParser from "body-parser";

import Wallet from "../Models/wallet.js";
import Transaction from "../Models/transactions.js";
import { CREDIT } from "../shared/constants.js";

const walletRouter = express.Router();
walletRouter.use(bodyParser.json());

walletRouter.route("/setup").post(async (req, res) => {
  try {
    const name = req.body.name;
    const balance = req.body.balance.toFixed(4);
    const wallet = await Wallet.create({
      name,
      balance,
    });
    const transaction = await Transaction.create({
      walletId: wallet._id,
      amount: balance,
      description: "Setup",
      balance,
      type: CREDIT,
    });
    const walletObj = {
      id: wallet._id,
      balance,
      name,
      transactionId: transaction._id,
      date: new Date(wallet.createdAt),
    };
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(walletObj);
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = "Something went wrong";
    res.send();
  }
});

walletRouter.route("/wallet/:id").get(async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ _id: req.params.id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      id: wallet._id,
      name: wallet.name,
      balance: wallet.balance,
      date: new Date(wallet.createdAt),
    });
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = "Something went wrong";
    res.send();
  }
});

export default walletRouter;
