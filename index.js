const express = require("express");
const app = express();
app.use(express.json());

let logs = [];

app.post("/logs", (req, res) => {
  logs.push({ time: new Date().toISOString(), ...req.body });
  res.json({ status: "logged" });
});

app.get("/logs", (_, res) => res.json(logs));
app.get("/ping", (_, res) => res.send("pong"));
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.get("/metrics", (_, res) => res.json({ logs: logs.length }));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Logging service running on ${PORT}`));