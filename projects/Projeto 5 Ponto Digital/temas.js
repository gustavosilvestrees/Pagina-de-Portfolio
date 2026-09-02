const colorPalette = {
    "Deep Base": "#0F172A",
    "Surface": "#1E293B",
    "Emerald Focus": "#2AF598",
    "Sky Blue": "#3498DB",
    "Rose Alert": "#FF006E",
    "Vivid Mango": "#FF9A00",
    "Hot Pink": "#FB7110",
    "Neon Purple": "#8338EC",
    "Ghost Text": "#94A3B8",
    "Sunny Lemon": "#FADB5F"
};

const themeBtn = document.getElementById('theme-btn');
const themeMenu = document.getElementById('theme-menu');

// Função auxiliar para clarear cores (para criar os "tons acima")
function adjustColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2 * percent),
        R = (num >> 8) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Função para converter Hex para RGBA (para transparência nos botões)
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function gerarMenuTemas() {
    const rowLight = document.getElementById('row-light');
    const rowDark = document.getElementById('row-dark');
    rowLight.innerHTML = "";
    rowDark.innerHTML = "";

    // Botão White (Frutiger Aero) - Apenas no Modo Claro
    const btnWhite = criarBotaoTema("White", "#FFFFFF", 'light', true);
    rowLight.appendChild(btnWhite);

    // Adiciona "Deep Base" e "Surface" apenas no Modo Escuro
    const coresExtras = { "Deep Base": "#0F172A", "Surface": "#1E293B" };
    const paletteCompleta = { ...coresExtras, ...colorPalette };

    Object.keys(paletteCompleta).forEach(nome => {
        const cor = paletteCompleta[nome];
        rowDark.appendChild(criarBotaoTema(nome, cor, 'dark'));
        
        // No modo claro, não aparecem Deep Base e Surface
        if (nome !== "Deep Base" && nome !== "Surface") {
            rowLight.appendChild(criarBotaoTema(nome, cor, 'light'));
        }
    });
}

function criarBotaoTema(nome, cor, modo, isWhite = false) {
    const btn = document.createElement('div');
    btn.className = `theme-dot ${modo === 'light' ? 'light-dot' : ''}`;
    btn.style.backgroundColor = isWhite ? "#E0F2FE" : cor;
    btn.innerHTML = `<span>${nome}</span>`;
    btn.onclick = () => aplicarTema(cor, modo, isWhite);
    return btn;
}

function aplicarTema(corBase, modo, isWhite = false) {
    const root = document.documentElement;
    
    // Cores Fixas de Status conforme pedido
    root.style.setProperty('--color-disponivel', '#2ecc71'); // Verde
    root.style.setProperty('--color-estudando', '#FF9A00');  // Laranja
    root.style.setProperty('--color-pausado', '#ff0000');    // Cinza

    if (modo === 'dark') {
        // MODO ESCURO
        root.style.setProperty('--bg-color', '#0F172A');
        root.style.setProperty('--surface-color', '#1E293B');
        root.style.setProperty('--text-main', '#F0F9FF');
        root.style.setProperty('--accent-color', corBase);
        root.style.setProperty('--timer-color', corBase);
        // Gradiente do Botão: Começa na cor da página, termina na cor base
        root.style.setProperty('--btn-gradient', `linear-gradient(135deg, #0F172A 0%, ${corBase} 100%)`);
        // Estilo especial botões tabela (1 tom abaixo + transparente)
        const tomAbaixo = adjustColor(corBase, -20);
        root.style.setProperty('--table-btn-bg', hexToRgba(tomAbaixo, 0.4));
        root.style.setProperty('--table-btn-border', corBase);
    } 
    else if (isWhite) {
        // MODO WHITE (Frutiger Aero)
        const blueFrutiger = "#3498DB";
        root.style.setProperty('--bg-color', '#FFFFFF');
        root.style.setProperty('--surface-color', '#F0F9FF'); // Azul beeeem clarinho para contraste
        root.style.setProperty('--text-main', '#0F172A');
        root.style.setProperty('--accent-color', blueFrutiger);
        root.style.setProperty('--timer-color', blueFrutiger);
        root.style.setProperty('--btn-gradient', `linear-gradient(135deg, #FFFFFF 0%, ${blueFrutiger} 100%)`);
    } 
    else {
        // MODO CLARO COLORIDO
        // Aumentamos a distância entre os tons para contraste
        const tomSurface = adjustColor(corBase, 50); // Muito mais claro que o fundo
        const tomContraste = adjustColor(corBase, -20); // Tom escuro para o Timer ser legível
        
        root.style.setProperty('--bg-color', corBase);
        root.style.setProperty('--surface-color', tomSurface);
        root.style.setProperty('--text-main', '#1A1A1A');
        root.style.setProperty('--accent-color', tomContraste);
        root.style.setProperty('--timer-color', tomContraste);
        
        // Gradiente: Cor da página -> Tom mais escuro complementar
        root.style.setProperty('--btn-gradient', `linear-gradient(135deg, ${corBase} 0%, ${tomContraste} 100%)`);
    }

    localStorage.setItem('studyflow_theme', JSON.stringify({ corBase, modo, isWhite }));
}
themeBtn.onclick = () => themeMenu.classList.toggle('hidden');

document.addEventListener('DOMContentLoaded', () => {
    gerarMenuTemas();
    const salvo = JSON.parse(localStorage.getItem('studyflow_theme'));
    if (salvo) aplicarTema(salvo.corBase, salvo.modo, salvo.isWhite);
});