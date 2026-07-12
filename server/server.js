require("dotenv").config();
const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user");
const insightsRoutes = require("./routes/insights");
const cardRoutes = require("./routes/card");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/insights", insightsRoutes);
app.use("/card", cardRoutes);


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});