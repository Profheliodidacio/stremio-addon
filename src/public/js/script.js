
// Lógica para abrir e fechar a sidebar no index.html
const menuButtonIndex = document.getElementById('menuButtonIndex');
const sidebarIndex = document.getElementById('sidebarIndex');
const mainContentIndex = document.getElementById('mainContentIndex');

menuButtonIndex.addEventListener('click', () => {
    sidebarIndex.classList.toggle('-translate-x-full');
    mainContentIndex.classList.toggle('ml-64');
});


document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    // Busca os dados das turmas do servidor
    fetch("/turmas")
        .then(response => response.json())
        .then(data => {
            data.turmas.forEach(turma => {
                const turmaDiv = document.createElement("div");
                turmaDiv.classList.add("turma");
                turmaDiv.innerHTML = `<h2>${turma.nome}</h2>`;

                turma.disciplinas.forEach(disciplina => {
                    const disciplinaDiv = document.createElement("div");
                    disciplinaDiv.classList.add("disciplina");
                    disciplinaDiv.innerHTML = `
                        <strong>${disciplina.nome}</strong> - ${disciplina.mes} (${disciplina.horas_totais} horas)
                        <ul>
                            ${disciplina.semanas.map(semana => `<li>Semana ${semana.semana}: ${semana.aulas} aulas</li>`).join("")}
                        </ul>
                    `;
                    turmaDiv.appendChild(disciplinaDiv);
                });

                content.appendChild(turmaDiv);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar os dados:", error);
            content.innerHTML = "<p>Erro ao carregar os dados.</p>";
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    fetch("/turmas")
        .then(response => response.json())
        .then(data => {
            data.forEach(turma => {
                const turmaDiv = document.createElement("div");
                turmaDiv.classList.add("p-4", "mb-4", "border", "rounded", "bg-gray-50");
                turmaDiv.innerHTML = `<h2 class="text-xl font-semibold">${turma.nome}</h2>`;

                fetch(`/turmas/${encodeURIComponent(turma.nome)}`)
                    .then(response => response.json())
                    .then(turmaDetalhes => {
                        turmaDetalhes.disciplinas.forEach(disciplina => {
                            const disciplinaDiv = document.createElement("div");
                            disciplinaDiv.classList.add("ml-4", "pl-4", "border-l-4", "border-blue-500");
                            disciplinaDiv.innerHTML = `
                                <strong>${disciplina.nome}</strong>
                                <ul class="list-disc ml-6">
                                    ${disciplina.arquivos.map(arquivo => `
                                        <li>
                                            <a href="${arquivo.caminho}" target="_blank">${arquivo.nome} (${arquivo.tipo})</a>
                                        </li>
                                    `).join("")}
                                </ul>
                            `;
                            turmaDiv.appendChild(disciplinaDiv);
                        });
                    });

                content.appendChild(turmaDiv);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar os dados:", error);
            content.innerHTML = "<p class='text-red-500'>Erro ao carregar os dados.</p>";
        });
});