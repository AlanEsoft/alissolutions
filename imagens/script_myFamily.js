// --------------- Arrays de inicialização e armazenamento dos objetos ---------------------
let arrayDeObjetos = [];
let arrayPeople = [];
let arrayShoppingList = [];
let arrayItemList = [];
let arraySequenceList = [];
let idListSearch;
// -----------------------------------------------------------------------------------------

// -------------------- Variáveis da Lista de Compras --------------------------------------
let produto = document.getElementById("produto")
let quantidade = document.getElementById("quantidade")
let preco = document.getElementById("preco")
let lista = document.getElementById("lista")
let total = document.getElementById("total")
let produtos = []
let quantidades = []
let precos = []
let contador = 1
//------------------------------------------------------------------------------------------

// ------------------------------- Métodos Gerais ------------------------------------------

// ---------------------- Cria objetos JSON apartir do txt informado -----------------------
function criarObjetosJSON(conteudo) {  
    const linhas = conteudo.split(';');
    const array = [];

    linhas.forEach(linha => {
        const linhaTrimmed = linha.trim();
        if (linhaTrimmed !== '') {
            try {
                const objetoJSON = JSON.parse(linhaTrimmed);
                if (objetoJSON.tipo === "PESSOA" || objetoJSON.tipo === "pessoa"){
                    arrayPeople.push(objetoJSON);
                } else if (objetoJSON.tipo === "itemCompras" || objetoJSON.tipo === "ItemCompras"){
                    arrayItemList.push(objetoJSON);
                } else if (objetoJSON.tipo === "listaCompras" || objetoJSON.tipo === "ListaCompras"){
                    arrayShoppingList.push(objetoJSON);
                } else if (objetoJSON.tipo === 'id_list'){
                    arraySequenceList.push(objetoJSON);
                }
                array.push(objetoJSON);
            } catch (erro) {
                console.error('Erro ao analisar JSON:', erro, 'na linha:', linhaTrimmed);
            }
        }
    });

    return array;
}

// ---------------------------- Torna a DIV da Lista de Compras visível ---------------------------
function listaComprasOpen() { 
    const menuDiv = document.getElementById('menu');
    const ListaComprasDiv = document.getElementById('divListaCompras');
    const listDate = document.getElementById("listDate");
    const opListDate = document.createElement("option");
    let agora = new Date();
    let itemData = agora.getDate()+"/"+(agora.getMonth()+1)+"/"+agora.getFullYear();
    listDate.innerHTML = '';
    opListDate.value = Number(arraySequenceList[0].id)+1;
    opListDate.textContent = itemData;
    opListDate.id = 'opListDate';
    listDate.appendChild(opListDate);
    idListSearch = Number(arraySequenceList[0].id)+1;
    arrayShoppingList.forEach(item => {
        // Cria um novo elemento <option>
        const option = document.createElement("option");

        // Define o texto da opção combinando id_list e listDate
        option.textContent = `${item.id_list} - ${item.listDate}`;

        // Define o valor da opção com o id_list
        option.value = item.id_list;

        // Adiciona a opção ao elemento <select>
        listDate.appendChild(option);
    });
    document.querySelector("#lista ol").innerHTML= '';
    menuDiv.style.display = 'none';
    total.innerText = '';
    ListaComprasDiv.style.display = 'block';  
}

// ------------------------ Ler o arquivo txt e valida o login do usuário -------------------------
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

            const usuarioAutenticado = arrayPeople.some(usuario =>
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

// -------------------- Captura o username e password e chama o lerArquivo -------------------
function autenticar() { 
    const nome = document.getElementById('idNome').value;
    const senha = document.getElementById('idSenha').value;
    lerArquivo(nome, senha); // Passa nome e senha para lerArquivo
}

// ---------------------------- Salvando os objetos JSON em arquivo txt ----------------------
function salvarArraysEmTXT() {
  const todosObjetos = [
    ...arrayPeople,
    ...arrayShoppingList,
    ...arrayItemList,
    ...arraySequenceList
  ];

  // Transforma cada objeto em uma string JSON e junta com ";"
  const linhaUnica = todosObjetos.map(objeto => JSON.stringify(objeto)).join(";");

  // Para executar no navegador e iniciar o download do arquivo:
  const blob = new Blob([linhaUnica], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'dados_arrays.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------------------------------- Retorna para o Menu ------------------------------------
function menuOpen() {
    const menu = document.getElementById("menu")
    const listaCompras = document.getElementById("divListaCompras")
    menu.style.display= "block"
    listaCompras.style.display = "none"
}

// ----------------------------- Métodos - Lista de Compras ----------------------------------

//------------------------------ Soma o precos dos produtos ----------------------------------
function somarItemCompras(){ 
    let soma = 0
    for (let i = 0; i < precos.length; i++) {
        soma += quantidades[i]*precos[i]
    }
    return soma
}

// -------------------------- Corrige ou apaga um item da lista -----------------------------
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
            for (let i=0; i<arrayItemList.length; i++){
                if (arrayItemList[i].contador == id & arrayItemList[i].id_list == idListSearch) {
                    arrayItemList[i].quantidade = resposta;
                }
            }
            let valorTotal = somarItemCompras()
            total.innerText = `O total é R$ ${valorTotal}`
        }
        else {
            if (resposta == 'PREÇO' || resposta == 'preço') {
                resposta = Number(window.prompt('Digite o preço atualizado:', '1,0'))
                precos[id-1] = resposta
                itemEdit.textContent = `${quantidades[id-1]} ${produtos[id-1]} a R$ ${resposta} cada.`
                for (let i=0; i<arrayItemList.length; i++){
                if (arrayItemList[i].contador == id & arrayItemList[i].id_list == idListSearch) {
                    arrayItemList[i].preco = resposta;
                }
            }
                let valorTotal = somarItemCompras()
                total.innerText = `O total é R$ ${valorTotal}`    
            }
        }
    }
    else {
        if (resposta == 'APAGAR' || resposta == 'apagar') {
            for (let i=0; i<arrayItemList.length; i++){
                if (arrayItemList[i].contador == id & arrayItemList[i].id_list == idListSearch) {
                    arrayItemList.splice(i, 1);
                }
            }
            quantidades[id-1] = 0
            document.querySelector("#lista ol").removeChild(itemEdit)
            document.querySelector("#lista ol").removeChild(btnItem)
            let valorTotal = somarItemCompras()
            total.innerText = `O total é R$ ${valorTotal}`   
        }
    }
}

// ------------------------- Adiciona um item na lista -------------------------------------
function addItemCompras(){
    if (produto.value != '' && quantidade.value >= 1 && preco.value > 0){
        produtos.push(produto.value)
        quantidades.push(Number(quantidade.value))
        precos.push(Number(preco.value))
        const item = document.createElement('li')
        item.textContent = `${quantidade.value} ${produto.value} a R$ ${preco.value}.`
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
        let agora = new Date();
        let itemData = agora.getDate()+"/"+(agora.getMonth()+1)+"/"+agora.getFullYear();
        const JSONString = `{"tipo": "itemCompras", "id_list": "${Number(arraySequenceList[0].id)+1}", "itemData": "${itemData}", "contador": "${contador}", "produto": "${produto.value}", "quantidade": "${quantidade.value}", "preco": "${preco.value}"}`;
        const JSONObject = JSON.parse(JSONString);
        arrayItemList.push(JSONObject);
        arrayDeObjetos.push(JSONObject);
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

// -------------------------- Consulta a Lista pelo selection -----------------------------
function listSearch(){
    const selectListDate = document.getElementById("listDate").value;
    produtos = [];
    quantidades = [];
    precos = [];
    for (let i=0; i< arrayItemList.length; i++){
        if (arrayItemList[i].id_list == selectListDate){
            produtos.push(arrayItemList[i].produto)
            quantidades.push(arrayItemList[i].quantidade)
            precos.push(arrayItemList[i].preco)
            const item = document.createElement('li')
            item.textContent = `${arrayItemList[i].quantidade} ${arrayItemList[i].produto} a R$ ${arrayItemList[i].preco}.`
            item.id = `item${arrayItemList[i].contador}`
            const btnEdit = document.createElement('button')
            btnEdit.textContent = `🔄`
            btnEdit.id = `${arrayItemList[i].contador}`
            btnEdit.onclick = function() {
                editarItemCompras(btnEdit.id);
            };
            document.querySelector("#lista ol").appendChild(item)
            document.querySelector("#lista ol").appendChild(btnEdit)
            let valorTotal = somarItemCompras()
            total.innerText = `O total é R$ ${valorTotal}`
        }
    }
    idListSearch = selectListDate;    
    const botaoAdicionar = divEntradas.querySelector("button");
    if (botaoAdicionar) {
    botaoAdicionar.style.display = "none";
    }
}

// ----------------------------- Salva a nova lista -----------------------------------
function saveList() {
    const hoje = document.getElementById("opListDate");
    const shoppingList = `{"tipo":"listaCompras","id_list":"${idListSearch}","listDate":"${hoje.textContent}"}`;
    let objectShoppingList = JSON.parse(shoppingList);
    arrayShoppingList.push(objectShoppingList);
    arraySequenceList[0].id = idListSearch;
    menuOpen();
}

// ---------------------------- Apagar a lista selecionada -----------------------------
function apagarList() {
    for (let i=0; i<arrayItemList.length; i++){
        if (arrayItemList[i].id_list == idListSearch) {
            arrayItemList.splice(i, 1);
        }
    }
    for (let i=0; i<arrayShoppingList.length; i++){
        if (arrayShoppingList[i].id_list == idListSearch) {
            arrayShoppingList.splice(i, 1);
        }
    }
    menuOpen();
}
