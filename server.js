const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS rides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        pickup TEXT,
        destination TEXT,
        date TEXT,
        time TEXT,
        seats INTEGER
    )`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle ride form submission
app.post('/submit-ride', (req, res) => {
    const { name, email, pickup, destination, date, time, seats } = req.body;

    db.run(`INSERT INTO rides (name, email, pickup, destination, date, time, seats) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, pickup, destination, date, time, seats],
        function (err) {
            if (err) {
                return res.status(500).send('Error saving ride');
            }
            res.send('Ride submitted successfully');
        });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
