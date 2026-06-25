const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const authMiddleware = require('../middleware/auth');
 
const supabase = createClient(
  process.env.SUPABASE_URL || 'http://placeholder',
  process.env.SUPABASE_KEY || 'placeholder'
);
 
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
router.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
 
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
 
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
 
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
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
    return res.status(500).json({ error: 'Erro interno no servidor.' });
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
 
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
 
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
 
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no servidor.' });
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
    return res.json(rooms);
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
    return res.json(room);
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
 
module.exports = router;