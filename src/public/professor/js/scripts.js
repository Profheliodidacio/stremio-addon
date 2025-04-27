
// Lógica para abrir e fechar a sidebar
const menuButton = document.getElementById('menuButton');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    mainContent.classList.toggle('ml-64');
});

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('modal');
    const abrirModal = document.getElementById('abrirModal');
    const fecharModal = document.getElementById('fecharModal');
    const formAdicionarNotas = document.getElementById('form-adicionar-notas');

        // Abrir o modal
        abrirModal.addEventListener('click', () => {
            modal.classList.add('show');
        });
    
        // Fechar o modal
        fecharModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    
        // Fechar o modal ao clicar fora dele
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('Enviando dados:', newData);
                modal.classList.remove('show');
            }
        });
    
        // Manipular o envio do formulário
        formAdicionarNotas.addEventListener('submit', (e) => {
            e.preventDefault();
            const turma = document.getElementById('turma').value;
            const disciplina = document.getElementById('disciplina').value;
            const alunosInput = JSON.parse(document.getElementById('alunos').value);
            
            let alunos;
            try {
                alunos = JSON.parse(alunosInput);
                if (!Array.isArray(alunos)) {
                    throw new Error('O campo "Alunos" deve conter um array de objetos JSON.');
                }
            } catch (error) {
                alert(`Erro: ${error.message}`);
                return;
            }
            const newData = { turma, disciplina, alunos };
            adicionarDados('notas', newData);
    
            // Fechar o modal após salvar
            modal.classList.remove('show');
        });
    
    // Função para carregar turmas
    async function carregarTurmas() {
        const response = await fetch('/data/notas.json');
        const data = await response.json();
        const turmasLista = document.getElementById('turmas-lista');
        turmasLista.innerHTML = '';

        data.turmas.forEach(turma => {
            const li = document.createElement('li');
            li.textContent = `${turma.nome} - ${turma.disciplina}`;
            turmasLista.appendChild(li);
        });
    }

    // Função para carregar gabaritos
    async function carregarGabaritos() {
        const response = await fetch('/data/gabaritos.json');
        const data = await response.json();
        const gabaritosLista = document.getElementById('gabaritos-lista');
        gabaritosLista.innerHTML = '';

        data.gabaritos.forEach(gabarito => {
            const li = document.createElement('li');
            li.textContent = `${gabarito.turma} / ${gabarito.disciplina} / ${gabarito.semana} - ${gabarito.arquivo}`;
            gabaritosLista.appendChild(li);
        });
    }

    // Função para carregar notas
    async function carregarNotas() {
        const response = await fetch('/data/notas.json');
        const data = await response.json();
        const notasLista = document.getElementById('notas-lista');
        notasLista.innerHTML = '';

        data.turmas.forEach(turma => {
            turma.alunos.forEach(aluno => {
                const li = document.createElement('li');
                li.textContent = `${aluno.nome} (${turma.nome} - ${turma.disciplina}): ${aluno.notas.join(', ')}`;
                notasLista.appendChild(li);
            });
        });
    }

    // Função para carregar fóruns
    async function carregarForuns() {
        const response = await fetch('/data/foruns.json');
        const data = await response.json();
        const forunsLista = document.getElementById('foruns-lista');
        forunsLista.innerHTML = '';

        data.foruns.forEach(forum => {
            const li = document.createElement('li');
            li.textContent = `${forum.turma} / ${forum.disciplina} / ${forum.semana} - Pergunta: ${forum.pergunta}`;
            forunsLista.appendChild(li);
        });
    }

    // Função para carregar quizzes
    async function carregarQuizzes() {
        const response = await fetch('/data/quizzes.json');
        const data = await response.json();
        const quizzesLista = document.getElementById('quizzes-lista');
        quizzesLista.innerHTML = '';

        data.quizzes.forEach(quiz => {
            const li = document.createElement('li');
            li.textContent = `${quiz.turma} / ${quiz.disciplina} / ${quiz.semana} - ${quiz.titulo}`;
            quizzesLista.appendChild(li);
        });
    }
    document.getElementById('form-adicionar-notas').addEventListener('submit', (e) => {
        e.preventDefault();
        const turma = document.getElementById('turma').value;
        const disciplina = document.getElementById('disciplina').value;
        const alunos = JSON.parse(document.getElementById('alunos').value);
    
        const newData = { turma, disciplina, alunos };
        adicionarDados('notas', newData);
    });

    async function listarDados(file, targetElementId) {
        try {
            const response = await fetch(`/data-api/${file}`);
            if (!response.ok) throw new Error('Erro ao carregar dados');
            const data = await response.json();
    
            const targetElement = document.getElementById(targetElementId);
            targetElement.innerHTML = '';
    
            if (Array.isArray(data)) {
                data.forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = JSON.stringify(item);
                    targetElement.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = JSON.stringify(data);
                targetElement.appendChild(li);
            }
        } catch (error) {
            console.error('Erro ao listar dados:', error);
        }
    }

    async function removerDados(file, id) {
        try {
            const response = await fetch(`/data-api/${file}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Erro ao remover dados');
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Erro ao remover dados:', error);
        }
    }
    async function atualizarDados(file, updatedData) {
        try {
            const response = await fetch(`/data-api/${file}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) throw new Error('Erro ao atualizar dados');
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
        }
    }
    async function adicionarDados(file, newData) {
        try {
            const response = await fetch(`/data-api/${file}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData),
            });
            if (!response.ok) throw new Error('Erro ao adicionar dados');
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Erro ao adicionar dados:', error);
        }
    }





    // Carregar todos os dados
    carregarTurmas();
    carregarGabaritos();
    carregarNotas();
    carregarForuns();
    carregarQuizzes();
    atualizarDados('notas', { turma: 'Turma A', disciplina: 'Matemática', alunos: [{ nome: 'João', notas: [10, 9] }] });
});
























// document.addEventListener("DOMContentLoaded", () => {
//     // Carregar turmas
//     fetch('/professor/turmas')
//         .then(response => response.json())
//         .then(turmas => {
//             const turmasLista = document.getElementById('turmas-lista');
//             const turmaSelect = document.getElementById('turma');

//             turmas.forEach(turma => {
//                 // Adicionar à lista de turmas
//                 const li = document.createElement('li');
//                 li.textContent = turma.nome;
//                 turmasLista.appendChild(li);

//                 // Adicionar ao select de gabaritos
//                 const option = document.createElement('option');
//                 option.value = turma.nome;
//                 option.textContent = turma.nome;
//                 turmaSelect.appendChild(option);
//             });
//         });

//     // Enviar gabarito
//     document.getElementById('gabarito-form').addEventListener('submit', (e) => {
//         e.preventDefault();

//         const turma = document.getElementById('turma').value;
//         const arquivo = document.getElementById('arquivo-gabarito').files[0];

//         const formData = new FormData();
//         formData.append('turma', turma);
//         formData.append('gabarito', arquivo);

//         fetch('/professor/gabaritos', {
//             method: 'POST',
//             body: formData
//         })
//         .then(response => response.json())
//         .then(result => {
//             alert(result.message);
//         })
//         .catch(err => {
//             alert('Erro ao enviar gabarito.');
//             console.error(err);
//         });
//     });
// });