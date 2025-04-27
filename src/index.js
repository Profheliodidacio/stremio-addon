const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { serveHTTP } = require("stremio-addon-sdk");
const addonInterface = require("./addon");
const turmasRoutes = require('./routes/turmas');
const filesRoutes = require('./routes/files');
const professorRoutes = require('./routes/professor'); // Caminho atualizado
const app = express();
const EXPRESS_PORT = process.env.PORT || 7001; // Porta para o Express
const STREMIO_PORT = 7000; // Porta para o Stremio Addon SDK
const dataRoutes = require('./routes/data');

// Registrar as rotas para manipular JSONs
app.use('/data-api', dataRoutes);

app.use(express.json());
app.use(fileUpload());
app.use(cors());

// Usar as rotas das turmas
app.use('/turmas', turmasRoutes);
// Usar as rotas de arquivos
app.use('/files', filesRoutes);
// Usar as rotas de professor
app.use('/professor', professorRoutes);
app.use('/professor', express.static(path.join(__dirname, 'public/professor'))); // Caminho atualizado
console.log(path.join(__dirname, 'public/professor'));

// Servir arquivos estáticos (deve vir depois das rotas dinâmicas)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));
app.use('/data', express.static(path.join(__dirname, 'data')));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/resources', express.static(path.join(__dirname, 'resources')));
// app.use('/professor', professorRoutes);


// Servir o addon no endpoint `/stremio`
serveHTTP(addonInterface, { port: STREMIO_PORT });
console.log(`Stremio addon rodando em http://localhost:${STREMIO_PORT}/manifest.json`);

// Servir o Express em outra porta
app.listen(EXPRESS_PORT, () => {
    console.log(`Servidor Express rodando em http://localhost:${EXPRESS_PORT}`);
});