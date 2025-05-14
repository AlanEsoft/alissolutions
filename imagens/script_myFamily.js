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
function listaComprasOpen() {
    const menuDiv = document.getElementById('menu');
    const ListaComprasDiv = document.getElementById('divListaCompras');
    menuDiv.style.display = 'none';
    ListaComprasDiv.style.display = 'block';  
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
let produto = document.getElementById("produto")
        let quantidade = document.getElementById("quantidade")
        let preco = document.getElementById("preco")
        let lista = document.getElementById("lista")
        let total = document.getElementById("total")
        let produtos = []
        let quantidades = []
        let precos = []
        let contador = 1

        function somarItemCompras(){
            let soma = 0
            for (let i = 0; i < precos.length; i++) {
                soma += quantidades[i]*precos[i]
            }
            return soma
        }

        function editarItemCompras(id) {
           let resposta = window.prompt('Você quer CORRIGIR ou APAGAR?', 'APAGAR')
           let itemEdit = document.getElementById(`item${id}`)
           let btnItem = document.getElementById(id)
           if (resposta == 'CORRIGIR' || resposta == 'corrigir') {
                resposta = window.prompt('Corrigir QUANTIDADE ou PREÇO?', 'PREÇO')
                if (resposta == 'QUANTIDADE' || resposta == 'quantidade'){
                    resposta = Number(window.prompt('Digite a quantidade desejada:', '1'))
                    quantidades[id-1] = resposta
                    itemEdit.textContent = `${resposta} ${produtos[id-1]} a R$ ${precos[id-1]} cada.`
                    let valorTotal = somarItemCompras()
                    total.innerText = `O total é R$ ${valorTotal}`
                }
                else {
                    if (resposta == 'PREÇO' || resposta == 'preço') {
                        resposta = Number(window.prompt('Digite o preço atualizado:', '1,0'))
                        precos[id-1] = resposta
                        itemEdit.textContent = `${quantidades[id-1]} ${produtos[id-1]} a R$ ${resposta} cada.`
                        let valorTotal = somarItemCompras()
                        total.innerText = `O total é R$ ${valorTotal}`    
                    }
                }
           }
           else {
            if (resposta == 'APAGAR' || resposta == 'apagar') {
                quantidades[id-1] = 0
                document.querySelector("#lista ol").removeChild(itemEdit)
                document.querySelector("#lista ol").removeChild(btnItem)
                let valorTotal = somarItemCompras()
                total.innerText = `O total é R$ ${valorTotal}`   
            }
           }
        }

        function addItemCompras(){
            if (produto.value != '' && quantidade.value >= 1 && preco.value > 0){
                produtos.push(produto.value)
                quantidades.push(Number(quantidade.value))
                precos.push(Number(preco.value))
                const item = document.createElement('li')
                item.textContent = `${quantidade.value} ${produto.value} a R$ ${preco.value} cada.`
                item.id = `item${contador}`
                const btnEdit = document.createElement('button')
                btnEdit.textContent = `🔄`
                btnEdit.id = `${contador}`
                btnEdit.onclick = function() {
                    editarItemCompras(btnEdit.id);
                };
                document.querySelector("#lista ol").appendChild(item)
                document.querySelector("#lista ol").appendChild(btnEdit)
                let valorTotal = somarItemCompras()
                total.innerText = `O total é R$ ${valorTotal}`
                produto.value = ''
                quantidade.value = ''
                preco.value = ''
                produto.focus
                contador ++
            }
            else {
                alert("[ERRO] informe os dados do item.")
            }
        }