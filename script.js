function exibirObjetoJSON(objetoJSON) {
    const objetosJSONDiv = document.getElementById('objetosJSON');
    const objetoJSONString = JSON.stringify(objetoJSON, null, 2); // Formata o JSON para exibição
    objetosJSONDiv.innerHTML += '<pre>' + objetoJSONString + '</pre>'; // Exibe o JSON formatado
}

function processarJSONs(conteudo) {
    const objetosJSONDiv = document.getElementById('objetosJSON');
    objetosJSONDiv.innerHTML = ''; // Limpa o conteúdo anterior

    const linhas = conteudo.split('\n'); // Divide o conteúdo em linhas

    linhas.forEach(linha => {
        if (linha.trim() !== '') { // Ignora linhas vazias
            try {
                const objetoJSON = JSON.parse(linha);
                exibirObjetoJSON(objetoJSON);
            } catch (erro) {
                console.error('Erro ao analisar JSON:', erro);
                objetosJSONDiv.innerHTML += '<p>Erro ao analisar JSON: ' + linha + '</p>';
            }
        }
    });
}

function lerArquivo() {
    const arquivoInput = document.getElementById('arquivoInput');
    const arquivo = arquivoInput.files[0];

    if (arquivo) {
        const leitor = new FileReader();

        leitor.onload = function(evento) {
            const conteudo = evento.target.result;
            document.getElementById('conteudoArquivo').value = conteudo;
            processarJSONs(conteudo);
        };

        leitor.readAsText(arquivo);
        
    } else {
        alert('Selecione um arquivo.');
    }
}

function salvarArquivo() {
    const conteudo = document.getElementById('conteudoArquivo').value;
    const nomeArquivo = 'arquivo_salvo.txt';

    const elemento = document.createElement('a');
    elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(conteudo));
    elemento.setAttribute('download', nomeArquivo);

    elemento.style.display = 'none';
    document.body.appendChild(elemento);

    elemento.click();

    document.body.removeChild(elemento);
}