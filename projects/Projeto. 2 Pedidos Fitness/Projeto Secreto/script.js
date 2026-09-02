var radio = document.querySelector('.manual-btn')
var cont = 1

document.getElementById('radio1').checked = true        // Informo que o radio1 ou input1 esta checado(checked) vai estar marcado de inicio

setInterval(() => {                                    // Crio uma arrow function que vai chamar outra function proximaImg()
    proximaImg()
}, 5000)                                // Estou chamando a função que criei proximaImg() e defino que ela vai ser chamada em um intervalo(setInterval) de 5 segs (5000)

function proximaImg(){
    cont++                                           // Cada vez que a função for chamada o cont ganha +1

    if(cont > 3){ //Se o cont for maior(>) que 3 o contador volta a ser 1
        cont = 1
    }

    document.getElementById('radio'+cont).checked = true // O valor do cont se junta ao valor do radio isso faz o radio se movimentar automaticamente
}





// Menu Mobile

const janela = document.querySelector('.menuMobile')
const botao = document.querySelector('.mobileMenuIcon')
let isVisible = false



 botao.addEventListener('click', () => {
    if(isVisible){
    janela.style.display = 'none';
    isVisible = false
} else {
     janela.style.display = 'block';
     isVisible = true
}  
    });



    // Close
        document.getElementById('xzinho').addEventListener('click', function close(){
            document.getElementById('entreContato').style.display = 'none';
            document.getElementById('xzinho').style.display = 'none';
        })


  //Blink no title

let tit = document.getElementById('tituloPersonalizado')
let alerta = false
const frase1 = 'Fit Club'
const frase2 = 'Hey! Continue sua compra no nosso site!'

let intervalo = setInterval(function(){
        tit.innerHTML = alerta ? frase1 : frase2
        alerta = !alerta
    }, 2000);



  


 

