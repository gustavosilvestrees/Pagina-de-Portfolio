// audio.js - Gerenciador Global de Áudio
document.addEventListener("DOMContentLoaded", () => {
    // 1. CAMINHO DO SEU ARQUIVO DE ÁUDIO (Ajuste aqui o caminho correto)
    const CAMINHO_AUDIO = "intro/intro music.mp3";

    

    // 2. Criação automática do elemento de áudio
    let audio = document.getElementById("global-bg-audio");
    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "global-bg-audio";
        audio.src = CAMINHO_AUDIO;
        audio.loop = true;
        document.body.appendChild(audio);
    }

    const toggleBtn = document.getElementById("audio-toggle");
    const audioIcon = document.getElementById("audio-icon");
    const audioText = document.getElementById("audio-text");

    // Atualiza a aparência do botão
    function atualizarUI(estaTocando) {
    if (!toggleBtn) return;
    if (estaTocando) {
        if (audioIcon) audioIcon.className = "fas fa-volume-up"; // Altera a classe do Font Awesome
        toggleBtn.classList.add("playing");
    } else {
        if (audioIcon) audioIcon.className = "fas fa-volume-mute"; // Altera a classe do Font Awesome
        toggleBtn.classList.remove("playing");
    }
}

    // Recupe o estado salvo no navegador
    const estadoSalvo = localStorage.getItem("portfolio_audio_estado"); // 'on' ou 'off'
    const tempoSalvo = parseFloat(localStorage.getItem("portfolio_audio_tempo") || "0");

    if (tempoSalvo && !isNaN(tempoSalvo)) {
        audio.currentTime = tempoSalvo;
    }

    // Toca automaticamente se o usuário já tiver deixado ativado
    if (estadoSalvo === "on") {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                atualizarUI(true);
            }).catch(() => {
                // Se o navegador bloquear o autoplay, aguarda o primeiro clique na tela
                atualizarUI(false);
                const ativarNoClique = () => {
                    if (localStorage.getItem("portfolio_audio_estado") === "on") {
                        audio.play().then(() => atualizarUI(true));
                    }
                    window.removeEventListener("click", ativarNoClique);
                };
                window.addEventListener("click", ativarNoClique);
            });
        }
    } else {
        atualizarUI(false);
    }

    // Clique no botão de alternar som
    if (toggleBtn) {
        toggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (audio.paused) {
                audio.play().then(() => {
                    localStorage.setItem("portfolio_audio_estado", "on");
                    atualizarUI(true);
                });
            } else {
                audio.pause();
                localStorage.setItem("portfolio_audio_estado", "off");
                atualizarUI(false);
            }
        });
    }

    // Salva o tempo atual continuamente a cada meio segundo
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem("portfolio_audio_tempo", audio.currentTime.toString());
        }
    }, 500);

    // Salva o tempo ao mudar/fechar a página
    window.addEventListener("beforeunload", () => {
        if (!audio.paused) {
            localStorage.setItem("portfolio_audio_tempo", audio.currentTime.toString());
        }
    });
});

/* ==========================================================================
   2. GERENCIAMENTO GLOBAL DE ÁUDIO E NAVEGAÇÃO
   ========================================================================== */
const sndIntro = new Audio("intro/intro music.mp3");
const sndHug = new Audio("intro/hug activation.mp3");
const sndDigital = new Audio("intro/digital button.mp3");

sndIntro.loop = true;
sndIntro.preload = "auto";

// Recupera estados salvos no sessionStorage
const tempoSalvo = sessionStorage.getItem("audio_time");
const estadoMuted = sessionStorage.getItem("audio_muted") === "true";
const audioIniciado = sessionStorage.getItem("audio_started") === "true";

if (tempoSalvo) {
    sndIntro.currentTime = parseFloat(tempoSalvo);
}
sndIntro.muted = estadoMuted;

// Salva o tempo de reprodução em tempo real
sndIntro.addEventListener("timeupdate", () => {
    sessionStorage.setItem("audio_time", sndIntro.currentTime);
});

// Verifica se veio de recarregamento (F5) ou navegação entre páginas
function deveExibirLoader() {
    const navegacao = performance.getEntriesByType("navigation")[0];
    if (navegacao && navegacao.type === "reload") return true;

    const paginaAnterior = document.referrer;
    const mesmoDominio = window.location.origin;

    if (paginaAnterior && paginaAnterior.startsWith(mesmoDominio)) {
        return false; // Veio de dentro do site
    }
    return true; // Acesso direto ou vindo de site externo
}