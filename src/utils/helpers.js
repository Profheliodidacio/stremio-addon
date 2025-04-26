module.exports = {
    formatData: (data) => {
        // Implementação da formatação de dados
        return JSON.stringify(data, null, 2);
    },

    manipulateString: (str) => {
        // Implementação da manipulação de strings
        return str.trim().toLowerCase();
    },

    // Adicione mais funções utilitárias conforme necessário
};