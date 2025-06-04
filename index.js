const express = require("express");
require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = require('prom-client');

const mongoUrl = process.env.MONGO_URL;
let db;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
db = client.db('charity');
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

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

client.collectDefaultMetrics();           // сбор дефолтных метрик
const logsGauge = new client.Gauge({      // метрика число логов
  name: 'logs_count',
  help: 'Number of logs in MongoDB'
});

app.get("/metrics", async (_, res) => {
  const count = await db.collection('logs').countDocuments();
  logsGauge.set(count);
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Logging service running on ${PORT}`));