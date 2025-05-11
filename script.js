const imagensDesktop = ['imagens/data_analytics.png', 'imagens/computer_class.png', 'imagens/courses.png', 'imagens/computer_mainetence.png', 'imagens/computer_network.png'];
const imagensMobile = ['imagens/data_analytics304.png', 'imagens/computer_class304.png', 'imagens/courses304.png', 'imagens/computer_mainetence304.png', 'imagens/computer_network304.png'];
const titulos = ['ANÁLISE DE DADOS E ENGENHARIA DE SOLUÇÕES', 'TREINAMENTO EM INFORMÁTICA', 'CURSOS E TREINAMENTOS EM GERAL', 'MANUTENÇÃO DE COMPUTADORES', 'INSTALAÇÃO E MANUTENÇÃO DE REDES DE COMPUTADORES'];
const descricoes = ['Análise dos processos e edição de documentos, cadastros, banco de dados, planilhas, softwares entre outras ferramentas para aumentar lucros e reduzir custos.', 'Instrução nas principais ferramentas para que seus colaboradores desempenhem suas funções com eficiência.', 'Ministração de aulas em diversas áreas do conhecimento visando capacitá-lo para qualquer desafio. Desde reforço escolar a Business Inteligence.', 'Reparo e manutenção de computadores e periféricos com possibilidade de disponibilidade 24/7.', 'Instalação e manutenção de redes de computadores e IoT (Dispositivos em geral),'];
const botoes = document.querySelectorAll('.btn');
const titulo = document.querySelector('.titulo');
const descricao = document.querySelector('.descricao');
const picture = document.querySelector('.imgServices');
const img = picture.querySelector('img');
const sources = picture.querySelectorAll('source');

let indice = 0;
let timer;

function trocarImagem() {
    const imagens = window.innerWidth < 768 ? imagensMobile : imagensDesktop;
    sources[0].srcset = imagens[indice];
    sources[1].srcset = imagens[indice];
    img.src = imagens[indice];
    titulo.textContent = titulos[indice];
    descricao.textContent = descricoes[indice];
    atualizarBotoes();
    indice = (indice + 1) % imagens.length;
}

function atualizarBotoes() {
    botoes.forEach((botao, i) => {
        if (i === indice) {
            botao.style.backgroundColor = 'blue';
            botao.style.color = 'white';
        } else {
            botao.style.backgroundColor = 'white';
            botao.style.color = 'black';
        }
    });
}

function pausar() {
    clearInterval(timer);
}

function iniciar() {
    timer = setInterval(trocarImagem, 5000);
}

botoes.forEach((botao, i) => {
    botao.dataset.index = i;
    botao.addEventListener('click', () => {
        indice = parseInt(botao.dataset.index);
        trocarImagem();
        pausar();
        setTimeout(iniciar, 30000);
    });
});

/*function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

window.onload = function() {
    if (isMobile()) {
        var imagelogo = document.getElementsByClassName('imglogo');
        for (var i = 0; i < imagelogo.length; i++) {
            imagelogo[i].src = 'imagens/LogoALIS_Tec90.png';
        }
    }
    
};*/
    iniciar();
    atualizarBotoes();