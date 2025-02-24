const express = require("express");
const app = express();

const PORT = process.env.PORT || 5050;

app.get("/", (req, res) => {
    res.send("This is from backend server");
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
