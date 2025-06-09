const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(query, [name, email, hashedPassword], function (err) {
        if (err) {
            console.error('Erro ao registrar o usuário:', err.message);
            return res.status(500).json({ message: 'Erro ao registrar o usuário.' });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err.message);
            return res.status(500).json({ message: 'Erro no servidor.' });
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        res.status(200).json({ message: 'Login bem-sucedido!' });
    });
});

app.post('/api/chats', async (req, res) => {
    const { user_id, title } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING *',
            [user_id, title]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/chats/:id', async (req, res) => {
    const { id } = req.params;
    const { messages } = req.body;
    try {
        const result = await db.query(
            'UPDATE chats SET messages = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [JSON.stringify(messages), id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/chats/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM chats WHERE user_id = $1 ORDER BY updated_at DESC',
            [user_id]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/chats/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM chats WHERE id = $1', [id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
