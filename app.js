const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Konfiguracja połączenia z bazą danych
const db = mysql.createConnection({
  host: 'localhost', // Zmień na adres serwera
  user: 'root',
  password: '',
  database: 'lottery_db',
});

// Sprawdzenie połączenia z bazą danych
db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    process.exit(1);
  }
  console.log('Połączono z bazą danych');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API do losowania numeru
app.post('/api/draw', (req, res) => {
  const { name, drawType } = req.body;

  if (!name || !drawType) {
    return res.status(400).json({ success: false, message: 'Brak wymaganych danych' });
  }

  const query = `
    SELECT * FROM numbers 
    WHERE draw_type = ? AND is_taken = 0 
    ORDER BY RAND() LIMIT 1;
  `;

  db.query(query, [drawType], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Błąd serwera' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Brak dostępnych numerów' });
    }

    const number = results[0];
    const updateQuery = `UPDATE numbers SET is_taken = 1, taken_by = ? WHERE id = ?`;

    db.query(updateQuery, [name, number.id], (updateErr) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ success: false, message: 'Błąd serwera przy aktualizacji' });
      }

      res.json({ success: true, number: number.value });
    });
  });
});

// Start serwera
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
