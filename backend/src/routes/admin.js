const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const adminAuth = require('../middleware/adminAuth');

const supabase = createClient(
    process.env.SUPABASE_URL || 'http://placeholder',
    process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

router.use(adminAuth);

router.get('/users', async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, status, created_at');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

router.put('/users/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabase
        .from('users')
        .update({ status })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

router.get('/rooms', async (req, res) => {
    const { data, error } = await supabase
        .from('rooms')
        .select('*, users (name)');

    if (error) return res.status(500).json({ error: error.message });

    const formattedData = data.map(room => ({
        ...room,
        user: room.users ? room.users.name : 'Desconhecido'
    }));

    res.json(formattedData);
});

router.get('/reports', async (req, res) => {
    const { data, error } = await supabase
        .from('reports')
        .select('*, reporter:reporter_id(name), reported:reported_user_id(name)');

    if (error) return res.status(500).json({ error: error.message });

    const formattedData = data.map(rep => ({
        ...rep,
        user: rep.reported ? rep.reported.name : 'Desconhecido',
        reporterName: rep.reporter ? rep.reporter.name : 'Anônimo'
    }));

    res.json(formattedData);
});

router.get('/feedbacks', async (req, res) => {
    const { data, error } = await supabase
        .from('feedbacks')
        .select('*, users(name)');

    if (error) return res.status(500).json({ error: error.message });

    const formattedData = data.map(fb => ({
        ...fb,
        user: fb.users ? fb.users.name : 'Anônimo'
    }));

    res.json(formattedData);
});


router.delete('/rooms/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Sala apagada com sucesso' });
});

module.exports = router;

