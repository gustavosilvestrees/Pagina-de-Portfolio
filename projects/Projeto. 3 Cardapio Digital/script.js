abrirModal()
    // Variaveis Globais
    
let totalCarrinho = 0;
let numerosDePedidos = [];
let carrinhoItens = []; // Array que armazena os objetos do carrinho

const TAXA_ENTREGA = 10.00; // Valor fixo da taxa de entrega

// --- Funções de Pedidos (Mantidas do seu código original) ---

function salvarPedidos() {
    localStorage.setItem('numerosDePedidos', JSON.stringify(numerosDePedidos));
}

function carregarPedidos() {
    const pedidosSalvos = localStorage.getItem('numerosDePedidos');
    if (pedidosSalvos) {
        numerosDePedidos = JSON.parse(pedidosSalvos);
    }
}

// ------------------------------------------------
// Lógica para a página de pedidos (1pedidos_principais.html)
// ------------------------------------------------

// 1. Seleciona todas as divs de pizzas (usando a classe que você indicou: .card-pizzas)
const itensCardapio = document.querySelectorAll('.card-pizzas');

// 2. Adiciona o Event Listener para adicionar ao carrinho
if (itensCardapio.length > 0) {
    itensCardapio.forEach(card => {
        card.addEventListener('click', () => {
            // Pega o ID da pizza usando o atributo 'data-id'
            const pizzaId = card.dataset.id;
            
            // Chama a função centralizada de adicionar ao carrinho
            abrirModal();
            adicionarAoCarrinho(pizzaId);
        });
    });
}

// ------------------------------------------------------------------
// --- LÓGICA DO CARRINHO ---
// ------------------------------------------------------------------

// --- Funções de Salvar/Carregar Itens do Carrinho (Adaptadas) ---

function salvarItensCarrinho() {
    localStorage.setItem('carrinhoItens', JSON.stringify(carrinhoItens));
}

// --- Função: Puxa os itens do localStorage e joga no carrinho ---
function carregarItensCarrinho() {
    const itensSalvos = localStorage.getItem('carrinhoItens');
    if (itensSalvos) {
        // Converte de volta para objeto JavaScript (carrinhoItens deve ter IDs como number)
        carrinhoItens = JSON.parse(itensSalvos); 
        
        // CORREÇÃO DE TIPO (Caso o JSON.parse não mantenha os IDs como Number)
        // Isso garante que os IDs sejam numéricos, evitando o erro de não encontrar o item.
        carrinhoItens = carrinhoItens.map(item => ({
            ...item,
            id: Number(item.id) 
        }));
    } else {
        carrinhoItens = []; // Garante que é um array vazio se não houver nada salvo
    }
}

// --- 1. Lógica para Adicionar/Atualizar Item no Carrinho ---

function adicionarAoCarrinho(pizzaId) {
    // 1. OBRIGATÓRIO: Carrega os itens existentes do Local Storage. 
    // Se não fizer isso, o 'carrinhoItens' estará vazio e a nova pizza SOBRESCREVERÁ a anterior no localStorage.
    carregarItensCarrinho(); 
    
    // 2. Converte o ID (que vem do HTML como string) para número, garantindo a correspondência
    const id = Number(pizzaId);

    // 3. Procura se o item já existe no carrinho (com o ID numérico)
    const itemExistente = carrinhoItens.find(item => item.id === id);
    
    // 4. Busca os dados da pizza no catálogo (do pizzas.js)
    // Certifique-se de que a busca use a string do ID, se o CATALOGO_PIZZAS for um objeto JS:
    const pizzaSelecionada = CATALOGO_PIZZAS[pizzaId]; // Usa pizzaId (string) como chave do objeto
    
    if (!pizzaSelecionada) {
        console.error('Pizza não encontrada no catálogo:', pizzaId);
        return;
    }

    if (itemExistente) {
        // Item já existe: Aumenta a quantidade
        itemExistente.quantidade++;
        itemExistente.precoTotalItem = itemExistente.quantidade * pizzaSelecionada.preco;
    } else {
        // Novo item: Adiciona ao carrinho
        carrinhoItens.push({
            id: id, // Armazena o ID como número
            nome: pizzaSelecionada.nome,
            foto: pizzaSelecionada.foto,
            precoUnitario: pizzaSelecionada.preco,
            quantidade: 1,
            precoTotalItem: pizzaSelecionada.preco // Preço unitário, pois QTD=1
        });
    }

    // 5. Salva a alteração (agora com todos os itens) no Local Storage
    salvarItensCarrinho();
    
    // Opcional: Se você quiser uma atualização visual imediata (ex: um contador) na página principal
    // Você pode chamar renderizarItensCarrinho(); se o usuário estiver na página 3carrinho.html, 
    // mas geralmente é melhor deixar a renderização para quando a página do carrinho carrega.
}


// --- 2. Lógica de Alteração de Quantidade e Exclusão ---

function aumentarQuantidade(itemId) {
    const itemIndex = carrinhoItens.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        const item = carrinhoItens[itemIndex];
        const pizzaData = CATALOGO_PIZZAS[itemId];

        item.quantidade++;
        item.precoTotalItem = item.quantidade * pizzaData.preco;
        
        salvarItensCarrinho();
        renderizarItensCarrinho(); // Atualiza a visualização em tempo real
    }
}

function diminuirQuantidade(itemId) {
    const itemIndex = carrinhoItens.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        const item = carrinhoItens[itemIndex];
        const pizzaData = CATALOGO_PIZZAS[itemId];

        if (item.quantidade > 1) {
            item.quantidade--;
            item.precoTotalItem = item.quantidade * pizzaData.preco;
            
            salvarItensCarrinho();
            renderizarItensCarrinho(); // Atualiza a visualização em tempo real
        } else {
            // Se a quantidade for 1, o botão '-' deve excluir o item
            excluirItemCarrinho(itemId);
        }
    }
}

function excluirItemCarrinho(itemId) {
    // Filtra o array, removendo o item com o ID correspondente
    carrinhoItens = carrinhoItens.filter(item => item.id !== itemId);
    
    salvarItensCarrinho();
    renderizarItensCarrinho(); // Atualiza a visualização em tempo real
}


// --- 3. Lógica para Calcular e Exibir os Totais ---

function exibirTotalCarrinho() {
    // Calcula o subtotal (soma dos precosTotalItem)
    const subtotal = carrinhoItens.reduce((acc, item) => acc + item.precoTotalItem, 0);
    const totalComEntrega = subtotal + TAXA_ENTREGA;
    
    // Elementos de exibição em 3carrinho.html
    const spanSubtotal = document.querySelector('.resumo-subtotal span');
    const spanTotal = document.querySelector('.resumo-total .special3');
    const spanEntrega = document.querySelector('.resumo-entrega span');
    
    // Atualiza a taxa de entrega (pode ser útil se ela não estiver fixa)
    if (spanEntrega) {
        spanEntrega.textContent = `R$ ${TAXA_ENTREGA.toFixed(2).replace('.', ',')}`;
    }

    if (spanSubtotal) {
        spanSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
    
    if (spanTotal) {
        spanTotal.textContent = `R$ ${totalComEntrega.toFixed(2).replace('.', ',')}`;
    }
}

function mudarQuantidade(pizzaId, mudanca) {
    const item = carrinhoItens.find(i => i.id === pizzaId);
    if (!item) return;

    let novoValor = item.quantidade + mudanca;
    
    // Se o novo valor for 0 (clicou '-' com QTD=1), REMOVE o item
    if (novoValor < 1) {
        excluirItemCarrinho(pizzaId); // Chama a função de remoção
        return;
    }
    
    // Atualiza a quantidade e recalcula o preço total do item
    item.quantidade = novoValor;
    item.precoTotal = item.precoUnitario * novoValor;

    salvarItensCarrinho();
    exibirItensCarrinho(); 
    exibirTotalCarrinho();
}


// --- 4. Lógica para Renderizar (Desenhar) os Itens no Carrinho ---



function renderizarItensCarrinho() {
    const containerItensSacola = document.querySelector('.itens-sacola');
    if (!containerItensSacola) return;
    
    // 1. Limpa o container
    containerItensSacola.innerHTML = ''; 
    carregarItensCarrinho(); // Garante que o array está carregado

    if (carrinhoItens.length === 0) {
        containerItensSacola.innerHTML = '<p style="text-align: center; margin-top: 20px; color: var(--marrom);">Sua sacola está vazia. Adicione algumas pizzas!</p>';
        exibirTotalCarrinho();
        return;
    }
    
    // 2. Constrói o HTML de todos os itens
    let htmlContent = '';
    
    carrinhoItens.forEach(item => {
        // ATENÇÃO: Verifique se 'precoTotalItem' ou 'precoTotal' é o nome correto no seu objeto
        const precoTotalItemFormatado = item.precoTotalItem.toFixed(2).replace('.', ',');

        // Estrutura HTML de CADA item (certifique-se de que corresponde ao seu CSS)
        htmlContent += `
            <div class="item-sacola" data-id="${item.id}">
                <div class="item-sacola-img">
                    <img src="${item.foto}" alt="${item.nome}">
                </div>

                <div class="item-info">
                    <p class="item-nome">${item.nome}</p>
                    <p class="item-preco">R$ ${precoTotalItemFormatado}</p>
                    
                    <div class="item-quantidade-controle">
                        <button class="btn-quantidade btn-menos" onclick="diminuirQuantidade(${item.id})">-</button>
                        <span class="input-quantidade">${item.quantidade}</span>
                        <button class="btn-quantidade btn-mais" onclick="aumentarQuantidade(${item.id})">+</button>
                    </div>
                </div>
                <div class="item-lixeira" onclick="excluirItemCarrinho(${item.id})"><i class="fa-solid fa-trash-can"></i></div>
            </div>
        `;
    });

    // 3. Adiciona todo o HTML de uma vez ao container
    containerItensSacola.innerHTML = htmlContent;

    // 4. Atualiza os totais
    exibirTotalCarrinho();
}


// --- 5. Lógica para Renderizar os Cards de Pizza na Pagina Principal ---

function renderizarCatalogo() {
    // Procura o container onde as pizzas serão exibidas (apenas em 1pedidos_principais.html)
    const container = document.querySelector('.secao-cardapio-pizzas'); 

    if (!container) return; // Sai se não encontrar o container

    for (const pizzaId in CATALOGO_PIZZAS) {
        const pizza = CATALOGO_PIZZAS[pizzaId];
        
        const precoFormatado = pizza.preco.toFixed(2).replace('.', ',');

        // Estrutura do Card (certifique-se de que o CSS para .card-pizzas funciona)
        const cardHTML = `
            <div class="card-pizzas" data-id="${pizza.id}">
                <div class="card-pizzas-img">
                    <img src="${pizza.foto}" alt="${pizza.nome}">
                </div>
                <div class="card-pizzas-info">
                    <p class="card-pizzas-titulo">${pizza.nome}</p>
                    <p class="card-pizzas-descricao">Ingredientes deliciosos...</p>
                    <div class="card-pizzas-preco">
                        <p>R$ ${precoFormatado}</p>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += cardHTML;
    }

    // Adiciona o Evento de Clique para CADA CARD
    document.querySelectorAll('.card-pizzas').forEach(card => {
        card.addEventListener('click', (event) => {
            // event.currentTarget é o elemento .card-pizzas clicado
            const pizzaId = event.currentTarget.dataset.id;
            adicionarAoCarrinho(pizzaId);
        });
    });
}


// ------------------------------------------------------------------
// --- INICIALIZAÇÃO AO CARREGAR A PÁGINA ---
// ------------------------------------------------------------------

// Executa a lógica de acordo com a página atual
carregarPedidos(); // Carrega os números de pedidos existentes

if (document.URL.includes('1pedidos_principais.html')) {
    // Se estiver na página do menu (1pedidos_principais.html), renderiza os cards
    renderizarCatalogo();
}

if (document.URL.includes('3carrinho.html')) {
    // Se estiver na página do carrinho (3carrinho.html), carrega e renderiza os itens
    carregarItensCarrinho();
    renderizarItensCarrinho();
}


// ------------------------------------------------------------------
// Janela Modal (Deixei o código original da modal que estava no seu script.js)
// ------------------------------------------------------------------





function abrirModal(){
        const modal = document.getElementById('janelaModal');
            
        modal.classList.add('abrir');
            
        modal.addEventListener('click', (e) => { // o E é um parametro
            if(e.target.id == 'close' || e.target.id == 'janelaModal'){ //vai procurar o id close ou janelaModal como alvo(target)
                
                // Lógica de Fechamento (Animação de Saída)
                modal.classList.remove('abrir') // Remove a classe 'abrir', o CSS fará a opacidade ir para 0 em 0.3s
                
                // Oculta completamente o elemento após a animação de 0.3s
                setTimeout(() => {
                    // Sem a classe 'abrir', o CSS fará com que a modal volte a ter:
                    // opacity: 0;
                    // visibility: hidden;
                    // display: none; // O display: none deve estar no CSS base da .janelaModal para funcionar
                }, 3000); // 300 milissegundos é o tempo da nossa transition no CSS
            }
        }, { once: true }) // Adiciona o { once: true } para que o listener só seja ativado uma vez
    }

function criarPedido() {
    let containerPedidos = document.querySelector('.itens-sacola'); // puxa a section itens sacola
    let novoPedido = document.createElement("div");  //cria div vazia e armazena

    const numeroUnico = gerarNumeroPedido();

    novoPedido.classList.add('item-sacola'); //cria a class dessa div nova todas as divs criadas terão essa classe
    novoPedido.innerHTML = `
        <p class="numP">Número do pedido: <span>#${numeroUnico}</span></p>
    `; // cria o conteudo da div


    

    containerPedidos.appendChild(novoPedido); //add novoPedido como filho da section
}

function deletarPedido() {
     let containerPedidos = document.querySelector('.itens-sacola'); // encontra aonde estão os pedidos
    
    // 1. Pega o último pedido na lista, se houver
    let ultimoPedido = containerPedidos.lastElementChild;

    // 2. Verifica se existe um último pedido
    if (ultimoPedido) {
        
        // 3. Extrai o número do pedido do HTML

        const numPedidoElement = ultimoPedido.querySelector('.numP span'); // localiza a tag <span> dentro do último pedido, que é onde o número único (#${numeroUnico}) está.
        if (numPedidoElement) {
            // Remove o '#' e converte para número inteiro
            const numeroParaDeletar = parseInt(numPedidoElement.textContent.replace('#', ''));
            
            // 4. Remove o número do array 'numerosDePedidos'
            const index = numerosDePedidos.indexOf(numeroParaDeletar);
            if (index > -1) {
                numerosDePedidos.splice(index, 1); // Remove 1 elemento na posição 'index' e Usa o método splice para remover o número da lista.
                salvarPedidos(); // Salva o array atualizado no localStorage
                console.log(`Número de pedido #${numeroParaDeletar} deletado e removido do localStorage.`);
            }
        }

        // 5. Remove o pedido da tela (Elemento HTML)
        containerPedidos.removeChild(ultimoPedido);
    }
}