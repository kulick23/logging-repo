const express = require('express');
const app = express();
app.use(express.json());

// Просто для проверки, что сервис жив
app.get('/ping', (_, res) => res.send('pong'));

// Сюда можно отправлять логи
app.post('/logs', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message field' });
  }

  console.log('LOG:', message);
  res.status(200).json({ status: 'logged' });
});

// Healthcheck
app.get('/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Logging service running on port ${PORT}`);
});
