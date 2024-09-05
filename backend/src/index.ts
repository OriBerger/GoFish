import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
