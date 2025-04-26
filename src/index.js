const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");
const turmasRoutes = require('./routes/turmas');
const filesRoutes = require('./routes/files');
const professorRoutes = require('../../professor/routes/professor');
const app = express();
const EXPRESS_PORT = process.env.PORT || 7001; // Porta para o Express
const STREMIO_PORT = 7000; // Porta para o Stremio Addon SDK

app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use('/professor', professorRoutes);
app.use('/professor', express.static(path.join(__dirname, '../../professor/public')));
console.log(path.join(__dirname, '../../professor/public'));
// Usar as rotas das turmas
app.use('/turmas', turmasRoutes);
// Usar as rotas de arquivos
app.use('/files', filesRoutes);

// Servir o addon no endpoint `/stremio`
serveHTTP(addonInterface, { port: STREMIO_PORT });
console.log(`Stremio addon rodando em http://localhost:${STREMIO_PORT}/manifest.json`);

// Servir o Express em outra porta
app.listen(EXPRESS_PORT, () => {
    console.log(`Servidor Express rodando em http://localhost:${EXPRESS_PORT}`);
});