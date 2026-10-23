// Note G# - Central Mock Data Store & State Persistence
(function () {
  'use strict';

  const STORAGE_KEYS = {
    ARTICLES: 'noteg_articles_v1',
    FORUMS: 'noteg_forums_v1',
    DENUNCIAS: 'noteg_denuncias_v1',
    BANIDOS: 'noteg_banidos_v1',
    USER: 'noteg_user_v1'
  };

  // Seed Data matching the Use Case Specification Document
  const DEFAULT_ARTICLES = [
    {
      id: 1,
      titulo: "Introdução ao Vue 3 e o Futuro do Desenvolvimento Web",
      categoria: "Front-end",
      autor: "Lucas Almeida",
      cargoAutor: "Cientista da Computação & Pesquisador Web",
      colaboradores: ["Ana Silva", "Breno M."],
      status: "Publicado",
      data: "21 de junho de 2026",
      tempoLeitura: "5 minutos de leitura",
      resumo: "Descubra como o ecossistema evoluiu, as melhores práticas de Composition API e o que esperar do futuro do framework.",
      conteudo: `O desenvolvimento front-end tem evoluído a passos largos nos últimos anos. Com a consolidação do Vue 3, a forma como estruturamos aplicações de grande porte tornou-se muito mais limpa, performática e modular.

Neste artigo, exploramos em detalhes como a reatividade moderna baseada em Proxies substituiu as limitações do Object.defineProperty do Vue 2, permitindo melhor suporte a TypeScript e eliminação de casos de borda em arrays e objetos dinâmicos.

### A Revolução da Composition API
Diferente da antiga Options API, a Composition API nos permite agrupar o código por recursos lógicos em vez de tipos de propriedades. Isso significa que se você tem uma lógica de busca ou paginação, todo o código relacionado pode ficar junto, facilitando a reutilização de código através dos chamados Composables.

Além disso, a separação de responsabilidades fica muito mais explícita, facilitando testes unitários isolados e promovendo maior manutenibilidade em times multidisciplinares.`,
      citacao: "A reatividade fina do Vue 3 combinada com ferramentas modernas de build entrega a melhor experiência de desenvolvimento do mercado atual.",
      curtidas: 142,
      curtido: false,
      comentarios: [
        {
          id: 1,
          autor: "Fernando Souza",
          tempo: "Há 2 horas",
          avatar: "assets/images/faces/face4.jpg",
          texto: "Excelente artigo! A Composition API realmente mudou o jogo no dia a dia da nossa equipe."
        },
        {
          id: 2,
          autor: "Mariana Dias",
          tempo: "Há 5 horas",
          avatar: "assets/images/faces/face3.jpg",
          texto: "Artigo muito didático para quem está saindo do Vue 2 agora. Parabéns aos envolvidos!"
        }
      ]
    },
    {
      id: 2,
      titulo: "Guia de Otimização de Consultas SQL",
      categoria: "Banco de Dados",
      autor: "Carlos Eduardo",
      cargoAutor: "Especialista em Banco de Dados & Infra",
      colaboradores: [],
      status: "Rascunho",
      data: "18 de junho de 2026",
      tempoLeitura: "7 minutos de leitura",
      resumo: "Dicas essenciais para desenvolvedores juniores e plenos otimizarem suas queries, criarem índices inteligentes e evitarem gargalos.",
      conteudo: `A performance de banco de dados relacional muitas vezes define o sucesso ou gargalo de sistemas de alto tráfego.

### Análise de Planos de Execução
Utilizar EXPLAIN ANALYZE é o primeiro passo para identificar Sequential Scans em tabelas volumosas. Índices B-Tree compostos e índices parciais devem ser desenhados com base nos filtros WHERE e cláusulas ORDER BY mais frequentes.

### Evitando o Problema N+1
Muitos ORMs geram dezenas de queries desnecessárias ao carregar coleções filhas. O uso adequado de JOINs e batch queries reduz o overhead de conexão pela metade.`,
      citacao: "O índice certo não apenas acelera a leitura: poupa recursos de memória e IOPS vitais para a saúde da infraestrutura.",
      curtidas: 89,
      curtido: false,
      comentarios: [
        {
          id: 1,
          autor: "Lucas Almeida",
          tempo: "Há 1 dia",
          avatar: "assets/images/faces/face2.jpg",
          texto: "Muito bom, o exemplo de B-Tree ajudou bastante a resolver uma lentidão que tínhamos em produção."
        }
      ]
    },
    {
      id: 3,
      titulo: "Como a Inteligência Artificial modela o futuro",
      categoria: "Inteligência Artificial",
      autor: "Prof. Marcos Silva",
      cargoAutor: "Professor Titular de Inteligência Artificial",
      colaboradores: ["Dr. Roberto Lima"],
      status: "Publicado",
      data: "10 de junho de 2026",
      tempoLeitura: "10 minutos de leitura",
      resumo: "Uma análise abrangente sobre modelos fundacionais, automação cognitiva e os desafios éticos na ciência moderna.",
      conteudo: `Os modelos fundacionais redefiniram o panorama da computação contemporânea. Modelos generativos agora aceleram desde a descoberta de novos fármacos até o desenvolvimento de código seguro.

### Alinhamento e Ética em Pesquisa
Garantir alinhamento de intenção e mitigar alucinações cognitivas permanece como um dos maiores desafios em aberto na literatura de Machine Learning.

O papel das universidades e institutos de pesquisa na publicação de benchmarks abertos é o alicerce para uma tecnologia responsável.`,
      citacao: "O verdadeiro poder da IA não reside em substituir a cognição humana, mas em amplificar nossa capacidade de investigação científica.",
      curtidas: 312,
      curtido: false,
      comentarios: [
        {
          id: 1,
          autor: "Elsa Larson",
          tempo: "Há 3 dias",
          avatar: "assets/images/faces/face10.jpg",
          texto: "A reflexão sobre alinhamento ético é fundamental. Compartilhei com meus alunos de pós-graduação."
        }
      ]
    },
    {
      id: 4,
      titulo: "Introdução à Engenharia de Software Avançada",
      categoria: "Engenharia de Software",
      autor: "Dr. Fernando Dacanal",
      cargoAutor: "Doutor em Engenharia de Software",
      colaboradores: ["Daniel C.", "Luiz B."],
      status: "Publicado",
      data: "05 de junho de 2026",
      tempoLeitura: "8 minutos de leitura",
      resumo: "Práticas de arquitetura resiliente, microsserviços orientados a eventos e governança de software corporativo.",
      conteudo: `Projetar sistemas de grande porte exige uma visão holística que engloba desacoplamento arquitetural, observabilidade distribuída e cultura DevOps.

### Microsserviços e Event-Driven Architecture
A transição de monólitos para sistemas orientados a eventos permite escalabilidade independente, porém introduz complexidades de consistência eventual e tracing distribuído.`,
      citacao: "Uma arquitetura bem-sucedida é aquela que evolui com os requisitos do domínio com o mínimo de atrito possível.",
      curtidas: 245,
      curtido: false,
      comentarios: []
    }
  ];

  const DEFAULT_FORUMS = [
    {
      id: 1,
      nome: "Desenvolvimento Web",
      categoria: "Web & Front-end",
      descricao: "Discussões gerais sobre frameworks frontend, backend, arquitetura web e tendências de mercado.",
      status: "Ativo",
      topicosCount: 124,
      topicos: [
        { id: 101, titulo: "Como centralizar uma div?", autor: "Carlos dev", data: "Hoje às 14:20", respostas: 18 },
        { id: 102, titulo: "Vale a pena migrar para Nuxt 3 em 2026?", autor: "Lucas Almeida", data: "Ontem", respostas: 9 },
        { id: 103, titulo: "WebAssembly: performance real vs hype", autor: "Ana Silva", data: "Há 2 dias", respostas: 24 }
      ]
    },
    {
      id: 2,
      nome: "Banco de Dados & Storage",
      categoria: "Infraestrutura & Dados",
      descricao: "Fórum focado em bancos relacionais, NoSQL, indexação de alta escala e modelagem de dados.",
      status: "Ativo",
      topicosCount: 82,
      topicos: [
        { id: 201, titulo: "PostgreSQL vs CockroachDB para distribuição global", autor: "Carlos Eduardo", data: "Há 3 dias", respostas: 12 },
        { id: 202, titulo: "Melhores estratégias de sharding em bancos relacionais", autor: "Gustavo N.", data: "Há 4 dias", respostas: 7 }
      ]
    },
    {
      id: 3,
      nome: "Inteligência Artificial & Machine Learning",
      categoria: "IA & Ciência de Dados",
      descricao: "Pesquisa acadêmica e aplicações práticas de redes neurais, LLMs, visão computacional e NLP.",
      status: "Ativo",
      topicosCount: 56,
      topicos: [
        { id: 301, titulo: "Técnicas de quantização 4-bit para inferência local", autor: "Prof. Marcos Silva", data: "Há 1 dia", respostas: 15 },
        { id: 302, titulo: "Fine-tuning supervisionado vs DPO: benchmarks recentes", autor: "Sophia Rezende", data: "Há 3 dias", respostas: 8 }
      ]
    },
    {
      id: 4,
      nome: "Engenharia de Software & Práticas DevOps",
      categoria: "Processos & Arquitetura",
      descricao: "Boas práticas de código, CI/CD, microsserviços, governança e testes de software.",
      status: "Inativo",
      topicosCount: 39,
      topicos: [
        { id: 401, titulo: "Clean Architecture em microsserviços Go", autor: "Dr. Fernando Dacanal", data: "Há 1 semana", respostas: 14 }
      ]
    }
  ];

  const DEFAULT_DENUNCIAS = [
    { id: 1, autor: "Lucas Oliver", titulo: "O Impacto dos Buracos Negros", motivo: "Plágio Integral", categoria: "Plágio Integral", data: "2026-06-08" },
    { id: 2, autor: "Sophia Rezende", titulo: "A Nova Era dos Chips de Silício", motivo: "Fake News Científica", categoria: "Fake News Científica", data: "2026-06-09" },
    { id: 3, autor: "Enzo Almeida", titulo: "Entendendo o React sem Virtual DOM", motivo: "Linguagem Ofensiva", categoria: "Linguagem Ofensiva", data: "2026-06-09" }
  ];

  const DEFAULT_BANIDOS = [
    { id: 101, nome: "Gustavo Nogueira", email: "gustavo@exemplo.com", dataBan: "2026-05-15" },
    { id: 102, nome: "Camila Vilela", email: "camila@exemplo.com", dataBan: "2026-05-22" }
  ];

  const DEFAULT_USER = {
    nome: "Elsa Larson",
    email: "elsa.larson@noteg.com",
    role: "cientista", // 'cientista' | 'nao-cientista' | 'visitante' | 'admin'
    roleLabel: "Usuário Cientista",
    avatar: "assets/images/faces/face10.jpg"
  };

  // Helper functions for LocalStorage
  function getStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn("Storage error:", e);
      return fallback;
    }
  }

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
  }

  // Master Store Object
  window.NoteGStore = {
    // 1. ARTICLES
    getArticles: function () {
      return getStorage(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
    },

    getArticleById: function (id) {
      const articles = this.getArticles();
      return articles.find(a => a.id == id);
    },

    saveArticle: function (articleData) {
      const articles = this.getArticles();
      if (articleData.id) {
        // Edit
        const index = articles.findIndex(a => a.id == articleData.id);
        if (index !== -1) {
          articles[index] = { ...articles[index], ...articleData };
        }
      } else {
        // Create new
        const newId = articles.length ? Math.max(...articles.map(a => a.id)) + 1 : 1;
        const newArt = {
          id: newId,
          titulo: articleData.titulo,
          categoria: articleData.categoria || "Geral",
          autor: articleData.autor || this.getUser().nome,
          cargoAutor: "Cientista Credenciado",
          colaboradores: articleData.colaboradores || [],
          status: articleData.status || "Rascunho",
          data: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
          tempoLeitura: "4 minutos de leitura",
          resumo: articleData.resumo || articleData.conteudo.slice(0, 140) + '...',
          conteudo: articleData.conteudo,
          citacao: articleData.citacao || "",
          curtidas: 0,
          curtido: false,
          comentarios: []
        };
        articles.unshift(newArt);
      }
      setStorage(STORAGE_KEYS.ARTICLES, articles);
      return articles;
    },

    deleteArticle: function (id) {
      let articles = this.getArticles();
      articles = articles.filter(a => a.id != id);
      setStorage(STORAGE_KEYS.ARTICLES, articles);
      return articles;
    },

    toggleLike: function (articleId) {
      const articles = this.getArticles();
      const art = articles.find(a => a.id == articleId);
      if (art) {
        if (art.curtido) {
          art.curtido = false;
          art.curtidas = Math.max(0, art.curtidas - 1);
        } else {
          art.curtido = true;
          art.curtidas += 1;
        }
        setStorage(STORAGE_KEYS.ARTICLES, articles);
        return art;
      }
      return null;
    },

    addComment: function (articleId, texto) {
      const articles = this.getArticles();
      const art = articles.find(a => a.id == articleId);
      if (art) {
        const currentUser = this.getUser();
        const newComment = {
          id: Date.now(),
          autor: currentUser.nome,
          tempo: "Agora mesmo",
          avatar: currentUser.avatar,
          texto: texto
        };
        art.comentarios.unshift(newComment);
        setStorage(STORAGE_KEYS.ARTICLES, articles);
        return newComment;
      }
      return null;
    },

    // 2. FORUMS
    getForums: function () {
      return getStorage(STORAGE_KEYS.FORUMS, DEFAULT_FORUMS);
    },

    getForumById: function (id) {
      const forums = this.getForums();
      return forums.find(f => f.id == id);
    },

    saveForum: function (forumData) {
      const forums = this.getForums();
      const idx = forums.findIndex(f => f.id == forumData.id);
      if (idx !== -1) {
        forums[idx] = { ...forums[idx], ...forumData };
      }
      setStorage(STORAGE_KEYS.FORUMS, forums);
      return forums;
    },

    closeForum: function (id) {
      const forums = this.getForums();
      const f = forums.find(item => item.id == id);
      if (f) {
        f.status = "Inativo";
        setStorage(STORAGE_KEYS.FORUMS, forums);
      }
      return forums;
    },

    reopenForum: function (id) {
      const forums = this.getForums();
      const f = forums.find(item => item.id == id);
      if (f) {
        f.status = "Ativo";
        setStorage(STORAGE_KEYS.FORUMS, forums);
      }
      return forums;
    },

    addTopic: function (forumId, topicTitle, topicMessage) {
      const forums = this.getForums();
      const forum = forums.find(f => f.id == forumId);
      if (forum) {
        const currentUser = this.getUser();
        const newTopic = {
          id: Date.now(),
          titulo: topicTitle,
          autor: currentUser.nome,
          data: "Hoje às " + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          respostas: 0,
          mensagem: topicMessage
        };
        if (!forum.topicos) forum.topicos = [];
        forum.topicos.unshift(newTopic);
        forum.topicosCount = (forum.topicosCount || 0) + 1;
        setStorage(STORAGE_KEYS.FORUMS, forums);
        return newTopic;
      }
      return null;
    },

    // 3. DENÚNCIAS & MODERAÇÃO
    getDenuncias: function () {
      return getStorage(STORAGE_KEYS.DENUNCIAS, DEFAULT_DENUNCIAS);
    },

    addDenuncia: function (denunciaData) {
      const denuncias = this.getDenuncias();
      const newD = {
        id: Date.now(),
        autor: denunciaData.autor || "Autor Desconhecido",
        titulo: denunciaData.titulo || "Artigo sem título",
        motivo: denunciaData.motivo || "Conteúdo impróprio",
        categoria: denunciaData.categoria || "Geral",
        data: new Date().toISOString().split('T')[0]
      };
      denuncias.unshift(newD);
      setStorage(STORAGE_KEYS.DENUNCIAS, denuncias);
      return newD;
    },

    rejectDenuncia: function (id) {
      let denuncias = this.getDenuncias();
      denuncias = denuncias.filter(d => d.id != id);
      setStorage(STORAGE_KEYS.DENUNCIAS, denuncias);
      return denuncias;
    },

    banUserFromDenuncia: function (denunciaId) {
      let denuncias = this.getDenuncias();
      const den = denuncias.find(d => d.id == denunciaId);
      if (den) {
        denuncias = denuncias.filter(d => d.id != denunciaId);
        setStorage(STORAGE_KEYS.DENUNCIAS, denuncias);

        let banidos = this.getBanidos();
        const newBan = {
          id: Date.now() % 10000,
          nome: den.autor,
          email: `${den.autor.toLowerCase().replace(/[^a-z]/g, '')}@exemplo.com`,
          dataBan: new Date().toISOString().split('T')[0]
        };
        banidos.push(newBan);
        setStorage(STORAGE_KEYS.BANIDOS, banidos);
        return newBan;
      }
      return null;
    },

    // 4. BANIDOS
    getBanidos: function () {
      return getStorage(STORAGE_KEYS.BANIDOS, DEFAULT_BANIDOS);
    },

    unbanUser: function (id) {
      let banidos = this.getBanidos();
      banidos = banidos.filter(b => b.id != id);
      setStorage(STORAGE_KEYS.BANIDOS, banidos);
      return banidos;
    },

    // 5. USER & ROLE MANAGEMENT
    getUser: function () {
      return getStorage(STORAGE_KEYS.USER, DEFAULT_USER);
    },

    setUser: function (userData) {
      const user = { ...this.getUser(), ...userData };
      setStorage(STORAGE_KEYS.USER, user);
      this.notifyUserChanged();
      return user;
    },

    setRole: function (role) {
      const user = this.getUser();
      user.role = role;
      const roleLabels = {
        'visitante': 'Visitante (Não autenticado)',
        'nao-cientista': 'Usuário Comum',
        'cientista': 'Usuário Cientista',
        'admin': 'Administrador'
      };
      user.roleLabel = roleLabels[role] || 'Usuário Cientista';
      setStorage(STORAGE_KEYS.USER, user);
      this.notifyUserChanged();
      return user;
    },

    logout: function () {
      return this.setRole('visitante');
    },

    notifyUserChanged: function () {
      // Dispatches custom event for reactive UI updates
      window.dispatchEvent(new CustomEvent('noteg_user_changed', { detail: this.getUser() }));
    }
  };

  // Ensure notification helper is globally ready
  window.showToastNotification = function (message, type) {
    let container = document.getElementById('custom-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'custom-toast-container';
      container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:99999; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    const borderColor = type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#a855f7';
    toast.style.cssText = `
      background-color: var(--card-bg, #ffffff);
      color: var(--text-color, #1f2937);
      border-left: 4px solid ${borderColor};
      border-radius: 6px;
      padding: 14px 20px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      font-size: 13.5px;
      font-weight: 500;
      min-width: 260px;
      max-width: 380px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      pointer-events: auto;
      animation: toastSlideIn 0.3s ease forwards;
    `;

    toast.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <i class="mdi ${type === 'error' ? 'mdi-alert-circle text-danger' : 'mdi-check-circle text-success'}" style="font-size:18px;"></i>
        <span>${message}</span>
      </div>
      <span style="cursor:pointer; font-weight:bold; margin-left:15px; font-size:16px; opacity:0.6;" onclick="this.parentElement.remove()">&times;</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastFadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };
})();
