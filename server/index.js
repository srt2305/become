require("dotenv").config();
require("./connection/connection");
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth-router");
const profileRouter = require("./routes/profile-router");
const transactionRouter = require("./routes/transaction-router");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(authRouter);
app.use(profileRouter);
app.use(transactionRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});