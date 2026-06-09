const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("[API] SUPABASE_URL carregada:", !!supabaseUrl);
console.log("[API] SUPABASE_KEY carregada:", !!supabaseKey);

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL não configurada no backend.");
}

if (!supabaseKey) {
  throw new Error("Chave do Supabase não configurada no backend.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash: hashedPassword }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Este e-mail já está registado.' });
      }
      return res.status(500).json({ error: error.message });
    }

    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    return res.status(201).json({
      user: { id: data.id, name: data.name, email: data.email },
      token
    });
  } catch (err) {
    console.error('[API] Erro interno no cadastro:', err.message || err);
    if (!supabaseUrl) {
      return res.status(500).json({ error: 'Falta variável SUPABASE_URL no servidor.' });
    }
    if (err.message && err.message.includes('fetch failed')) {
      return res.status(502).json({ error: 'Falha de conexão com o Supabase. Verifique a URL do banco.' });
    }
    return res.status(500).json({ error: 'Erro interno no servidor ao tentar cadastrar.' });
  }
});

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error('[API] Erro interno no login:', err.message || err);
    if (!supabaseUrl) {
      return res.status(500).json({ error: 'Falta variável SUPABASE_URL no servidor.' });
    }
    if (err.message && err.message.includes('fetch failed')) {
      return res.status(502).json({ error: 'Falha de conexão com o Supabase. Verifique a URL do banco.' });
    }
    return res.status(500).json({ error: 'Erro interno no servidor ao tentar logar.' });
  }
});

router.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', req.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao obter dados do usuário.' });
  }
});



router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(rooms);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar salas.' });
  }
});

router.post('/rooms', authMiddleware, async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'O nome da sala é obrigatório.' });
  }

  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .insert([{ name, description }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(room);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar sala.' });
  }
});

router.get('/rooms/:id', authMiddleware, async (req, res) => {
  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !room) return res.status(404).json({ error: 'Sala não encontrada.' });
    return res.json(room);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar sala.' });
  }
});



router.get('/rooms/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', req.params.id)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao carregar histórico.' });
  }
});

router.get('/rooms/:id/messages/search', authMiddleware, async (req, res) => {
  const { q } = req.query;
  const roomId = req.params.id;

  if (!q) {
    return res.status(400).json({ error: 'Termo de busca é obrigatório.' });
  }

  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .ilike('content', `%${q}%`)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar mensagens.' });
  }
});

module.exports = router;