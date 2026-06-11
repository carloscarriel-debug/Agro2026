// ==========================================================================
// 1. DADOS DA JAVASCRIPT (Renderização Dinâmica)
// ==========================================================================

const destaquesDados = [
    { id: 1, titulo: "Acrobacia de Solo", desc: "Técnicas avançadas de saltos, giros e estabilização de core com referências internacionais." },
    { id: 2, titulo: "Aerial Masterclass", desc: "Exploração vertical em tecidos, liras e trapézios com foco em transições fluidas." },
    { id: 3, titulo: "Hand-to-Hand", desc: "A arte do equilíbrio em duplas e trios. Alinhamento, biomecânica e comunicação corporal." }
];

const programacaoDados = [
    { dia: "Dia 01 - Abertura e Conexão", info: "Credenciamento a partir das 08h, seguido pela palestra magna sobre a evolução da acrobacia performática em 2026 e painéis de discussão técnica." },
    { dia: "Dia 02 - Prática e Workshops", info: "Dia intensivo de oficinas práticas divididas por níveis (Iniciante ao Avançado) guiadas por atletas olímpicos e artistas do Cirque du Soleil." },
    { dia: "Dia 03 - Competição e Encerramento", info: "Mostra competitiva oficial ACRO 2026, avaliação dos juízes, entrega de prêmios e coquetel de networking de encerramento." }
];

// ==========================================================================
// 2. INICIALIZAÇÃO E INJEÇÃO DE CONTEÚDO (DOM)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    renderizarDestaques();
    renderizarProgramacao();
    initCarrossel();
    initAcordeon();
    initAcessibilidade();
    initScrollReveal();
});

function renderizarDestaques() {
    const track = document.getElementById("carousel-track");
    if (!track) return;
    
    track.innerHTML = destaquesDados.map((item, index) => `
        <li class="carousel-item" role="group" aria-roledescription="slide" aria-label="${index + 1} de ${destaquesDados.length}">
            <article class="card">
                <h3>${item.titulo}</h3>
                <p>${item.desc}</p>
            </article>
        </li>
    `).join('');
}

function renderizarProgramacao() {
    const accordion = document.getElementById("programacao-accordion");
    if (!accordion) return;

    accordion.innerHTML = programacaoDados.map((item, index) => `
        <div class="accordion-item">
            <button class="accordion-header" 
                    id="acc-header-${index}" 
                    aria-expanded="false" 
                    aria-controls="acc-panel-${index}">
                <span>${item.dia}</span>
                <span class="accordion-icon" aria-hidden="true">▼</span>
            </button>
            <div class="accordion-panel" 
                 id="acc-panel-${index}" 
                 role="region" 
                 aria-labelledby="acc-header-${index}" 
                 aria-hidden="true">
                <p>${item.info}</p>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// 3. COMPONENTE: CARROSSEL FUNCIONAL
// ==========================================================================

function initCarrossel() {
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    if (!track || !prevBtn || !nextBtn) return;

    let indexAtual = 0;
    
    function atualizarCarrossel() {
        const itens = document.querySelectorAll(".carousel-item");
        const totalItens = itens.length;
        // Identifica se estamos em ambiente Desktop ou Mobile avaliando a largura do item
        const larguraItem = itens[0].getBoundingClientRect().width;
        const totalLarguraTrack = track.getBoundingClientRect().width;
        
        // Impede overflow caso múltiplos elementos já caibam nativamente na tela (Desktop)
        if (larguraItem * totalItens <= totalLarguraTrack) {
            track.style.transform = `translateX(0px)`;
            return;
        }

        if (indexAtual >= totalItens) indexAtual = 0;
        if (indexAtual < 0) indexAtual = totalItens - 1;

        track.style.transform = `translateX(-${indexAtual * larguraItem}px)`;
    }

    nextBtn.addEventListener("click", () => {
        indexAtual++;
        atualizarCarrossel();
    });

    prevBtn.addEventListener("click", () => {
        indexAtual--;
        atualizarCarrossel();
    });

    window.addEventListener("resize", atualizarCarrossel);
}

// ==========================================================================
// 4. COMPONENTE: ACORDEÃO (Acessível via Teclado e Leitores de Tela)
// ==========================================================================

function initAcordeon() {
    const headers = document.querySelectorAll(".accordion-header");
    
    headers.forEach(header => {
        header.addEventListener("click", () => {
            const painel = document.getElementById(header.getAttribute("aria-controls"));
            const estaExpandido = header.getAttribute("aria-expanded") === "true";
            
            // Alterna o estado do botão
            header.setAttribute("aria-expanded", !estaExpandido);
            // Alterna a visibilidade para tecnologias assistivas
            painel.setAttribute("aria-hidden", estaExpandido);
            
            if (!estaExpandido) {
                painel.style.maxHeight = painel.scrollHeight + "px";
            } else {
                painel.style.maxHeight = null;
            }
        });
    });
}

// ==========================================================================
// 5. ACESSIBILIDADE: FONTES E ALTO CONTRASTE
// ==========================================================================

function initAcessibilidade() {
    const htmlTag = document.documentElement;
    const bodyTag = document.body;
    const btnContrast = document.getElementById("btn-contrast");
    const btnInc = document.getElementById("btn-font-increase");
    const btnDec = document.getElementById("btn-font-decrease");
    
    let tamanhoFonteAtual = 100; // Representa 100% (16px base)

    // Controle de Tamanho da Fonte
    btnInc.addEventListener("click", () => {
        if (tamanhoFonteAtual < 140) { // Limite máximo seguro por UX
            tamanhoFonteAtual += 10;
            htmlTag.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    btnDec.addEventListener("click", () => {
        if (tamanhoFonteAtual > 80) { // Limite mínimo seguro por UX
            tamanhoFonteAtual -= 10;
            htmlTag.style.fontSize = `${tamanhoFonteAtual}%`;
        }
    });

    // Controle de Alto Contraste
    btnContrast.addEventListener("click", () => {
        const ativo = bodyTag.classList.toggle("high-contrast");
        btnContrast.setAttribute("aria-pressed", ativo);
    });
}

// ==========================================================================
// 6. ANIMAÇÃO DE ENTRADA (Scroll Reveal simples e performático)
// ==========================================================================

function initScrollReveal() {
    const elementosParaRevelar = document.querySelectorAll(".reveal");
    
    const checarScroll = () => {
        const gatilhoAtivacao = (window.innerHeight / 5) * 4;
        
        elementosParaRevelar.forEach(el => {
            const topoElemento = el.getBoundingClientRect().top;
            if (topoElemento < gatilhoAtivacao) {
                el.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", checarScroll);
    checarScroll(); // Executa uma vez no início caso o elemento já esteja visível
}


