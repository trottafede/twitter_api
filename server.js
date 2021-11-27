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
app.use(cors());

db();
// Routes
app.use("/api", apiRoutes);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
