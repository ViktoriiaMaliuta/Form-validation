const express = require("express");
const cors = require("cors");
const app = express();
const port = 5500;

app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/submit-form", (req, res) => {
  console.log("Form data received:", req.body);
  res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

