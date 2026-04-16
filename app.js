const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./database');
const app = express();
const path = require('path');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

app.use(express.json()); // To parse JSON bodies
// Servir arquivos que estão dentro da pasta 'html' (como o próprio cadastro.html)
app.use(express.static('html'));
app.use(express.urlencoded({ extended: true }));
app.use('/html', express.static(path.join(__dirname, 'html')));

// Libera o acesso direto às pastas de recursos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));

app.use(session({
    secret: 'coxinhaaa', // Use uma string aleatória e segura
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Mude para true se usar HTTPS
        maxAge: 3600000 // Tempo de vida do cookie (1 hora)
    }
}));

// 1. User Registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const saltRounds = 10;

    try {
        // const hash = await bcrypt.hash(password, saltRounds);
        db.run(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`, 
            [username, email, password], (err) => {
            if (err) return res.status(400).send("User already exists or error occurred.");
            res.send("User registered successfully!");
            console.log("deu certo o cadastro");
        });
    } catch (err) {
        res.status(500).send("Server error during hashing.");
        console.log("deu ruim o cadastro");
    }
});

// 2. User Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Use prepared statements to prevent SQL injection
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) return res.status(400).send("User not found.");
        // const match = await bcrypt.compare(password, user.password_hash);
        if (password == user.password_hash) {
            // Here you would typically start a session or issue a JWT
            res.send("Login successful!");
            req.session.userId = row.id;
            req.session.username = username;

            return res.redirect('/dashboard');
        } else {
            res.status(401).send("Invalid password.");
        }
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
