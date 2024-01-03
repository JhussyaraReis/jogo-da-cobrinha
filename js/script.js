const canvas  = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const audioPonto = new Audio('../assets/audio.mp3');
const audioErro = new Audio('../assets/erro.mp3');
const musica = new Audio('../assets/gamesong.mp3');

const pontos = document.querySelector('.valor-pontos');
const pontuacao = document.querySelector('.pontuacao-final > span');
const menu = document.querySelector('.menu-fim');
const btn = document.querySelector('.btn-play');

const tamanho = 30;
const posicaoInicial =  {x:0,y:0};
let cobra = [posicaoInicial];


let direcao,loopId   

const contaPontos = () =>{
    pontos.innerText = Number(pontos.innerText) + 10;
}

const numeroAleatorio = (min,max) =>{
    return Math.round(Math.random()*(max-min)+min);
}

const posicaoAleatoria = () =>{
    const numero = numeroAleatorio(0,canvas.width - tamanho);
    return Math.round(numero/30)*30;
}

const corAleatoria = () =>{
    const red = numeroAleatorio(0,255);
    const green = numeroAleatorio(0,255);
    const blue = numeroAleatorio(0,255);

    return `rgb(${red},${green},${blue})`
}

const comida ={
    x:posicaoAleatoria(),
    y:posicaoAleatoria(),
    cor: corAleatoria()
}

const desenharComida = () =>{
    const {x,y,cor} = comida; //destruturing o objeto comida e criando as variaveis x, y e cor

    ctx.shadowColor = cor;
    ctx.shadowBlur = 6;
    ctx.fillStyle = cor;
    ctx.fillRect(x,y,tamanho,tamanho)
    ctx.shadowBlur = 0;
}

const desenharCobra = () => {
    ctx.fillStyle = '#ddd';
    
    cobra.forEach((posicao,index)=>{
        if(index == cobra.length - 1){
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(posicao.x, posicao.y ,tamanho ,tamanho);
    })
}

const moverCobra = () =>{
    if (!direcao) return

    const cabeca = cobra[cobra.length - 1]; // pega o ultimo elemento do array. É o mesmo que cobra.length - 1

    if(direcao == "direita"){
        cobra.push({x:cabeca.x + tamanho,y:cabeca.y});
    }

    if(direcao == "esquerda"){
        cobra.push({x:cabeca.x - tamanho,y:cabeca.y});
    }

    if(direcao == "baixo"){
        cobra.push({x:cabeca.x ,y:cabeca.y + tamanho});
    }

    if(direcao == "cima"){
        cobra.push({x:cabeca.x,y:cabeca.y - tamanho});
    }

    cobra.shift();
}

const desenharGrade = () =>{
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for(let i = 30; i < canvas.width; i +=30){
        // Linha vertical - com y fixo
        ctx.beginPath();
        ctx.lineTo(i,0); //Primeiro ponto - de onde começa a linha
        ctx.lineTo(i,600);// Segundo ponto - onde termina a linha
    
        ctx.stroke(); // efetivamente desenhar a linha

        //Linha horizontal - com x fixo 
        ctx.beginPath();
        ctx.lineTo(0,i); //Primeiro ponto - de onde começa a linha
        ctx.lineTo(600,i);// Segundo ponto - onde termina a linha
    
        ctx.stroke(); // efetivamente desenhar a linha
    }

   
}

const checkComida = () => {
    const cabeca = cobra[cobra.length - 1];

    if (cabeca.x == comida.x && cabeca.y == comida.y) {
        cobra.push(cabeca);

        audioPonto.play();
        contaPontos();

        let x = posicaoAleatoria();
        let y = posicaoAleatoria();

        // conferir se a posição comida está sendo gerada fora da cobra

        while (cobra.find((posicao)=>{posicao.x == x && posicao.y == y})) {
            x = posicaoAleatoria();
            y = posicaoAleatoria();
        }

        // atualiza a posicoa e cor da comida
        comida.x = x;
        comida.y = y;
        comida.cor = corAleatoria();
    }
}

const checkColisao = () =>{
    const cabeca = cobra[cobra.length - 1];
    const limiteCanvas = 570;
    const IndexPescoco = cobra.length - 2;

    const colisaoBorda = cabeca.x < 0 || cabeca.x > limiteCanvas ||cabeca.y < 0 || cabeca.y > limiteCanvas;

    const colisaoInterna = cobra.find((posicao, index)=>{
        return index < IndexPescoco && cabeca.x == posicao.x && cabeca.y == posicao.y
    });

    if(colisaoBorda || colisaoInterna){
        audioErro.play();
        fimJogo();
    }
}

const fimJogo = () =>{
    direcao = '';
    menu.style.display = 'flex';
    pontuacao.innerText = pontos.innerText;
    cobra = [posicaoInicial]; // atualizar a posição da cobra
    canvas.style.filter = 'blur(2px)';
}

const jogoLoop = ()=>{

    clearInterval(loopId); // limpa o loop e evita que dois loops sejam iniciados ao mesmo tempo

    ctx.clearRect(0,0,600,600); // evita que a cobra seja desenhada enquanto é movida
    desenharGrade();
    desenharComida();
    moverCobra();
    desenharCobra();
    checkComida();
    checkColisao();
    loopId = setTimeout(()=>{
        jogoLoop();
    },200) // altera a velocidade da cobra
}
jogoLoop();

document.addEventListener('keydown',({key})=>{

    if(key == 'ArrowRight' && direcao != 'esquerda'){
        direcao = 'direita';
    }

    if(key == 'ArrowLeft' && direcao != 'direita'){
        direcao = 'esquerda';
    }
    if(key == 'ArrowDown' && direcao != 'cima'){
        direcao = 'baixo';
    }
    if(key == 'ArrowUp' && direcao != 'baixo'){
        direcao = 'cima';
    }
})

btn.addEventListener("click",()=>{
    pontos.innerText = '00';
    menu.style.display = 'none';
    canvas.style.filter = 'none';
})