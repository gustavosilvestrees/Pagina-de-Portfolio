// resizer.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".cyber-frame-container");

    // Garante que o script só corre se o container existir na página (evita erros em outras páginas)
    if (!container) return;

    let startY, startHeight;

    // Configuração correspondente ao CSS (espessura da área arrastável e insets)
    const resizerHeight = 15; // px (mesma altura do ::after no CSS)
    const resizerOffset = 20; // px (mesmo left/right do ::after no CSS)

    // Handler para o clique do mouse no container
    container.addEventListener("mousedown", (e) => {
        // Calcula a posição relativa do clique dentro do container
        const rect = container.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const relativeX = e.clientX - rect.left;

        // Verifica se o clique ocorreu dentro da faixa arrastável na borda inferior definida no CSS
        const isInsideBottomDraggableStrip =
            relativeY > (rect.height - resizerHeight) && // Clicou na faixa inferior
            relativeX > resizerOffset && // Não clicou no chanfro esquerdo
            relativeX < (rect.width - resizerOffset); // Não clicou no chanfro direito

        if (isInsideBottomDraggableStrip) {
            e.preventDefault(); // Previne seleção de texto indesejada durante o arrasto
            startY = e.clientY;
            startHeight = container.offsetHeight; // Altura atual do container

            // Adiciona listeners globais no document para um arrasto suave (mesmo se o mouse sair do container)
            document.addEventListener("mousemove", doDrag);
            document.addEventListener("mouseup", stopDrag);
        }
    });

    // Função que executa o redimensionamento durante o movimento do mouse
    function doDrag(e) {
        const dy = e.clientY - startY; // Diferença de movimento do mouse
        const newHeight = startHeight + dy;

        // Aplica limites de altura definidos no CSS (min-height e max-height)
        // Hardcoded aqui para consistência visual imediata, mas o navegador também imporia
        const minH = 300; // px
        const maxH = 1150; // px (tamanho completo do PDF)

        if (newHeight >= minH && newHeight <= maxH) {
            // Atualiza a altura do container EXTERNO.
            // O iframe (que tem altura fixa de 1150px) rolará dentro dele.
            container.style.height = newHeight + "px";
        }
    }

    // Função que finaliza o redimensionamento ao soltar o mouse
    function stopDrag(e) {
        // Remove os listeners globais para limpar a memória
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
    }
});