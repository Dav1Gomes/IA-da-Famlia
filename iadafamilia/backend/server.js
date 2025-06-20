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
        const query = user_id ? 'INSERT INTO chats (user_id, title) VALUES (?, ?)' 
        : 'INSERT INTO chats (title) VALUES (?)';
    
            const params = user_id ? [user_id, title.trim()] : [title.trim()];

        db.run(query, params, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            db.get('SELECT * FROM chats WHERE id = ?', [this.lastID], (err, row) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json(row);
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/chats/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE  FROM chats WHERE id = $1', [id]);
        res.status(200).json(result.rows[0]);
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

app.post('/api/faq', (req, res) => {
    const { pergunta, resposta } = req.body;

    const query = `INSERT INTO faq (pergunta, resposta) VALUES (?, ?)`;

    db.run(query, [pergunta, resposta], function (err) {
        if (err) {
            console.error('Erro ao adicionar FAQ:', err.message);
            return res.status(500).json({ message: 'Erro ao registrar FAQ.' });
        }
        res.status(201).json({ id: this.lastID, pergunta, resposta });
    });
});


app.get('/api/faq',  async (req, res) => {
  db.all(`SELECT * FROM faq ORDER BY id ASC`, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar FAQs:', err.message);
      return res.status(500).json({ message: 'Erro ao buscar FAQs.' });
    }
    res.status(200).json(rows);
  });
});

app.delete('/api/faq/:id',  async (req, res) => {
  const { id } = req.params;
  console.log('Mensagem de id:', id);

  db.run(`DELETE FROM faq WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error('Erro ao excluir FAQ:', err.message);
      return res.status(500).json({ message: 'Erro ao excluir FAQ.' });
    }
    console.log(`Mensagem de id: ${id} excluida com sucesso!`);
    res.status(200).json({ message: 'FAQ excluída com sucesso.' });
  });
});

app.post('/api/notas', (req, res) => {
    const { nota, comentario } = req.body;
    const query = `INSERT INTO notas (nota, comentario) VALUES (?, ?)`;

    db.run(query, [nota, comentario], function (err) {
        if (err) {
            console.error('Erro ao adicionar FAQ:', err.message);
            return res.status(500).json({ message: 'Erro ao registrar FAQ.' });
        }
        res.status(201).json({ id: this.lastID, nota, comentario });
    });
});

app.get('/api/notas', (req, res)=>{
    db.all(`SELECT nota, COUNT(*) AS quantidade FROM notas GROUP BY nota ORDER BY nota`, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar FAQs:', err.message);
            return res.status(500).json({ message: 'Erro ao buscar FAQs.' });
    }
    res.status(200).json(rows);
    });
});

app.post('/api/conteudos', (req, res) => {
    const {titulo, descricao, data_inicio, data_fim} = req.body;

    const query = `INSERT INTO conteudos(titulo, descricao, data_inicio, data_fim) VALUES(?, ?, ?, ?)`;

    db.run(query, [titulo, descricao, data_inicio, data_fim], function(err){
        if(err){
            console.error('Erro ao adicionar conteudo:', err.message);
            return res.status(500).json({message: 'Erro ao registrar conteudo.'})
        }
        res.status(201).json({ id: this.lastID, titulo})
    });
});

app.get('/api/conteudos', (req, res) =>{
    db.all(`SELECT * FROM conteudos`,[], (err, rows) =>{
        if(err){
            console.error('Erro ao buscar contéudos:', err.message);
            return res.status(500).json({message: 'Erro ao buscar conteudos.'})
        }
        res.json(rows);
    });
});

app.get('/api/chats_dia', (req, res) => {
  const sql = `SELECT strftime('%w', created_at) AS dia_semana,
      COUNT(*) AS total FROM chats GROUP BY dia_semana `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar chats:', err);
      return res.status(500).json({ error: 'Erro ao buscar chats' });
    }
    res.json(rows);
  });
});


app.delete('/api/conteudos/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    `DELETE FROM conteudos WHERE id = ?`,
    [id],
    function(err) {
      if (err) {
        console.error('Erro ao excluir conteúdo:', err.message);
        return res.status(500).json({ message: 'Erro ao excluir conteúdo.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Conteúdo não encontrado.' });
      }
      res.status(200).json({ message: 'Conteúdo excluído com sucesso.' });
    }
  );
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});