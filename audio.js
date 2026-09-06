// audio.js - Gerenciador Global de Áudio

/* ==========================================================================
   GERENCIAMENTO GLOBAL DE ÁUDIO E NAVEGAÇÃO
   ========================================================================== */
const sndIntro = new Audio("intro/intro music.mp3");
const sndHug = new Audio("intro/hug activation.mp3");
const sndDigital = new Audio("intro/digital button.mp3");

sndIntro.loop = true;
sndIntro.preload = "auto";

// Recupera estados salvos no sessionStorage e localStorage
const tempoSalvo = parseFloat(localStorage.getItem("portfolio_audio_tempo") || sessionStorage.getItem("audio_time") || "0");
const estadoSalvo = localStorage.getItem("portfolio_audio_estado");
const estadoMuted = sessionStorage.getItem("audio_muted") === "true";

if (tempoSalvo && !isNaN(tempoSalvo)) {
    sndIntro.currentTime = tempoSalvo;
}
sndIntro.muted = estadoMuted;

// Salva o tempo de reprodução em tempo real
sndIntro.addEventListener("timeupdate", () => {
    sessionStorage.setItem("audio_time", sndIntro.currentTime);
    localStorage.setItem("portfolio_audio_tempo", sndIntro.currentTime.toString());
});

// Execução imediata: Oculta a intro antes da renderização se já foi vista na sessão
if (!deveExibirLoader()) {
    document.documentElement.classList.add("no-intro");
}

document.addEventListener("DOMContentLoaded", () => {


    // 1. CAMINHO DO SEU ARQUIVO DE ÁUDIO
    const CAMINHO_AUDIO = "intro/intro music.mp3";

    // Usa a instância global do áudio em vez de criar uma segunda tag de áudio no DOM
    const audio = sndIntro;

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
                    sessionStorage.setItem("audio_started", "true");
                    atualizarUI(true);
                });
            } else {
                audio.pause();
                localStorage.setItem("portfolio_audio_estado", "off");
                sessionStorage.setItem("audio_started", "false");
                atualizarUI(false);
            }
        });
    }

    // Salva o tempo atual continuamente a cada meio segundo
    setInterval(() => {
        if (!audio.paused) {
            localStorage.setItem("portfolio_audio_tempo", audio.currentTime.toString());
            sessionStorage.setItem("audio_time", audio.currentTime.toString());
        }
    }, 500);

    // Salva o tempo ao mudar/fechar a página
    window.addEventListener("beforeunload", () => {
        if (!audio.paused) {
            localStorage.setItem("portfolio_audio_tempo", audio.currentTime.toString());
            sessionStorage.setItem("audio_time", audio.currentTime.toString());
        }
    });
});

// Verifica se a intro/loader deve ser exibido
function deveExibirLoader() {
    // Se recarregou a página via F5, limpa a flag para exibir a intro novamente
    const navegacao = performance.getEntriesByType("navigation")[0];
    if (navegacao && navegacao.type === "reload") {
        sessionStorage.removeItem("intro_visualizada");
        return true;
    }

    // Se já passou pela intro nesta mesma sessão de navegação, NÃO exibe novamente[cite: 1]
    const jaViuIntro = sessionStorage.getItem("intro_visualizada") === "true";
    if (jaViuIntro) {
        return false;
    }

    // Se veio de dentro do próprio site (navegação entre páginas)[cite: 1]
    const paginaAnterior = document.referrer;
    const mesmoDominio = window.location.origin;

    if (paginaAnterior && paginaAnterior.startsWith(mesmoDominio)) {
        
        // --- CORREÇÃO VERCEL ---
        // Verifica se a página anterior tem exatamente o mesmo caminho da página atual.
        // Se for o caso, foi apenas um redirecionamento de infraestrutura (como HTTP para HTTPS).
        try {
            const urlAtual = window.location.pathname;
            const urlReferrer = new URL(paginaAnterior).pathname;
            
            if (urlAtual === urlReferrer) {
                return true; // É um redirecionamento, portanto, exibe a intro.
            }
        } catch (e) {
            console.error("Erro ao analisar a URL do referrer:", e);
        }
        // -----------------------

        return false; // Navegação interna real, não exibe a intro.
    }

    return true; // Acesso inicial/primeira entrada no site[cite: 1]
}