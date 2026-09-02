const searchInput = document.getElementById('search');
const icon = document.querySelector('.input-icon');
let linkTag = document.querySelector('#linkIcon');
let webLink;


searchInput.onkeyup = (P) =>{
    let userData = P.target.value;
    let emptyArray = [];
    let Resultado;

    if(P.key === 'Enter'){
        if(userData){ //Verifica se o userData esta vazio
            window.open(`/site/pesquisaResult.html`, '_blank'); //Se estiver vazio(true) e for apertado a tecla Enter ele redireciona para a pagina de resultados

        }
    }

    if(userData){
        icon.onclick = () =>{ //Se estiver vazio e for clicado o icone de pesquisa redireciona para a pagina de resultados
            webLink = `/site/pesquisaResult.html`
            linkTag.setAttribute('href' , webLink);
            linkTag.click();
        }
    }
    
}

searchInput.addEventListener('input', (event) =>{
    const value = formatString(event.target.value);
    const item1 = document.querySelectorAll('.spanPrincipal , .legendaCarVer .containerGenerico3 , .legendaCarHor .containerGenerico2 , .listan , #xp, .lip .linkpod, #nprincipalgamer #pGamer, .feed_direito .textofeed');


    item1.forEach(item => {
        if(formatString(item.textContent).indexOf(value) !== -1){
            item.style.display = ''
        } else {
            
        }
    });
    

} )

function formatString(value){
    return value
    .toLowerCase()
    .trim();
}

/*  

PROXIMOS PASSOS:

1. Fazer a barra reconhecer os titulos das divs = Feito
2. Fazer a barra pegar esses dados e levar eles a outra pagina que tera os resultados



*/