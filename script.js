(function () {
  'use strict';

  /* ============================================================
     NAVEGAÇÃO LATERAL (SIDEBAR) E MENU MOBILE
     ============================================================ */
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const moduleHeaders = document.querySelectorAll('.module-header');
  const navItems = document.querySelectorAll('.nav-item, .topic-item');
  const mainContent = document.getElementById('mainContent');
  const progressBar = document.getElementById('progressBar');
  const backTop = document.getElementById('backTop');
  
  const sidebarNav = document.getElementById('sidebarNav');
  const activeBgSlider = document.getElementById('activeBgSlider');

  function moveActiveBg(element) {
    if (!element) { activeBgSlider.style.opacity = '0'; return; }
    activeBgSlider.style.opacity = '1';
    const containerRect = sidebarNav.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const topPos = elementRect.top - containerRect.top + sidebarNav.scrollTop;
    activeBgSlider.style.height = elementRect.height + 'px';
    activeBgSlider.style.transform = `translateY(${topPos}px)`;
  }

  function toggleMobileMenu() {
    sidebar.classList.toggle('open');
    mobileToggle.classList.toggle('open');
    if (sidebar.classList.contains('open')) { sidebarOverlay.classList.add('active'); }
    else { sidebarOverlay.classList.remove('active'); }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleMobileMenu);

  moduleHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      const moduleParent = header.closest('.nav-module');
      header.setAttribute('aria-expanded', !isExpanded);
      moduleParent.classList.toggle('open');
      setTimeout(() => {
        const activeEl = document.querySelector('.nav-item.active, .topic-item.active');
        if(activeEl) moveActiveBg(activeEl);
      }, 300);
    });
  });

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        document.querySelectorAll('.nav-item, .topic-item, .module-header').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        moveActiveBg(item);
        const parentModule = item.closest('.nav-module');
        if (parentModule) {
          parentModule.classList.add('open');
          parentModule.querySelector('.module-header').setAttribute('aria-expanded', 'true');
        }
        if (window.innerWidth <= 1024) toggleMobileMenu();
      }
    });
  });

  /* ============================================================
     BARRA DE PROGRESSO
     ============================================================ */
  function onScroll() {
    const scrollTop = mainContent.scrollTop;
    const docHeight = mainContent.scrollHeight - mainContent.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    backTop.classList.toggle('visible', scrollTop > 400);
  }

  if (mainContent) {
    mainContent.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  backTop.addEventListener('click', () => { mainContent.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ============================================================
     SCROLL SPY (Bloco Azul)
     ============================================================ */
  const spyTargets = document.querySelectorAll('.page-content, .topic-block');
  const spyOptions = { root: mainContent, rootMargin: '-10% 0px -60% 0px', threshold: 0 };
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const activeLink = document.querySelector(`.nav-item[data-target="${id}"], .topic-item[data-target="${id}"]`);
        if (activeLink) {
          document.querySelectorAll('.nav-item, .topic-item, .module-header').forEach(el => el.classList.remove('active'));
          activeLink.classList.add('active');
          moveActiveBg(activeLink);
          const parentModule = activeLink.closest('.nav-module');
          if (parentModule && !parentModule.classList.contains('open')) {
            parentModule.classList.add('open');
            parentModule.querySelector('.module-header').setAttribute('aria-expanded', 'true');
            setTimeout(() => moveActiveBg(activeLink), 300);
          }
        }
      }
    });
  }, spyOptions);
  spyTargets.forEach(target => spy.observe(target));

  window.addEventListener('load', () => {
    const firstActive = document.querySelector('.nav-item.active');
    if(firstActive) moveActiveBg(firstActive);
  });

  /* ============================================================
     HISTÓRIA (ACCORDION)
     ============================================================ */
  const historyHeaders = document.querySelectorAll('.history-header');
  historyHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.history-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.history-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ============================================================
     CICLO DE PROCESSAMENTO
     ============================================================ */
  const cycleSteps = document.querySelectorAll('.cycle-step');
  const cycleDisplay = document.getElementById('cycleDisplay');
  const cycleContent = {
    entrada: { title: 'Entrada', text: 'Os dados brutos são capturados do mundo real por dispositivos como teclado, mouse, câmera, microfone e sensores.' },
    processamento: { title: 'Processamento', text: 'A CPU busca as instruções na memória, decodifica e executa operações lógicas e aritméticas sobre os dados.' },
    armazenamento: { title: 'Armazenamento', text: 'Dados e resultados são mantidos temporariamente na memória RAM e, de forma permanente, em HD, SSD ou outros dispositivos.' },
    saida: { title: 'Saída', text: 'O resultado do processamento é apresentado ao usuário por monitores, impressoras, alto-falantes ou enviado pela rede.' }
  };

  cycleSteps.forEach(step => {
    step.addEventListener('click', () => {
      cycleSteps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
      const key = step.dataset.cycle;
      const content = cycleContent[key];
      if (content && cycleDisplay) { cycleDisplay.innerHTML = `<p><strong>${content.title}:</strong> ${content.text}</p>`; }
    });
  });

  /* ============================================================
     SIMULADOR DE MEMÓRIA RAM
     ============================================================ */
  const ramSlider = document.getElementById('ramSlider');
  const ramCount = document.getElementById('ramCount');
  const ramStatus = document.getElementById('ramStatus');
  const ramSlots = document.getElementById('ramSlots');
  const TOTAL_SLOTS = 8;

  if (ramSlots) {
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      const slot = document.createElement('div');
      slot.className = 'ram-slot';
      ramSlots.appendChild(slot);
    }
  }
  const slotEls = ramSlots ? ramSlots.querySelectorAll('.ram-slot') : [];

  function updateRam() {
    if (!ramSlider) return;
    const value = parseInt(ramSlider.value, 10);
    ramCount.textContent = value;
    slotEls.forEach((slot, i) => slot.classList.toggle('filled', i < value));
    ramStatus.classList.remove('warn', 'danger');
    if (value <= 3) ramStatus.textContent = 'Memória disponível. Execução fluida.';
    else if (value <= 5) { ramStatus.textContent = 'Uso moderado. O sistema começa a gerenciar recursos.'; ramStatus.classList.add('warn'); }
    else if (value <= 7) { ramStatus.textContent = 'Uso alto. Programas podem disputar memória.'; ramStatus.classList.add('warn'); }
    else { ramStatus.textContent = 'Memória no limite. Risco de lentidão e travamentos.'; ramStatus.classList.add('danger'); }
  }

  if (ramSlider) { ramSlider.addEventListener('input', updateRam); updateRam(); }

  /* ============================================================
     PERIFÉRICOS INTERATIVOS
     ============================================================ */
  const periphData = {
    teclado: { nome: 'Teclado', desc: 'Principal dispositivo de entrada de texto. Possui teclas alfanuméricas, de função e de controle, permitindo digitar comandos e dados.', img: 'img/teclado.png' },
    mouse: { nome: 'Mouse', desc: 'Dispositivo apontador que permite mover o cursor na tela e clicar em ícones, botões e menus.', img: 'img/mouse.png' },
    scanner: { nome: 'Scanner', desc: 'Digitaliza documentos físicos (papel) transformando-os em imagens digitais que podem ser editadas no computador.', img: 'img/scanner.png' },
    microfone: { nome: 'Microfone', desc: 'Captura ondas sonoras (voz, música) e as converte em sinais digitais para o computador.', img: 'img/microfone.png' },
    webcam: { nome: 'Webcam', desc: 'Câmera de vídeo conectada ao computador, usada para videochamadas e transmissões ao vivo.', img: 'img/webcam.png' },
    monitor: { nome: 'Monitor', desc: 'Principal dispositivo de saída visual. Exibe imagens, textos e vídeos gerados pela placa de vídeo.', img: 'img/monitor.png' },
    impressora: { nome: 'Impressora', desc: 'Dispositivo de saída que transfere textos e imagens digitais para o papel.', img: 'img/impressora.png' },
    'caixas-som': { nome: 'Caixas de Som', desc: 'Dispositivos de saída de áudio. Convertem sinais elétricos em ondas sonoras audíveis.', img: 'img/caixas-som.png' },
    projetor: { nome: 'Projetor', desc: 'Dispositivo de saída que projeta imagens e vídeos em uma tela ou parede grande.', img: 'img/projetor.png' },
    touchscreen: { nome: 'Tela Touchscreen', desc: 'Combina entrada e saída: exibe imagens (saída) e capta o toque do dedo do usuário (entrada).', img: 'img/touchscreen.png' },
    modem: { nome: 'Modem', desc: 'Modulador/Demodulador. Converte sinais para permitir a comunicação do computador com a internet (envia e recebe dados).', img: 'img/modem.png' },
    'placa-rede': { nome: 'Placa de Rede', desc: 'Permite a conexão do computador a uma rede local ou à internet, enviando e recebendo pacotes de dados.', img: 'img/placa-rede.png' },
    multifuncional: { nome: 'Impressora Multifuncional', desc: 'Agrupa funções de impressora (saída), scanner (entrada) e copiadora em um único aparelho.', img: 'img/multifuncional.png' }
  };

  function showPeriph(key, displayElement) {
    const data = periphData[key];
    if (!data) return;
    displayElement.innerHTML = `<img src="${data.img}" alt="${data.nome}"><h5>${data.nome}</h5><p>${data.desc}</p>`;
  }

  const periphTabs = document.querySelectorAll('#periphTabs .tab');
  const periphContents = document.querySelectorAll('.periph-content');

  periphTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      periphTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      periphContents.forEach(c => c.classList.toggle('active', c.dataset.panel === target));
    });
  });

  const periphButtons = document.querySelectorAll('.periph-list .pill');
  const defaultEntrada = document.getElementById('periphDisplayEntrada');
  const defaultSaida = document.getElementById('periphDisplaySaida');
  const defaultAmbos = document.getElementById('periphDisplayAmbos');

  if(defaultEntrada) showPeriph('teclado', defaultEntrada);
  if(defaultSaida) showPeriph('monitor', defaultSaida);
  if(defaultAmbos) showPeriph('touchscreen', defaultAmbos);

  periphButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentList = btn.closest('.periph-list');
      parentList.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.dataset.periph;
      const panel = btn.closest('.periph-content');
      let displayEl;
      if (panel.dataset.panel === 'entrada') displayEl = defaultEntrada;
      else if (panel.dataset.panel === 'saida') displayEl = defaultSaida;
      else displayEl = defaultAmbos;
      if (displayEl) showPeriph(key, displayEl);
    });
  });

  /* ============================================================
     SIMULADOR DE REDE (MÓDULO 4)
     ============================================================ */
  const btnLocal = document.getElementById('btnLocal');
  const btnCloud = document.getElementById('btnCloud');
  const simLocalPc = document.getElementById('simLocalPc');
  const simCloudServer = document.getElementById('simCloudServer');
  const simDot = document.getElementById('simDot');
  const simStatus = document.getElementById('simStatus');
  
  let simAnimating = false;

  function resetSim() {
    simLocalPc.classList.remove('active');
    simCloudServer.classList.remove('active');
    simDot.style.opacity = '0';
    simDot.style.left = '0';
    simDot.style.top = '0';
    simStatus.textContent = 'Aguardando execução...';
    simAnimating = false;
  }

  if(btnLocal) {
    btnLocal.addEventListener('click', () => {
      if(simAnimating) return;
      simAnimating = true;
      resetSim();
      simLocalPc.classList.add('active');
      simStatus.textContent = 'Processando localmente...';
      setTimeout(() => {
        simStatus.textContent = 'Processamento concluído no dispositivo!';
        simAnimating = false;
      }, 1500);
    });
  }

  if(btnCloud) {
    btnCloud.addEventListener('click', () => {
      if(simAnimating) return;
      simAnimating = true;
      resetSim();
      simStatus.textContent = 'Enviando dados para a nuvem...';
      simDot.style.opacity = '1';

      let start = null;
      function stepGoing(timestamp) {
        if (!start) start = timestamp;
        let progress = (timestamp - start) / 1500; 
        if (progress > 1) progress = 1;
        
        if(window.innerWidth <= 1024) { simDot.style.top = (progress * 100) + '%'; }
        else { simDot.style.left = (progress * 100) + '%'; }

        if (progress < 1) { requestAnimationFrame(stepGoing); }
        else {
          simCloudServer.classList.add('active');
          simStatus.textContent = 'Servidor processando...';
          setTimeout(() => {
            simStatus.textContent = 'Retornando resultado...';
            simCloudServer.classList.remove('active');
            let startBack = null;
            function stepBack(timestamp) {
              if (!startBack) startBack = timestamp;
              let progressBack = 1 - ((timestamp - startBack) / 1500);
              if (progressBack < 0) progressBack = 0;
              
              if(window.innerWidth <= 1024) { simDot.style.top = (progressBack * 100) + '%'; }
              else { simDot.style.left = (progressBack * 100) + '%'; }
              
              if (progressBack > 0) { requestAnimationFrame(stepBack); }
              else {
                simDot.style.opacity = '0';
                simLocalPc.classList.add('active');
                simStatus.textContent = 'Resultado recebido no dispositivo!';
                simAnimating = false;
              }
            }
            requestAnimationFrame(stepBack);
          }, 1000);
        }
      }
      requestAnimationFrame(stepGoing);
    });
  }

  /* ============================================================
     FORÇA DA SENHA (MÓDULO 5)
     ============================================================ */
  const passInput = document.getElementById('passInput');
  const passMeter = document.getElementById('passMeter');
  const passStatus = document.getElementById('passStatus');

  if(passInput) {
    passInput.addEventListener('input', () => {
      const val = passInput.value;
      let score = 0;
      if (val.length === 0) { passMeter.style.width = '0%'; passStatus.textContent = 'Aguardando senha...'; return; }
      if (val.length > 5) score++;
      if (val.length > 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      let percent = (score / 5) * 100;
      if (percent > 100) percent = 100;
      passMeter.style.width = percent + '%';

      if (score <= 2) { passMeter.style.background = 'var(--err)'; passStatus.textContent = 'Senha Fraca. Adicione números e letras maiúsculas.'; }
      else if (score === 3 || score === 4) { passMeter.style.background = 'var(--warn)'; passStatus.textContent = 'Senha Média. Quase lá, adicione caracteres especiais.'; }
      else { passMeter.style.background = 'var(--ok)'; passStatus.textContent = 'Senha Forte! Excelente.'; }
    });
  }

  /* ============================================================
     MODAL DE EXTENSÕES (MÓDULO 4)
     ============================================================ */
  const extModal = document.getElementById('extModal');
  const modalClose = document.getElementById('modalClose');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalExample = document.getElementById('modalExample');
  const extButtons = document.querySelectorAll('.ext[data-ext]');

  const extData = {
    docx: {
      title: 'Documento de Texto (.docx)',
      desc: 'Arquivo criado por processadores de texto como o Microsoft Word ou Google Docs. Contém texto formatado, imagens, tabelas e estilos.',
      example: 'Currículo, trabalho escolar ou contrato.'
    },
    xlsx: {
      title: 'Planilha Eletrônica (.xlsx)',
      desc: 'Arquivo de planilha (Excel) usado para organizar dados em linhas e colunas, realizar cálculos e criar gráficos.',
      example: 'Controle de gastos mensais, notas de alunos ou relatórios financeiros.'
    },
    pdf: {
      title: 'Portable Document Format (.pdf)',
      desc: 'Formato universal que mantém a formatação original do documento em qualquer dispositivo. Muito usado para leitura e impressão.',
      example: 'E-books, manuais, notas fiscais e documentos oficiais.'
    },
    jpg: {
      title: 'Imagem JPEG (.jpg)',
      desc: 'Formato de imagem compactado (com perda de qualidade). Ideal para fotografias, pois gera arquivos menores.',
      example: 'Fotos de perfil, imagens de sites e redes sociais.'
    },
    mp4: {
      title: 'Vídeo MPEG-4 (.mp4)',
      desc: 'Formato de vídeo muito comum, que oferece boa qualidade com tamanho de arquivo razoável. Suporta áudio e legenda.',
      example: 'Vídeos do YouTube, filmes baixados e videoaulas.'
    },
    zip: {
      title: 'Arquivo Compactado (.zip)',
      desc: 'Formato que agrupa e comprime um ou mais arquivos em um só, reduzindo o tamanho total para facilitar o envio.',
      example: 'Enviar uma pasta com várias fotos por e-mail ou fazer backup.'
    }
  };

  function openModal(key) {
    const data = extData[key];
    if (!data) return;
    modalIcon.textContent = '.' + key;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalExample.textContent = data.example;
    extModal.classList.add('active');
  }

  function closeModal() {
    extModal.classList.remove('active');
  }

  extButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.ext);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  
  // Fechar ao clicar fora do modal
  if (extModal) {
    extModal.addEventListener('click', (e) => {
      if (e.target === extModal) closeModal();
    });
  }

  // Fechar com a tecla Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && extModal.classList.contains('active')) {
      closeModal();
    }
  });

})();