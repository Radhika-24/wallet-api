import express from "express";
import bodyParser from "body-parser";

import Wallet from "../Models/wallet.js";
import Transaction from "../Models/transactions.js";
import { CREDIT, DEBIT } from "../shared/constants.js";

const transactionRouter = express.Router();
transactionRouter.use(bodyParser.json());

transactionRouter.route("/transact/:walletId").post(async (req, res) => {
  try {
    const description = req.body.description;
    const amount = parseFloat(req.body.amount.toFixed(4));
    const walletId = req.params.walletId;
    const checkWallet = await Wallet.findOne({ _id: walletId });
    if (checkWallet) {
      const balance = checkWallet.balance + amount;
      const type = amount > 0 ? CREDIT : DEBIT;
      const transaction = await Transaction.create({
        walletId: walletId,
        amount: amount > 0 ? amount : amount * -1,
        description,
        type,
        balance,
      });
      const wallet = await Wallet.findByIdAndUpdate(
        { _id: walletId },
        { balance },
        { new: true }
      );
      const transactObj = {
        balance: wallet.balance,
        transactionId: transaction._id,
      };
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(transactObj);
      return;
    }
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.json({ message: "Wallet not found" });
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = "Something went wrong";
    res.send();
  }
});

transactionRouter.route("/transactions").get(async (req, res) => {
  try {
    const { walletId, skip, limit } = req.query;
    const transactions = await Transaction.find({ walletId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const response = transactions.map((tran) => {
      return {
        id: tran._id,
        walletId: tran.walletId,
        amount: tran.amount,
        balance: tran.balance,
        description: tran.description,
        date: new Date(tran.createdAt),
        type: tran.type,
      };
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(response);
  } catch (err) {
    console.log(err);
    res.statusCode = 500;
    res.statusMessage = "Something went wrong";
    res.send();
  }
});

export default transactionRouter;
