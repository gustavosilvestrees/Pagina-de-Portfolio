/* ================================= LÓGICA DE CORES DO GRÁFICO ================================= */

function obterCorPorTempo(totalHoras) {
    const minutos = totalHoras * 60;

    // Seguindo sua lista de metas e novas cores
    if (totalHoras >= 9) return "#D2B48C"; // Marrom Claro (9h+)
    if (totalHoras >= 8) return "#C04000"; // Mogno (8h)
    if (totalHoras >= 7) return "#90EE90"; // Light Green (7h) - Tom diferenciado
    if (totalHoras >= 6) return "#8B4513"; // Marrom (6h)
    if (totalHoras >= 5) return "#FF9A00"; // Laranja (5h)
    if (totalHoras >= 4) return "#FF00FF"; // Magenta (4h)
    if (totalHoras >= 3) return "#8338EC"; // Violeta (3h)
    if (totalHoras >= 2) return "#025043"; // Teal (2h)
    if (totalHoras >= 1) return "#4caf50"; // Green (1h)
    if (minutos >= 30)   return "#950606"; // Dark Red (30min)
    if (minutos >= 10)   return "#FF4D4D"; // Vermelho (10min)
    
    return "#94A3B8"; // Cinza (Menos de 10 min)
}

/* ================================= RENDERIZAÇÃO DO GRÁFICO ================================= */

function renderizarGrafico() {
    const registros = JSON.parse(localStorage.getItem('pontos_estudo')) || [];
    const canvas = document.getElementById('studyChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 1. Agrupar horas por data
    const dadosAgrupados = {};
    registros.forEach(reg => {
        const partes = reg.total.split(':');
        // Converte HH:MM:SS para decimal (Ex: 1:30 = 1.5)
        const totalHoras = parseInt(partes[0]) + (parseInt(partes[1]) / 60) + (parseInt(partes[2]) / 3600);
        
        dadosAgrupados[reg.data] = (dadosAgrupados[reg.data] || 0) + totalHoras;
    });

    // 2. Preparar Labels e Valores (Últimos 7 registros de dias)
    const labels = Object.keys(dadosAgrupados).slice(-7);
    const valores = Object.values(dadosAgrupados).slice(-7);

    // 3. GERAR O ARRAY DE CORES DINÂMICO
    const coresDasBarras = valores.map(v => obterCorPorTempo(v));

    if (window.meuGrafico) window.meuGrafico.destroy();

    window.meuGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Horas Estudadas',
                data: valores,
                backgroundColor: coresDasBarras, // Usa o array de cores aqui!
                borderRadius: 8,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }, // Oculta a legenda para focar nas cores
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Tempo: ${context.raw.toFixed(2)}h`;
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#94A3B8' }
                },
                x: {
                    ticks: { color: '#94A3B8' }
                }
            }
        }
    });
}

// Inicializa ao carregar
document.addEventListener('DOMContentLoaded', renderizarGrafico);