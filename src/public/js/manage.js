// Lógica para abrir e fechar a sidebar
const menuButton = document.getElementById('menuButton');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

menuButton.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    mainContent.classList.toggle('ml-64');
});

document.addEventListener("DOMContentLoaded", () => {
    // Carregar turmas no menu suspenso
    async function loadTurmas() {
        const response = await fetch('/turmas');
        const turmas = await response.json();

        const turmaSelects = [document.getElementById('turma'), document.getElementById('listTurma')];
        turmaSelects.forEach(select => {
            turmas.forEach(turma => {
                const option = document.createElement('option');
                option.value = turma.nome;
                option.textContent = turma.nome;
                select.appendChild(option);
            });

            // Adicionar evento para carregar disciplinas ao selecionar uma turma
            select.addEventListener('change', async (e) => {
                const turmaNome = e.target.value;
                const disciplinaSelect = e.target.id === 'turma' ? document.getElementById('disciplina') : document.getElementById('listDisciplina');
                disciplinaSelect.innerHTML = '<option value="" disabled selected>Selecione a Disciplina</option>';

                const turmaResponse = await fetch(`/turmas/${encodeURIComponent(turmaNome)}`);
                const turmaDetalhes = await turmaResponse.json();

                turmaDetalhes.disciplinas.forEach(disciplina => {
                    const option = document.createElement('option');
                    option.value = disciplina.nome;
                    option.textContent = disciplina.nome;
                    disciplinaSelect.appendChild(option);
                });
            });
        });
    }

    // Inicializar o carregamento das turmas
    loadTurmas();
    // Função para normalizar nomes
    function normalizeName(name) {
        return name
            .normalize("NFD") // Remove acentos
            .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas
            .replace(/[^a-zA-Z0-9]/g, "_"); // Substitui caracteres inválidos por "_"
    }
    // Upload de arquivo
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const turma = normalizeName(document.getElementById('turma').value);
        const disciplina = normalizeName(document.getElementById('disciplina').value);
        const semana = normalizeName(document.getElementById('semana').value);
        const file = document.getElementById('file').files[0];
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
            const response = await fetch(`/files/upload/${encodeURIComponent(turma)}/${encodeURIComponent(disciplina)}/${encodeURIComponent(semana)}`, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                const error = await response.json();
                alert(`Erro: ${error.error}`);
                return;
            }
    
            const result = await response.json();
            alert(result.message);
        } catch (err) {
            alert(`Erro inesperado: ${err.message}`);
        }
    });

     // Listar arquivos
    document.getElementById('listForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const turma = normalizeName(document.getElementById('listTurma').value);
        const disciplina = normalizeName(document.getElementById('listDisciplina').value);
        const semana = normalizeName(document.getElementById('listSemana').value);
    
        try {
            const response = await fetch(`/files/list/${encodeURIComponent(turma)}/${encodeURIComponent(disciplina)}/${encodeURIComponent(semana)}`);
            if (!response.ok) {
                const error = await response.json();
                alert(`Erro: ${error.error}`);
                return;
            }
    
            const files = await response.json();
            const fileList = document.getElementById('fileList');
            fileList.innerHTML = '';
    
            files.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file;
                fileList.appendChild(li);
            });
        } catch (err) {
            alert(`Erro inesperado: ${err.message}`);
        }
    });

});

document.addEventListener("DOMContentLoaded", () => {
    const listForm = document.getElementById('listForm');
    const listAllButton = document.getElementById('listAllButton');
    const fileList = document.getElementById('fileList');
    listAllButton.addEventListener('click', listarTodosArquivos);
    // Função para listar arquivos
    async function listarArquivos(turma, disciplina) {
        console.log('Turma:', turma, 'Disciplina:', disciplina);
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '<li>Carregando...</li>';
    
        try {
            const response = await fetch(`/files/list/${encodeURIComponent(turma)}/${encodeURIComponent(disciplina)}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao carregar arquivos');
            }
    
            const arquivos = await response.json();
            fileList.innerHTML = '';
            arquivos.forEach(arquivo => {
                const li = document.createElement('li');
                li.textContent = arquivo;
                fileList.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao listar arquivos:', error);
            fileList.innerHTML = '<li>Erro ao carregar arquivos.</li>';
        }
    }

    // Função para listar todos os arquivos
    async function listarTodosArquivos() {
        console.log('Chamando listarTodosArquivos...');
        fileList.innerHTML = '<li>Carregando...</li>';
    
        try {
            const response = await fetch('/files/list-all');
            console.log('Resposta da API:', response);
            if (!response.ok) throw new Error('Erro ao carregar todos os arquivos');
            const arquivos = await response.json();
            console.log('Arquivos retornados:', arquivos);
    
            fileList.innerHTML = '';
            arquivos.forEach(({ turma, disciplina, semana, arquivo }) => {
                const li = document.createElement('li');
                li.className = 'flex justify-between items-center';
                li.innerHTML = `
                    <span>${turma} / ${disciplina} / ${semana} - ${arquivo}</span>
                `;
                fileList.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao listar todos os arquivos:', error);
            fileList.innerHTML = '<li>Erro ao carregar todos os arquivos.</li>';
        }
    }

    // Função para excluir arquivo
    async function excluirArquivo(turma, disciplina, semana, fileName) {
        try {
            const response = await fetch(`/files/delete/${encodeURIComponent(turma)}/${encodeURIComponent(disciplina)}/${encodeURIComponent(semana)}/${encodeURIComponent(fileName)}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao excluir arquivo');
            alert('Arquivo excluído com sucesso!');
            listarArquivos(turma, disciplina, semana); // Atualizar a lista
        } catch (error) {
            console.error('Erro ao excluir arquivo:', error);
            alert('Erro ao excluir arquivo.');
        }
    }

    // Evento: Listar arquivos ao enviar o formulário
    listForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const turma = document.getElementById('listTurma').value;
        const disciplina = document.getElementById('listDisciplina').value;
        const semana = document.getElementById('listSemana').value;
        listarArquivos(turma, disciplina, semana);
    });
    // Evento: Listar arquivos ao enviar o formulário
    function normalizeName(name) {
        return name
            .normalize("NFD") // Remove acentos
            .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas
            .replace(/[^a-zA-Z0-9]/g, "_"); // Substitui caracteres inválidos por "_"
    }
    
    document.getElementById('listForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const turma = normalizeName(document.getElementById('listTurma').value);
        const disciplina = normalizeName(document.getElementById('listDisciplina').value);
        listarArquivos(turma, disciplina);
    });
    // Evento: Listar todos os arquivos
    listAllButton.addEventListener('click', listarTodosArquivos);
});

