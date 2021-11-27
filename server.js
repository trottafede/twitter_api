require("dotenv").config();
const express = require("express");
const app = express();
const apiRoutes = require("./routes/apiRoutes");
const port = process.env.PORT || 8000;
const cors = require("cors");
const db = require("./models");

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var corsOptions = {
  origin: "http://example.com",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

db();
// Routes
app.use("/api", apiRoutes);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
