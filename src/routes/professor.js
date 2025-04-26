const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data/professores.json');

// Rota para listar turmas
router.get('/turmas', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(data.turmas);
});

// Rota para enviar gabarito
router.post('/gabaritos', (req, res) => {
    const { turma } = req.body;
    const gabarito = req.files.gabarito;

    const turmaPath = path.join(__dirname, '../data', turma);
    fs.mkdirSync(turmaPath, { recursive: true });

    const gabaritoPath = path.join(turmaPath, gabarito.name);
    gabarito.mv(gabaritoPath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao salvar gabarito.' });
        }
        res.json({ message: 'Gabarito enviado com sucesso!' });
    });
});

module.exports = router;