// Rotas para manipulação de arquivos (upload, download, listagem, etc.)
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const sanitize = require('sanitize-filename');

// Caminho base para a pasta resources
const resourcesPath = path.join(__dirname, '../resources');

// Listar arquivos em uma pasta
router.get('/list/:turma/:disciplina', (req, res) => {
    const { turma, disciplina } = req.params;
    const dirPath = path.join(resourcesPath, turma, disciplina);

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: `Erro ao listar arquivos: ${err.message}` });
        }
        res.json(files);
    });
});

// Fazer upload de um arquivo
router.post('/upload/:turma/:disciplina/:semana', (req, res) => {
    const { turma, disciplina, semana } = req.params;

    // Sanitizar os nomes para remover caracteres inválidos
    const safeTurma = sanitize(turma);
    const safeDisciplina = sanitize(disciplina);
    const safeSemana = sanitize(`Semana ${semana}`);

    const dirPath = path.join(resourcesPath, safeTurma, safeDisciplina, safeSemana);

    console.log('Criando diretório em:', dirPath);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    }

    const file = req.files.file;
    const filePath = path.join(dirPath, file.name);

    // Garantir que o diretório existe
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Erro ao criar diretório:', err.message);
            return res.status(500).json({ error: `Erro ao criar diretório: ${err.message}` });
        }

        // Salvar o arquivo
        file.mv(filePath, (err) => {
            if (err) {
                console.error('Erro ao salvar arquivo:', err.message);
                return res.status(500).json({ error: `Erro ao salvar arquivo: ${err.message}` });
            }
            res.json({ message: 'Arquivo enviado com sucesso!', file: file.name });
        });
    });
});

// Deletar um arquivo
router.delete('/delete/:turma/:disciplina/:file', (req, res) => {
    const { turma, disciplina, file } = req.params;
    const filePath = path.join(resourcesPath, turma, disciplina, file);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: `Erro ao deletar arquivo: ${err.message}` });
        }
        res.json({ message: 'Arquivo deletado com sucesso!' });
    });
});

// Criar logs de acesso
router.post('/log', (req, res) => {
    const logPath = path.join(resourcesPath, 'access.log');
    const logEntry = `${new Date().toISOString()} - ${req.body.message}\n`;

    fs.appendFile(logPath, logEntry, (err) => {
        if (err) {
            return res.status(500).json({ error: `Erro ao escrever log: ${err.message}` });
        }
        res.json({ message: 'Log registrado com sucesso!' });
    });
});

module.exports = router;