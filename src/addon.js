const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
    id: "org.stremio.localcontent",
    version: "1.0.0",
    name: "Aulas e Recursos Locais",
    description: "Addon para exibir aulas com vídeos, PDFs, textos e imagens.",
    resources: ["catalog", "meta", "stream"],
    types: ["movie"], // Pode ser "movie", "series", "channel", etc.
    catalogs: [
        {
            type: "movie",
            id: "local_content_catalog",
            name: "Aulas Locais"
        }
    ]
};

const builder = new addonBuilder(manifest);

// Catálogo de turmas
builder.defineCatalogHandler(({ type, id }) => {
    if (type === "movie" && id === "local_content_catalog") {
        const turmas = require("./data/turmas").turmas;
        const metas = turmas.map(turma => ({
            id: turma.nome, // ID único para cada turma
            name: turma.nome,
            type: "movie",
            poster: "https://via.placeholder.com/150", // Substitua por um link real, se necessário
            description: `Disciplinas disponíveis para ${turma.nome}.`
        }));
        return Promise.resolve({ metas });
    }
    return Promise.resolve({ metas: [] });
});

// Metadados de uma turma
builder.defineMetaHandler(({ type, id }) => {
    const turmas = require("./data/turmas").turmas;
    const turma = turmas.find(t => t.nome === id);
    if (turma) {
        return Promise.resolve({
            meta: {
                id: turma.nome,
                name: turma.nome,
                type: "movie",
                poster: "https://via.placeholder.com/150", // Substitua por um link real
                description: `Disciplinas disponíveis para ${turma.nome}.`,
                videos: turma.disciplinas.map(disciplina => ({
                    id: `${turma.nome}-${disciplina.nome}`,
                    title: disciplina.nome,
                    released: new Date().toISOString()
                }))
            }
        });
    }
    return Promise.resolve(null);
});

// Streams de uma disciplina
builder.defineStreamHandler(({ type, id }) => {
    const [turmaNome, disciplinaNome] = id.split("-");
    const turmas = require("./data/turmas").turmas;
    const turma = turmas.find(t => t.nome === turmaNome);
    if (turma) {
        const disciplina = turma.disciplinas.find(d => d.nome === disciplinaNome);
        if (disciplina) {
            const streams = disciplina.semanas.map((semana, index) => ({
                title: `Semana ${semana.semana}`,
                url: `http://localhost:7000/resources/${encodeURIComponent(turmaNome)}/${encodeURIComponent(disciplinaNome)}/video${index + 1}.mp4`
            }));
            return Promise.resolve({ streams });
        }
    }
    return Promise.resolve({ streams: [] });
});

module.exports = builder.getInterface();










