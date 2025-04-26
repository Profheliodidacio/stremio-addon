document.addEventListener("DOMContentLoaded", () => {
    // Carregar turmas
    fetch('/professor/turmas')
        .then(response => response.json())
        .then(turmas => {
            const turmasLista = document.getElementById('turmas-lista');
            const turmaSelect = document.getElementById('turma');

            turmas.forEach(turma => {
                // Adicionar à lista de turmas
                const li = document.createElement('li');
                li.textContent = turma.nome;
                turmasLista.appendChild(li);

                // Adicionar ao select de gabaritos
                const option = document.createElement('option');
                option.value = turma.nome;
                option.textContent = turma.nome;
                turmaSelect.appendChild(option);
            });
        });

    // Enviar gabarito
    document.getElementById('gabarito-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const turma = document.getElementById('turma').value;
        const arquivo = document.getElementById('arquivo-gabarito').files[0];

        const formData = new FormData();
        formData.append('turma', turma);
        formData.append('gabarito', arquivo);

        fetch('/professor/gabaritos', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
        })
        .catch(err => {
            alert('Erro ao enviar gabarito.');
            console.error(err);
        });
    });
});