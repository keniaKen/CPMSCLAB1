const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'keni', // use your MySQL password if needed
  database: 'userdb',
});

app.get('/hello-user', (req, res) => {
  const sql = 'SELECT * FROM user LIMIT 1';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.send('No users found');
    }

    const user = results[0];
    res.send(`Hello, ${user.firstname}!`);
  });
});
const crypto = require('crypto');

app.post('/login', (req, res) => {
  const username = req.body.username;
  const hashedPassword = crypto
    .createHash('sha256')
    .update(req.body.password)
    .digest('hex');

  const sql =
    ' SELECT * FROM user WHERE username = ? AND password = ? ';

  db.query(sql, [username, hashedPassword], (err, results) => {

    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    if (results.length > 0) {
      res.send('welcom back, ${results[0].firstname}!');

    } else {
      res.send('invalid username or password.');
    }
  });
});
//this is for the server side the port to creat the user 
app.post('/create-user', (req, res) => {
  const { username, password, firstname, lastname, birthday } = req.body;
  const hashedPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');

  const sql = 'INSERT INTO user (username, password, firstname, lastname, birthday) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [username, hashedPassword, firstname, lastname, birthday], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.send(`User ${firstname} created successfully!`);
  });
});


app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
