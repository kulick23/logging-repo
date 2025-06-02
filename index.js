const express = require('express');
const app = express();
app.use(express.json());

let logs = [];

app.post('/logs', (req, res) => {
  const log = {
    id: Date.now(),
    ...req.body
  };
  logs.push(log);
  console.log('New log:', log);
  res.status(200).json({ status: 'logged' });
});

app.get('/logs', (_, res) => res.json(logs));
app.get('/ping', (_, res) => res.send('pong'));
app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Logging service running on ${PORT}`));
