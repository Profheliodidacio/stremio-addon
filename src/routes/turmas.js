const express = require('express');
const router = express.Router();
const turmas = require('../data/turmas');

// Rota para listar todas as turmas
router.get('/', (req, res) => {
    res.json(turmas.turmas.map(turma => ({ nome: turma.nome })));
});

// Rota para obter detalhes de uma turma específica
router.get('/:nome', (req, res) => {
    const turma = turmas.turmas.find(t => t.nome === req.params.nome);
    if (turma) {
        res.json(turma);
    } else {
        res.status(404).json({ error: "Turma não encontrada" });
    }
});

// Rota para obter detalhes de uma disciplina específica
router.get('/:nome/disciplina/:disciplina', (req, res) => {
    const turma = turmas.turmas.find(t => t.nome === req.params.nome);
    if (turma) {
        const disciplina = turma.disciplinas.find(d => d.nome === req.params.disciplina);
        if (disciplina) {
            res.json(disciplina);
        } else {
            res.status(404).json({ error: "Disciplina não encontrada" });
        }
    } else {
        res.status(404).json({ error: "Turma não encontrada" });
    }
});

module.exports = router;