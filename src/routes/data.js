const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../data');

// Função para carregar um arquivo JSON
const loadJSON = (fileName) => {
    const filePath = path.join(dataPath, fileName);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// Função para salvar um arquivo JSON
const saveJSON = (fileName, data) => {
    const filePath = path.join(dataPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
};

// Listar dados de um JSON
router.get('/:file', (req, res) => {
    const { file } = req.params;
    const data = loadJSON(`${file}.json`);
    if (!data) {
        return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }
    res.json(data);
});

// Adicionar dados a um JSON
router.post('/:file', (req, res) => {
    console.log('Recebendo dados:', req.body);
    const { file } = req.params;
    const newData = req.body;

    const data = loadJSON(`${file}.json`);
    if (!data) {
        return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    if (Array.isArray(data)) {
        data.push(newData);
    } else {
        Object.assign(data, newData);
    }

    saveJSON(`${file}.json`, data);
    res.json({ message: 'Dados adicionados com sucesso.', data });
});

// Atualizar dados em um JSON
router.put('/:file', (req, res) => {
    const { file } = req.params;
    const updatedData = req.body;

    const data = loadJSON(`${file}.json`);
    if (!data) {
        return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    saveJSON(`${file}.json`, updatedData);
    res.json({ message: 'Dados atualizados com sucesso.', data: updatedData });
});

// Remover dados de um JSON
router.delete('/:file/:id', (req, res) => {
    const { file, id } = req.params;

    const data = loadJSON(`${file}.json`);
    if (!data) {
        return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    if (Array.isArray(data)) {
        const index = data.findIndex((item) => item.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Item não encontrado.' });
        }
        data.splice(index, 1);
    } else {
        delete data[id];
    }

    saveJSON(`${file}.json`, data);
    res.json({ message: 'Item removido com sucesso.', data });
});

module.exports = router;