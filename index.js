const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const port = process.env.PORT || 5000;
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
const colors = require("colors");

connectDB();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/search", require("./routes/searchRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.yellow.bold);
});
