export const campanha = {
  // Identificação
  codigo: "santa_catarina_2026",
  nome: "Santa Catarina: Um Brasil à Parte",

  // Evento
  dataEvento: "2026-08-13T20:00:00-03:00",

  // Bitrix
  pipeline: 36,
  etapaInicial: "C36:NEW",
  etapaCorretorAtivo: "C36:UC_YMK87P",
  etapaDuplicado: "C36:FINAL_INVOICE",
  etapaValidado: "C36:UC_6S348W",
  nomeLead: "Lead Live",

  // IDs genéricos usados no link de indicador das campanhas de marketing
  // (sem corretor específico atribuído ainda)
  indicadoresMarketing: ["324", "366", "590", "194", "13964"],

  // Marketing
  grupoWhatsapp: "https://chat.whatsapp.com/IMy5qbIEOev5dcNbn9cBYf",
  pixelMeta: "870653505969793",

  // Transmissão (página /assista)
  // TODO: trocar pelo ID real do vídeo/live do YouTube quando estiver pronto
  youtubeVideoId: "SrL0-74iEO8",

  // SEO
  tituloSite: "Santa Catarina: Um Brasil à Parte",
  descricao:
    "Águia & Santer apresentam: uma análise exclusiva com um convidado surpresa.",

  // Hero
  imagemDesktop: "/capa.webp",
  imagemMobile: "/capa-mobile.webp",

  // Selo acima do contador
  selo: "AO VIVO | 13 DE AGOSTO | 20h",
  seloDestaque: "VAGAS LIMITADAS | 100% GRATUITO",

  // Formulário
  tituloFormulario: "Aproveite a oferta",
  subtituloFormulario:
    "Deixe suas informações de contato e entraremos em contato com você.",

  // Pontos-chave (seção "Sobre o evento")
  pontosChave: [
    {
      titulo: "Por que o Litoral Norte cresce",
      texto:
        "Você vai entender os fundamentos por trás da valorização: crescimento qualificado, infraestrutura logística, turismo constante e alta demanda por imóveis de padrão elevado. Não é tendência passageira, é movimento estruturado.",
    },
    {
      titulo: "Turismo e renda previsível",
      texto:
        "O fluxo permanente de visitantes reduz a sazonalidade e fortalece a ocupação ao longo do ano. Isso impacta liquidez, previsibilidade e estabilidade de retorno.",
    },
    {
      titulo: "Como os inteligentes estão investindo",
      texto:
        "Investidores estratégicos se antecipam a ciclos. Você verá como estão se posicionando, quais ativos priorizam e como estruturam decisões para potencializar valorização e renda.",
    },
    {
      titulo: "Oportunidades e riscos reais",
      texto:
        "Nem todo lançamento é oportunidade. Vamos mostrar critérios claros para diferenciar fundamento de marketing e identificar ativos com potencial consistente.",
    },
  ],

  // Palestrantes (seção "Quem vai conduzir o evento")
  palestrantes: [
    {
      nome: "Convidado Surpresa",
      cargo: "Em breve revelamos quem é",
      foto: "/palestrantes/ricardo-amorim.webp",
      bio: "Uma participação especial que ainda é segredo. Fica de olho — em breve contamos quem vai se juntar a Sandro Lucas e Eduardo Schuster nessa live exclusiva.",
    },
    {
      nome: "Sandro Lucas",
      cargo: "CEO da Águia Consultoria Imobiliária",
      foto: "/palestrantes/sandro-lucas.webp",
      bio: "Especialista em estruturação de investimentos imobiliários no Sul do Brasil, com atuação direta em projetos de alto padrão e estratégias voltadas à valorização inteligente de patrimônio.",
    },
    {
      nome: "Eduardo Schuster",
      cargo: "CEO da Santer Empreendimentos",
      foto: "/palestrantes/eduardo-schuster.webp",
      bio: "À frente de uma das maiores incorporadoras de SC, compartilha os planos que estão por trás da nova fase do litoral.",
    },
  ],

  // Obrigado
  tituloObrigado: "Inscrição concluída!",
};
