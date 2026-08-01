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
  etapaDuplicado: "C36:LOSE",
  etapaValidado: "C36:UC_6S348W",
  nomeLead: "Lead Live",

  // IDs genéricos usados no link de indicador das campanhas de marketing
  // (sem corretor específico atribuído ainda) — todos os itens da planilha
  // de rastreio, exceto panfleto físico e outdoor (esses têm responsável
  // específico, não contam como "lead do marketing" pra essa regra).
  indicadoresMarketing: [
    "13966",
    "324",
    "322",
    "320",
    "590",
    "13964",
    "366",
    "12094",
    "8178",
    "8180",
    "2082",
    "3580",
    "954",
    "9056",
    "8386",
  ],

  // Mapa indicador (link /r/<id>) -> nome da origem/página de rastreio,
  // pra preencher o campo "Origem de Rastreio" no Bitrix automaticamente.
  origensRastreio: {
    "194": "PANFLETO FÍSICO PIÇARRAS",
    "210": "PANFLETO FÍSICO JOINVILLE",
    "7462": "OUTDOOR JOINVILLE",
    "7720": "OUTDOOR PIÇARRAS",
    "13966": "SHOPPING GARTEN - DIGITAL",
    "324": "META ADS AGUIA",
    "322": "META ADS LUAN",
    "320": "META ADS SANDRO",
    "590": "META ADS RECONHECIMENTO",
    "13964": "YOUTUBE ADS",
    "366": "COMUNIDADES",
    "12094": "INSTAGRAM ORGANICO",
    "8178": "INSTAGRAM PALESTRANTE (STORY)",
    "8180": "MESA SHOPPING MUELLER",
    "2082": "SHOPPING IGUATEMI - SP",
    "3580": "BALNEÁRIO SHOPPING - BC",
    "954": "SHOPPING BATEL - CWB",
    "9056": "PEDÁGIO BARRA VELHA",
    "8386": "DISPARO WHATSAPP E MAILING",
    "5458": "BASE SANTER",
  },

  // Marketing
  grupoWhatsapp: "https://chat.whatsapp.com/IMy5qbIEOev5dcNbn9cBYf",
  pixelMeta: "870653505969793",

  // Transmissão (página /assista)
  // TODO: trocar pelo ID real do vídeo/live do YouTube quando estiver pronto
  youtubeVideoId: "9wupgBqL7pk",

  // SEO
  tituloSite: "Santa Catarina: Um Brasil à Parte",
  descricao:
    "Águia & Santer apresentam: uma análise exclusiva com Ricardo Amorim.",

  // Hero
  imagemDesktop: "/capa.a3bce559.webp",
  imagemMobile: "/capa-mobile.95300fc8.webp",

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
      nome: "Ricardo Amorim",
      cargo: "Participação exclusiva",
      foto: "/palestrantes/ricardo-amorim.04a6eb71.webp",
      bio: "Economista mais influente do Brasil, Ricardo Amorim decifrou a complexidade do mercado para guiar milhares de investidores. Hoje, à frente da Ricam Consultoria, antecipa tendências para novos líderes. Lenda da economia.",
    },
    {
      nome: "Sandro Lucas",
      cargo: "CEO da Águia Consultoria Imobiliária",
      foto: "/palestrantes/sandro-lucas.41143416.webp",
      bio: "Especialista em estruturação de investimentos imobiliários no Sul do Brasil, com atuação direta em projetos de alto padrão e estratégias voltadas à valorização inteligente de patrimônio.",
    },
    {
      nome: "Eduardo Schuster",
      cargo: "CEO da Santer Empreendimentos",
      foto: "/palestrantes/eduardo-schuster.2f0fb16c.webp",
      bio: "À frente de uma das maiores incorporadoras de SC, compartilha os planos que estão por trás da nova fase do litoral.",
    },
  ],

  // Obrigado
  tituloObrigado: "Inscrição concluída!",
};
