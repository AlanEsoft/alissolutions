let arrayDeObjetos = []; // Define arrayDeObjetos no escopo global

function criarObjetosJSON(conteudo) {
    const linhas = conteudo.split(';');
    const array = [];

    linhas.forEach(linha => {
        const linhaTrimmed = linha.trim();
        if (linhaTrimmed !== '') {
            try {
                const objetoJSON = JSON.parse(linhaTrimmed);
                array.push(objetoJSON);
            } catch (erro) {
                console.error('Erro ao analisar JSON:', erro, 'na linha:', linhaTrimmed);
            }
        }
    });

    return array;
}

function lerArquivo(nomeDigitado, senhaDigitada) {
    const arquivoInput = document.getElementById('arquivoInput');
    const arquivo = arquivoInput.files[0];
    const menuDiv = document.getElementById('menu');
    const loginDiv = document.getElementById('login');

    if (arquivo) {
        const leitor = new FileReader();

        leitor.onload = function(evento) {
            const conteudo = evento.target.result;
            arrayDeObjetos = criarObjetosJSON(conteudo); // Atribui o resultado ao array global

            const usuarioAutenticado = arrayDeObjetos.some(usuario =>
                usuario.nome === nomeDigitado && usuario.senha === senhaDigitada
            );

            if (usuarioAutenticado) {
                menuDiv.style.display = 'block';
                loginDiv.style.display = 'none';
            } else {
                alert('Nome não encontrado ou senha incorreta!');
            }
        };

        leitor.onerror = function(evento) {
            console.error('Erro ao ler o arquivo:', evento.target.error);
            alert('Erro ao ler o arquivo.');
        };

        leitor.readAsText(arquivo);

    } else {
        alert('Selecione um arquivo.');
    }
}

function autenticar() {
    const nome = document.getElementById('idNome').value;
    const senha = document.getElementById('idSenha').value;
    lerArquivo(nome, senha); // Passa nome e senha para lerArquivo
}