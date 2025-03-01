const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const databaseConnect = require("./config/database");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(bodyParser.json());
app.use(cookieParser());

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
