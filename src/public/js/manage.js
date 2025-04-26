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

    // Upload de arquivo
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const turma = document.getElementById('turma').value;
        const disciplina = document.getElementById('disciplina').value;
        const semana = document.getElementById('semana').value;
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
        const turma = document.getElementById('listTurma').value;
        const disciplina = document.getElementById('listDisciplina').value;

        try {
            const response = await fetch(`/files/list/${encodeURIComponent(turma)}/${encodeURIComponent(disciplina)}`);
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