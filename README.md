# Stremio Addon

Este projeto é um addon para o Stremio, uma plataforma de streaming de mídia. O addon fornece funcionalidades específicas que podem ser utilizadas dentro do Stremio.

## Estrutura do Projeto

- `src/index.js`: Ponto de entrada do addon, inicializa o servidor e registra rotas.
- `src/addon.js`: Define as informações do addon, como nome e versão, e manipula requisições.
- `src/utils/helpers.js`: Contém funções utilitárias para formatação de dados e manipulação de strings.
- `package.json`: Configuração do npm, incluindo dependências e scripts.
- `.gitignore`: Arquivos e diretórios a serem ignorados pelo Git.
- `LICENSE`: Licença do projeto.

## Instalação

Para instalar o addon, clone o repositório e execute o seguinte comando:

```
npm install
```

## Uso

Para iniciar o addon, execute:

```
node src/index.js
```

O addon estará disponível em `http://localhost:3000` (ou outra porta configurada).

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).