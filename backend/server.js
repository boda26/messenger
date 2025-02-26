const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const databaseConnect = require("./config/database");
const app = express();
app.use(cors())

const PORT = process.env.PORT || 5050;

const authRouter = require("./routes/authRoute");

dotenv.config({
    path: "backend/config/config.env",
});

databaseConnect();

app.get("/", (req, res) => {
    res.send("This is from backend server");
});

app.use("/api/messenger", authRouter);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
