const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Registo, login e dados do usuário autenticado
 *   - name: Rooms
 *     description: Criação e listagem de salas
 *   - name: Messages
 *     description: Histórico de mensagens de uma sala
 */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas. Tente novamente mais tarde.' }
});

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

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wssi Helio
 *               email:
 *                 type: string
 *                 example: wssihelio@email.com
 *               password:
 *                 type: string
 *                 example: senhaSegura123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Campos faltando ou e-mail já registado
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/auth/register', authLimiter, async (req, res) => {
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
    return res.status(500).json({ error: 'Erro interno no servidor ao registar.' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuario existente (Login)
 *     description: Valida o e-mail informado e compara a senha.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: wssihelio@email.com
 *               password:
 *                 type: string
 *                 example: senhaSegura123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais incorretas
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/auth/login', authLimiter, async (req, res) => {
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

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obter dados do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao obter dados do usuário
 */
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

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Listar todas as salas
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salas retornada com sucesso
 *       500:
 *         description: Erro ao listar salas
 */
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });

    const { data: members } = await supabase.from('room_members').select('room_id');
    const countMap = {};
    if (members) {
      members.forEach(m => { countMap[m.room_id] = (countMap[m.room_id] || 0) + 1; });
    }

    const roomsWithCount = rooms.map(r => ({
      ...r,
      members_count: countMap[r.id] || 0
    }));

    return res.json(roomsWithCount);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao listar salas.' });
  }
});

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Criar nova sala
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sala Geral
 *               description:
 *                 type: string
 *                 example: Sala para discussões gerais
 *     responses:
 *       201:
 *         description: Sala criada com sucesso
 *       400:
 *         description: Nome da sala não informado
 *       500:
 *         description: Erro ao criar sala
 */
router.post('/rooms', authMiddleware, async (req, res) => {
  const { name, description, category } = req.body;
  const normalizedName = name?.trim();

  if (!normalizedName) {
    return res.status(400).json({ error: 'O nome da sala é obrigatório.' });
  }

  try {
    const { data: existingRooms, error: existingError } = await supabase
      .from('rooms')
      .select('id, name, owner_id')
      .eq('owner_id', req.userId)
      .ilike('name', normalizedName);

    if (existingError) {
      return res.status(500).json({ error: existingError.message });
    }

    const alreadyExists = existingRooms?.some(
      room => room.name.trim().toLowerCase() === normalizedName.toLowerCase()
    );

    if (alreadyExists) {
      return res.status(409).json({ error: "Você já criou uma sala com esse nome." });
    }

    const insertData = { name: normalizedName, description: description?.trim(), owner_id: req.userId };
    if (category) insertData.category = category;

    const { data: room, error } = await supabase
      .from('rooms')
      .insert([insertData])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    await supabase.from('room_members').upsert([{
      room_id: room.id,
      user_id: req.userId,
      role: 'owner'
    }], { onConflict: 'room_id,user_id' });

    return res.status(201).json({ ...room, members_count: 1, current_user_role: 'owner' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar sala.' });
  }
});

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Buscar uma sala pelo ID
 *     tags: [Rooms]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sala
 *     responses:
 *       200:
 *         description: Sala encontrada
 *       404:
 *         description: Sala não encontrada
 *       500:
 *         description: Erro ao buscar sala
 */
router.get('/rooms/:id', authMiddleware, async (req, res) => {
  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !room) return res.status(404).json({ error: 'Sala não encontrada.' });

    const { count } = await supabase.from('room_members').select('*', { count: 'exact', head: true }).eq('room_id', room.id);
    const { data: member } = await supabase.from('room_members').select('role').eq('room_id', room.id).eq('user_id', req.userId).single();

    return res.json({
      ...room,
      members_count: count || 0,
      is_member: !!member,
      current_user_role: member ? member.role : null
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar sala.' });
  }
});

router.post('/rooms/:id/join', authMiddleware, async (req, res) => {
  const roomId = req.params.id;
  const userId = req.userId;

  try {
    const { data: room, error: roomError } = await supabase.from('rooms').select('id, max_users').eq('id', roomId).single();
    if (roomError || !room) return res.status(404).json({ error: 'Sala não encontrada' });

    const { data: existingMember } = await supabase.from('room_members').select('*').eq('room_id', roomId).eq('user_id', userId).single();
    if (existingMember) return res.json({ success: true, member: existingMember });

    const { count } = await supabase.from('room_members').select('*', { count: 'exact', head: true }).eq('room_id', roomId);
    if (room.max_users && count >= room.max_users) {
      return res.status(400).json({ error: 'A sala já está cheia' });
    }

    const { data: newMember, error: insertError } = await supabase.from('room_members').insert([{ room_id: roomId, user_id: userId, role: 'user' }]).select().single();
    if (insertError) return res.status(500).json({ error: insertError.message });

    return res.json({ success: true, member: newMember });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar sala.' });
  }
});

/**
 * @swagger
 * /rooms/{id}/messages:
 *   get:
 *     summary: Listar histórico de mensagens de uma sala
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da sala
 *     responses:
 *       200:
 *         description: Lista de mensagens retornada com sucesso
 *       500:
 *         description: Erro ao carregar histórico
 */
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

router.get('/rooms/:id/members', authMiddleware, async (req, res) => {
  try {
    const { data: members, error } = await supabase
      .from('room_members')
      .select('role, joined_at, users(id, name, email)')
      .eq('room_id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });

    const formattedMembers = members.map(m => ({
      id: m.users.id,
      name: m.users.name,
      email: m.users.email,
      role: m.role,
      joined_at: m.joined_at,
      online: false
    }));

    return res.json(formattedMembers);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar membros da sala.' });
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

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { count: active_rooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true });

    const { count: total_room_memberships } = await supabase
      .from('room_members')
      .select('*', { count: 'exact', head: true });

    const { data: members } = await supabase
      .from('room_members')
      .select('user_id');

    let unique_users = 0;
    if (members) {
      const uniqueIds = new Set(members.map(m => m.user_id));
      unique_users = uniqueIds.size;
    }

    return res.json({
      active_rooms: active_rooms || 0,
      unique_users,
      total_room_memberships: total_room_memberships || 0
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao carregar estatísticas.' });
  }
});

module.exports = router;