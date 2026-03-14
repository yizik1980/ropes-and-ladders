import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const CSV_FILE = path.join(__dirname, 'game-contested.csv');
const PORT = 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/game', (req, res) => {
  const { players } = req.body;
  if (!Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ error: 'invalid players' });
  }

  const date = new Date().toLocaleString('he-IL');
  const row = [date, ...players].map((v) => `"${v}"`).join(',') + '\n';

  if (!fs.existsSync(CSV_FILE)) {
    const header = ['תאריך', ...players.map((_, i) => `שחקן ${i + 1}`)].join(',') + '\n';
    fs.writeFileSync(CSV_FILE, '\uFEFF' + header, 'utf8');
  }
  fs.appendFileSync(CSV_FILE, row, 'utf8');

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Game results saved to: ${CSV_FILE}`);
});
