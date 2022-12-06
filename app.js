// Basic Lib Import
const express = require("express");
const router = require("./src/routes/api");
const app = new express();
const bodyParser = require("body-parser");
const path = require("path");

// Security Middleware Lib Import
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

// Database Lib Import
const mongoose = require("mongoose");
app.use(express.static("client/build"));

// Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Body Parser Implement
app.use(bodyParser.json());

// Request Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(limiter);

// Mongo DB Database Connection
const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASS;
let URI = `mongodb+srv://${dbName}:${dbPass}@cluster0.ltldm.mongodb.net/dummy?retryWrites=true&w=majority`;

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(URI, config, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connection Success");
  }
});

// Routing Implement
app.use("/api/v1", router);

// Add React Front End Routing
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

module.exports = app;
