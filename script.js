/* ==========================================================================
   1. INICIALIZAÇÃO DE SERVIÇOS EXTERNOS
   ========================================================================== */
if (typeof emailjs !== "undefined") {
    emailjs.init("zvD98zpT2NV74vd5d");
}



/* ==========================================================================
   3. GERENCIADOR DOM PRINCIPAL
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // ---- ELEMENTOS DA INTERFACE ----
    const loader = document.getElementById("cyber-loader");
    const videoBg = document.getElementById("loader-bg-video");
    const loaderBar = document.getElementById("loader-bar");
    const loaderPercentage = document.getElementById("loader-percentage");
    const welcomeMsg = document.getElementById("welcome-message");
    const clickPrompt = document.getElementById("click-prompt");

    const btnAudio = document.getElementById("audio-toggle");
    const audioIcon = document.getElementById("audio-icon");
    const audioText = document.getElementById("audio-text");

    // Sincroniza o visual do botão com o estado real do áudio
    function sincronizarBotaoSom() {
    if (!btnAudio) return;

    const estaDesligado = sndIntro.muted || sndIntro.paused;

    if (estaDesligado) {
        btnAudio.classList.add("muted");
        btnAudio.classList.remove("playing"); // Adicionado: Remove o playing para ativar o CSS vermelho
        
        if (audioIcon) {
            audioIcon.className = "fas fa-volume-mute"; // Adicionado: Muda a classe do FontAwesome
        }
        if (audioText) audioText.textContent = "SOM OFF";
    } else {
        btnAudio.classList.remove("muted");
        btnAudio.classList.add("playing"); // Adicionado: Adiciona o playing para o botão ficar azul
        
        if (audioIcon) {
            audioIcon.className = "fas fa-volume-up"; // Adicionado: Muda a classe do FontAwesome
        }
        if (audioText) audioText.textContent = "SOM ON";
    }
}

    // Ouve eventos de play/pause nativos do som para impedir inconsistência visual
    sndIntro.addEventListener("play", sincronizarBotaoSom);
    sndIntro.addEventListener("pause", sincronizarBotaoSom);

    // Clique no Botão Neon de Som
    if (btnAudio) {
        btnAudio.addEventListener("click", (e) => {
            e.stopPropagation();

            if (sndIntro.paused) {
                sndIntro.muted = false;
                sndIntro.play().then(() => {
                    sessionStorage.setItem("audio_started", "true");
                    sessionStorage.setItem("audio_muted", "false");
                    sincronizarBotaoSom();
                }).catch(err => console.log("Erro ao reproduzir:", err));
            } else {
                sndIntro.muted = !sndIntro.muted;
                sessionStorage.setItem("audio_muted", sndIntro.muted);
                sincronizarBotaoSom();
            }
        });
    }

    // ---- GERENCIAMENTO DE CARREGAMENTO E MÚSICA ----
    const precisaLoader = deveExibirLoader();

    if (loader && precisaLoader) {

document.body.classList.add("travado"); // NOVO: Trava o scroll aqui!
        
        // CASO 1: Primeiro Acesso ou F5 (Exibe loader e aguarda clique na tela)
       const iniciarComClique = () => {
            sessionStorage.setItem("intro_visualizada", "true"); // <-- ADICIONE ESTA LINHA AQUI
            sessionStorage.setItem("audio_started", "true");
            sessionStorage.setItem("audio_muted", "false");
            sndIntro.muted = false;

            sndHug.play().catch(() => {});
            sndIntro.play().then(() => sincronizarBotaoSom()).catch(() => {});

            if (clickPrompt) {
                clickPrompt.style.opacity = "0";
                setTimeout(() => clickPrompt.remove(), 400);
            }

            iniciarSequenciaCarregamento();
        };

        window.addEventListener("pointerdown", iniciarComClique, { once: true });
    } else {
        // CASO 2: Navegação Interna (meupdf, evencert ou volta ao index)
        if (loader) loader.style.display = "none"; // Oculta o loader se existir
        // ---> ADICIONE ESTA LINHA AQUI PARA LIBERAR O SCROLL: <---
        document.body.classList.remove("travado");
        
        // Exibe o botão de som com animação nas páginas sem loader
        if (btnAudio) btnAudio.classList.add("audio-btn-show");

        if (audioIniciado && !estadoMuted) {
            sndIntro.play().then(() => {
                sincronizarBotaoSom();
            }).catch(() => {
                sincronizarBotaoSom();
            });
        } else {
            sincronizarBotaoSom();
        }
    }

    // Função de animação da barra do Loader
    async function iniciarSequenciaCarregamento() {
        if (videoBg) {
            videoBg.play().catch(() => {});
            videoBg.classList.add("fade-in");
        }

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 3;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                finalizarCarregamento();
            }
            if (loaderBar) loaderBar.style.width = `${progress}%`;
            if (loaderPercentage) loaderPercentage.textContent = `${progress}%`;
        }, 120);
    }

    function finalizarCarregamento() {
        sndDigital.play().catch(() => {});

        if (loaderPercentage) loaderPercentage.style.display = "none";
        if (welcomeMsg) welcomeMsg.classList.add("show");

        setTimeout(() => {
            if (videoBg) {
                videoBg.classList.remove("fade-in");
                videoBg.classList.add("fade-out");
            }
            if (loader) loader.classList.add("fade-out-complete");

            setTimeout(() => {
                if (loader) loader.style.display = "none";

                document.body.classList.remove("travado"); // NOVO: Libera o scroll aqui!
                // EXIBE O BOTÃO COM ANIMAÇÃO NEON DE ENTRADA ASSIM QUE O LOADER SUMIR
                if (btnAudio) btnAudio.classList.add("audio-btn-show");
            }, 500);
        }, 2200);
    }

    /* ==========================================================================
       4. VÍDEO DA ABA PROJECTS
       ========================================================================== */
    const videoProjects = document.querySelector(".videoProjects");
    if (videoProjects) {
        videoProjects.play().catch(() => {});
        videoProjects.addEventListener("ended", () => {
            videoProjects.currentTime = 0;
            videoProjects.play().catch(() => {});
        });
    }

    /* ==========================================================================
       5. FORMULÁRIO DE CONTATO
       ========================================================================== */
     const formulario = document.getElementById("meuFormulario");
    const inputAnexo = document.getElementById("arquivo-anexo");
    const textoAnexo = document.getElementById("texto-anexo");
    const inputLinkOculto = document.getElementById("link_do_anexo");
    const btnEnviar = document.getElementById("btnEnviar");
    const msgSucesso = document.getElementById("mensagemSucesso");

    // Garantir que o script só corre se o formulário existir na página
    if (!formulario) return;

    // LÓGICA 1: Monitorizar o ficheiro e fazer upload via tmpfiles.org (Livre de CORS local)
    inputAnexo.addEventListener("change", async (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        textoAnexo.textContent = "PROCESSANDO ARQUIVO...";
        textoAnexo.style.color = "#00ffff"; 

        const formDataAnexo = new FormData();
        formDataAnexo.append("file", arquivo);

        try {
            // Faz o upload para uma API que não bloqueia o teu Live Server local
            const respostaUpload = await fetch("https://tmpfiles.org/api/v1/upload", {
                method: "POST",
                body: formDataAnexo
            });
            
            if (!respostaUpload.ok) throw new Error();
            
            const resultado = await respostaUpload.json();

            // Guarda o link web do arquivo gerado no input invisible
            if (resultado.data && resultado.data.url) {
                inputLinkOculto.value = resultado.data.url;
                textoAnexo.textContent = `✔ ${arquivo.name} PRONTO!`;
                textoAnexo.style.color = "#22c55e"; // Verde de sucesso
            } else {
                throw new Error();
            }
        } catch (erro) {
            console.error("Erro no upload:", erro);
            textoAnexo.textContent = "Erro ao processar anexo. Tente outro.";
            textoAnexo.style.color = "#ef4444";
            inputAnexo.value = ""; 
            inputLinkOculto.value = "";
        }
    });

    // LÓGICA 2: Envio via EmailJS
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        // Proteção: Desabilita o botão para evitar múltiplos envios
        if (btnEnviar) {
            btnEnviar.disabled = true;
            btnEnviar.textContent = "TRANSMITINDO DADOS...";
        }

        // Substitua "YOUR_SERVICE_ID" e "YOUR_TEMPLATE_ID" pelas suas chaves do EmailJS
        emailjs.sendForm('service_49rjqdm', 'template_1e0r226', formulario)
            .then(() => {
                // SUCESSO: Apaga tudo instantaneamente
                formulario.reset();
                if (inputLinkOculto) inputLinkOculto.value = "";
                if (textoAnexo) {
                    textoAnexo.textContent = "Anexar imagem ou arquivo";
                    textoAnexo.style.color = "#ff77ff";
                }

                // Alerta HUD de sucesso na tela
                if (msgSucesso) {
                    msgSucesso.style.display = "block";
                    setTimeout(() => { msgSucesso.style.display = "none"; }, 6000);
                }
            }, (erro) => {
                // ERRO
                console.error("Erro ao enviar email:", erro);
                alert("Erro de rede ou falha no EmailJS. Verifique o console.");
            })
            .finally(() => {
                // Restaura o botão
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.innerHTML = "<span>ENVIAR TRANSMISSÃO</span>";
                }
            });
    });
});


