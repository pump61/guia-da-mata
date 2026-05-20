// data/agricultural/cultures.js
// Banco de dados de culturas — Manual ES/BA 5ª Aproximação
// adubacaoPlantio usa 3 classes: baixo | medio | alto (baseado em P e K do solo)

export const cultures = {

  // ==================== CAFEEIRO ====================
  cafe_arabica: {
    id: 'cafe_arabica',
    nome: 'Café Arábica',
    nomeCientifico: 'Coffea arabica',
    categoria: 'Cafeeiro',
    tipo: 'perene',
    ciclo: 'Perene (20–25 anos)',
    espacamentoPadrao: { linha: 3.5, planta: 0.8 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 120, medio: 80, alto: 40 },
      K2O:  { baixo: 100, medio: 70, alto: 40 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3–4 aplicações durante o ano (período de chuvas)',
      N: 120, K2O: 100,
    },
    micronutrientes: { Zn: 2.0, B: 1.5, Cu: 1.0 },
    observacoes: 'Calagem essencial para pH 5,5–6,0. Análise foliar anual recomendada.',
  },

  cafe_conilon: {
    id: 'cafe_conilon',
    nome: 'Café Conilon',
    nomeCientifico: 'Coffea canephora',
    categoria: 'Cafeeiro',
    tipo: 'perene',
    ciclo: 'Perene (20–25 anos)',
    espacamentoPadrao: { linha: 3.0, planta: 1.0 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 100, medio: 70, alto: 40 },
      K2O:  { baixo: 90,  medio: 60, alto: 35 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3–4 aplicações durante o período chuvoso',
      N: 100, K2O: 90,
    },
    micronutrientes: { Zn: 2.0, B: 1.5, Cu: 1.0 },
    observacoes: 'Mais tolerante à acidez que o arábica. Exige irrigação suplementar.',
  },

  // ==================== FRUTEIRAS ====================
  abacate: {
    id: 'abacate',
    nome: 'Abacate',
    nomeCientifico: 'Persea americana',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (4–5 anos para produção)',
    espacamentoPadrao: { linha: 8, planta: 7 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 50,
      P2O5: { baixo: 120, medio: 80, alto: 40 },
      K2O:  { baixo: 100, medio: 70, alto: 40 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 2–3 aplicações anuais',
      N: 80, K2O: 70,
    },
    micronutrientes: { Zn: 2.0, B: 1.0, Cu: 1.0 },
    observacoes: 'Sensível ao encharcamento. Manter V% ≥ 65%.',
  },

  abacaxi: {
    id: 'abacaxi',
    nome: 'Abacaxi',
    nomeCientifico: 'Ananas comosus',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (12–18 meses por ciclo)',
    espacamentoPadrao: { linha: 0.9, planta: 0.3 },
    vIdeal: 55,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 90,  medio: 60, alto: 30 },
      K2O:  { baixo: 120, medio: 80, alto: 50 },
    },
    adubacaoCobertura: {
      descricao: 'Via foliar ou solo, parcelada ao longo do ciclo',
      N: 60, K2O: 100,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Alta exigência em K. Tolera solos ácidos (pH 4,5–5,5).',
  },

  acerola: {
    id: 'acerola',
    nome: 'Acerola',
    nomeCientifico: 'Malpighia emarginata',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (2–3 anos para produção)',
    espacamentoPadrao: { linha: 5, planta: 4 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 100, medio: 70, alto: 35 },
      K2O:  { baixo: 80,  medio: 60, alto: 30 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 2–4 aplicações por ano',
      N: 60, K2O: 60,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Rústica; adapta-se bem ao Nordeste. Alta produção de vitamina C.',
  },

  banana: {
    id: 'banana',
    nome: 'Banana',
    nomeCientifico: 'Musa spp.',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (10–15 anos)',
    espacamentoPadrao: { linha: 3, planta: 3 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 80,  medio: 60, alto: 30 },
      K2O:  { baixo: 100, medio: 80, alto: 50 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 4–5 aplicações durante o ano',
      N: 120, K2O: 200,
    },
    micronutrientes: { Zn: 2.0, B: 1.5 },
    observacoes: 'Altamente exigente em K. Manter cobertura morta no solo.',
  },

  citros: {
    id: 'citros',
    nome: 'Citros',
    nomeCientifico: 'Citrus spp.',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (3–4 anos para produção)',
    espacamentoPadrao: { linha: 7, planta: 5 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 100, medio: 70, alto: 40 },
      K2O:  { baixo: 80,  medio: 60, alto: 40 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3–4 aplicações anuais',
      N: 100, K2O: 80,
    },
    micronutrientes: { Zn: 2.0, B: 1.0, Cu: 1.5 },
    observacoes: 'Exige Ca e Mg adequados. Análise foliar bienal recomendada.',
  },

  coco: {
    id: 'coco',
    nome: 'Coco',
    nomeCientifico: 'Cocos nucifera',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (4–5 anos para produção)',
    espacamentoPadrao: { linha: 9, planta: 9 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 50,
      P2O5: { baixo: 80,  medio: 60, alto: 30 },
      K2O:  { baixo: 120, medio: 90, alto: 60 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3–4 aplicações anuais',
      N: 80, K2O: 120,
    },
    micronutrientes: { Zn: 1.5, B: 1.0, Cu: 1.0 },
    observacoes: 'Alta exigência em K e Cl. Resistente a solos arenosos costeiros.',
  },

  goiaba: {
    id: 'goiaba',
    nome: 'Goiaba',
    nomeCientifico: 'Psidium guajava',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (2–3 anos para produção)',
    espacamentoPadrao: { linha: 7, planta: 5 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 50,
      P2O5: { baixo: 100, medio: 70, alto: 35 },
      K2O:  { baixo: 100, medio: 70, alto: 40 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 2–4 aplicações anuais',
      N: 80, K2O: 80,
    },
    micronutrientes: { Zn: 2.0, B: 1.0 },
    observacoes: 'Rústica; tolera solos de fertilidade média. Poda anual recomendada.',
  },

  mamao: {
    id: 'mamao',
    nome: 'Mamão',
    nomeCientifico: 'Carica papaya',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (6–8 meses para produção)',
    espacamentoPadrao: { linha: 3.6, planta: 2.0 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 120, medio: 80, alto: 40 },
      K2O:  { baixo: 100, medio: 70, alto: 40 },
    },
    adubacaoCobertura: {
      descricao: 'Quinzenal nos primeiros 6 meses, mensal após',
      N: 100, K2O: 100,
    },
    micronutrientes: { Zn: 2.0, B: 1.5 },
    observacoes: 'Sensível ao encharcamento e à salinidade. Exige drenagem.',
  },

  manga: {
    id: 'manga',
    nome: 'Manga',
    nomeCientifico: 'Mangifera indica',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (3–5 anos para produção)',
    espacamentoPadrao: { linha: 10, planta: 8 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 50,
      P2O5: { baixo: 80,  medio: 60, alto: 30 },
      K2O:  { baixo: 80,  medio: 60, alto: 30 },
    },
    adubacaoCobertura: {
      descricao: 'Aplicada após a colheita e no início da floração',
      N: 80, K2O: 80,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Tolerante à seca. Floração induzida por estresse hídrico.',
  },

  maracuja: {
    id: 'maracuja',
    nome: 'Maracujá',
    nomeCientifico: 'Passiflora edulis',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (2–3 anos produtivos)',
    espacamentoPadrao: { linha: 3.5, planta: 4.0 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 100, medio: 70, alto: 40 },
      K2O:  { baixo: 100, medio: 70, alto: 40 },
    },
    adubacaoCobertura: {
      descricao: 'Mensal nos 6 primeiros meses, bimestral após',
      N: 80, K2O: 80,
    },
    micronutrientes: { Zn: 2.0, B: 1.5 },
    observacoes: 'Alta exigência em K e Mg. Sensível à deficiência de B.',
  },

  uva: {
    id: 'uva',
    nome: 'Uva',
    nomeCientifico: 'Vitis vinifera / V. labrusca',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (3–4 anos para produção)',
    espacamentoPadrao: { linha: 3, planta: 1.5 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 80,  medio: 60, alto: 30 },
      K2O:  { baixo: 80,  medio: 60, alto: 30 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3 aplicações: brotação, floração e pós-colheita',
      N: 60, K2O: 60,
    },
    micronutrientes: { Zn: 2.0, B: 1.5, Cu: 1.5 },
    observacoes: 'Exige pH 5,5–6,5 e drenagem adequada. Análise foliar anual.',
  },

  cacau: {
    id: 'cacau',
    nome: 'Cacau',
    nomeCientifico: 'Theobroma cacao',
    categoria: 'Fruteiras',
    tipo: 'perene',
    ciclo: 'Perene (3–4 anos para produção)',
    espacamentoPadrao: { linha: 3.5, planta: 2.5 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 30,
      P2O5: { baixo: 120, medio: 80, alto: 40 },
      K2O:  { baixo: 110, medio: 70, alto: 35 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3–4 aplicações anuais no início das chuvas',
      N: 80, K2O: 70,
    },
    micronutrientes: { Zn: 2.0, B: 1.5, Cu: 1.5 },
    observacoes: 'Cultivo consorciado com espécies sombreadoras. Alta exigência em K.',
  },

  // ==================== OLERÍCOLAS ====================
  alface: {
    id: 'alface',
    nome: 'Alface',
    nomeCientifico: 'Lactuca sativa',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (50–70 dias)',
    espacamentoPadrao: { linha: 0.3, planta: 0.3 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 150,
      P2O5: { baixo: 400, medio: 250, alto: 120 },
      K2O:  { baixo: 200, medio: 150, alto: 80  },
    },
    adubacaoCobertura: {
      descricao: 'Aplicar N parcelado em 2 coberturas',
      N: 80, K2O: 60,
    },
    micronutrientes: { B: 1.5, Zn: 2.0 },
    observacoes: 'Sensível a temperaturas altas. Exige solo bem drenado e rico em MO.',
  },

  alho: {
    id: 'alho',
    nome: 'Alho',
    nomeCientifico: 'Allium sativum',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (90–120 dias)',
    espacamentoPadrao: { linha: 0.2, planta: 0.1 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 100,
      P2O5: { baixo: 350, medio: 250, alto: 100 },
      K2O:  { baixo: 180, medio: 120, alto: 70  },
    },
    adubacaoCobertura: {
      descricao: 'N parcelado em 2–3 coberturas ao longo do ciclo',
      N: 60, K2O: 50,
    },
    micronutrientes: { B: 1.0, Zn: 1.5 },
    observacoes: 'Exige solos bem drenados. Sensível ao Al; pH ideal 5,5–6,5.',
  },

  batata: {
    id: 'batata',
    nome: 'Batata',
    nomeCientifico: 'Solanum tuberosum',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (90–120 dias)',
    espacamentoPadrao: { linha: 0.8, planta: 0.3 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 150,
      P2O5: { baixo: 500, medio: 300, alto: 150 },
      K2O:  { baixo: 250, medio: 180, alto: 100 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N e K na amontoa (30–40 dias)',
      N: 80, K2O: 100,
    },
    micronutrientes: { B: 1.5, Zn: 2.0, Cu: 1.5 },
    observacoes: 'Alta demanda em P e K. pH ideal 5,0–6,0. Rotação essencial.',
  },

  cebola: {
    id: 'cebola',
    nome: 'Cebola',
    nomeCientifico: 'Allium cepa',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (90–120 dias)',
    espacamentoPadrao: { linha: 0.2, planta: 0.1 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 120,
      P2O5: { baixo: 300, medio: 200, alto: 100 },
      K2O:  { baixo: 200, medio: 150, alto: 80  },
    },
    adubacaoCobertura: {
      descricao: 'N parcelado em 2–3 coberturas',
      N: 60, K2O: 60,
    },
    micronutrientes: { B: 1.0, Zn: 1.5 },
    observacoes: 'Exige solos bem drenados e pH 6,0–6,5. Sensível a S.',
  },

  melancia: {
    id: 'melancia',
    nome: 'Melancia',
    nomeCientifico: 'Citrullus lanatus',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (70–100 dias)',
    espacamentoPadrao: { linha: 3, planta: 1.5 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 200, medio: 130, alto: 60 },
      K2O:  { baixo: 150, medio: 100, alto: 60 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N e K na floração e frutificação',
      N: 60, K2O: 80,
    },
    micronutrientes: { B: 1.5, Zn: 1.5 },
    observacoes: 'Tolerante a solos arenosos e ao calor. pH ideal 6,0–7,0.',
  },

  melao: {
    id: 'melao',
    nome: 'Melão',
    nomeCientifico: 'Cucumis melo',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (70–90 dias)',
    espacamentoPadrao: { linha: 2, planta: 0.5 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 200, medio: 130, alto: 60 },
      K2O:  { baixo: 150, medio: 100, alto: 60 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura parcelada em 2–3 aplicações no ciclo',
      N: 60, K2O: 80,
    },
    micronutrientes: { B: 1.5, Zn: 1.5 },
    observacoes: 'Tolerante à seca. Exige boa drenagem e pH 6,0–7,0.',
  },

  pepino: {
    id: 'pepino',
    nome: 'Pepino',
    nomeCientifico: 'Cucumis sativus',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (45–70 dias)',
    espacamentoPadrao: { linha: 1, planta: 0.5 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 80,
      P2O5: { baixo: 250, medio: 160, alto: 80 },
      K2O:  { baixo: 150, medio: 100, alto: 60 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N e K na floração',
      N: 60, K2O: 60,
    },
    micronutrientes: { B: 1.5, Zn: 2.0 },
    observacoes: 'Exige MO elevada e boa capacidade de retenção de água.',
  },

  pimentao: {
    id: 'pimentao',
    nome: 'Pimentão',
    nomeCientifico: 'Capsicum annuum',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (90–150 dias)',
    espacamentoPadrao: { linha: 1, planta: 0.5 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 100,
      P2O5: { baixo: 300, medio: 200, alto: 100 },
      K2O:  { baixo: 200, medio: 150, alto: 80  },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3–4 coberturas durante o ciclo',
      N: 80, K2O: 80,
    },
    micronutrientes: { B: 1.5, Zn: 2.0, Ca: 0 },
    observacoes: 'Sensível à deficiência de Ca (podridão apical). pH ideal 6,0–6,5.',
  },

  quiabo: {
    id: 'quiabo',
    nome: 'Quiabo',
    nomeCientifico: 'Abelmoschus esculentus',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (55–75 dias)',
    espacamentoPadrao: { linha: 1, planta: 0.5 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 80,
      P2O5: { baixo: 200, medio: 140, alto: 70 },
      K2O:  { baixo: 150, medio: 100, alto: 60 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N aos 30 dias após emergência',
      N: 50, K2O: 50,
    },
    micronutrientes: { B: 1.0, Zn: 1.5 },
    observacoes: 'Adaptado ao clima quente. Tolerante a solos de textura média.',
  },

  tomate: {
    id: 'tomate',
    nome: 'Tomate',
    nomeCientifico: 'Solanum lycopersicum',
    categoria: 'Olerícolas',
    tipo: 'hortalica',
    ciclo: 'Anual (90–120 dias)',
    espacamentoPadrao: { linha: 1, planta: 0.5 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: 190,
      P2O5: { baixo: 450, medio: 300, alto: 140 },
      K2O:  { baixo: 270, medio: 180, alto: 90  },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3–4 coberturas durante o ciclo',
      N: 80, K2O: 60,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Exigente em Ca. Calagem essencial para evitar podridão apical.',
  },

  // ==================== FORRAGEIRAS ====================
  capim_coloniao: {
    id: 'capim_coloniao',
    nome: 'Capim Colonião',
    nomeCientifico: 'Panicum maximum',
    categoria: 'Forrageiras',
    tipo: 'forrageira',
    ciclo: 'Perene',
    espacamentoPadrao: { linha: 1, planta: 0.5 },
    vIdeal: 40,
    adubacaoPlantio: {
      N: 30,
      P2O5: { baixo: 70,  medio: 50, alto: 25 },
      K2O:  { baixo: 70,  medio: 50, alto: 25 },
    },
    adubacaoCobertura: {
      descricao: 'N após cada corte ou pastejo (30–40 kg/ha)',
      N: 40, K2O: 30,
    },
    micronutrientes: { Zn: 1.0, B: 0.5 },
    observacoes: 'Excelente produção de matéria seca. Exige solos de média a alta fertilidade.',
  },

  capim_jaragua: {
    id: 'capim_jaragua',
    nome: 'Capim Jaraguá',
    nomeCientifico: 'Hyparrhenia rufa',
    categoria: 'Forrageiras',
    tipo: 'forrageira',
    ciclo: 'Perene',
    espacamentoPadrao: { linha: 1, planta: 0.5 },
    vIdeal: 35,
    adubacaoPlantio: {
      N: 20,
      P2O5: { baixo: 50,  medio: 30, alto: 15 },
      K2O:  { baixo: 50,  medio: 30, alto: 15 },
    },
    adubacaoCobertura: {
      descricao: 'N após corte ou pastejo (20–30 kg/ha)',
      N: 25, K2O: 20,
    },
    micronutrientes: { Zn: 1.0, B: 0.5 },
    observacoes: 'Tolerante a solos pobres e ácidos. Boa produção no período seco.',
  },

  capim_napier: {
    id: 'capim_napier',
    nome: 'Capim Napier (Elefante)',
    nomeCientifico: 'Pennisetum purpureum',
    categoria: 'Forrageiras',
    tipo: 'forrageira',
    ciclo: 'Perene',
    espacamentoPadrao: { linha: 1.5, planta: 0.5 },
    vIdeal: 45,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 80,  medio: 55, alto: 25 },
      K2O:  { baixo: 80,  medio: 55, alto: 25 },
    },
    adubacaoCobertura: {
      descricao: 'N após cada corte (40–60 kg/ha)',
      N: 50, K2O: 40,
    },
    micronutrientes: { Zn: 1.5, B: 0.5 },
    observacoes: 'Alta produção de biomassa. Exige boa fertilidade e umidade.',
  },

  // ==================== CULTURAS PERMANENTES ====================
  pimenta_do_reino: {
    id: 'pimenta_do_reino',
    nome: 'Pimenta-do-reino',
    nomeCientifico: 'Piper nigrum',
    categoria: 'Permanentes',
    tipo: 'perene',
    ciclo: 'Perene (2–3 anos para produção)',
    espacamentoPadrao: { linha: 3, planta: 3 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 150, medio: 100, alto: 50 },
      K2O:  { baixo: 150, medio: 100, alto: 60 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 3–4 aplicações anuais',
      N: 80, K2O: 80,
    },
    micronutrientes: { Zn: 2.0, B: 1.5, Cu: 1.0 },
    observacoes: 'Susceptível à Fusarium. Exige tutores e boa drenagem.',
  },

  pupunha: {
    id: 'pupunha',
    nome: 'Pupunha',
    nomeCientifico: 'Bactris gasipaes',
    categoria: 'Permanentes',
    tipo: 'perene',
    ciclo: 'Perene (18 meses para palmito)',
    espacamentoPadrao: { linha: 2, planta: 1 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 80,
      P2O5: { baixo: 120, medio: 80, alto: 40 },
      K2O:  { baixo: 100, medio: 70, alto: 40 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 4–6 aplicações anuais',
      N: 60, K2O: 60,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Tolerante à acidez. Exige umidade. Muito produtiva em palmito.',
  },

  urucum: {
    id: 'urucum',
    nome: 'Urucum',
    nomeCientifico: 'Bixa orellana',
    categoria: 'Permanentes',
    tipo: 'perene',
    ciclo: 'Perene (2–3 anos para produção)',
    espacamentoPadrao: { linha: 4, planta: 4 },
    vIdeal: 55,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 80,  medio: 60, alto: 30 },
      K2O:  { baixo: 60,  medio: 40, alto: 20 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 2 aplicações anuais',
      N: 30, K2O: 30,
    },
    micronutrientes: { Zn: 1.0, B: 0.5 },
    observacoes: 'Rústico; tolera solos pobres e ácidos. Cultura promissora para o Nordeste.',
  },

  // ==================== CULTURAS TEMPORÁRIAS ====================
  milho: {
    id: 'milho',
    nome: 'Milho',
    nomeCientifico: 'Zea mays',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual (90–120 dias)',
    espacamentoPadrao: { linha: 0.8, planta: 0.2 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 80,
      P2O5: { baixo: 200, medio: 130, alto: 70 },
      K2O:  { baixo: 140, medio: 90,  alto: 50 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N aos 30–40 dias (V4–V6)',
      N: 60, K2O: 0,
    },
    micronutrientes: { Zn: 2.0 },
    observacoes: 'Cultura exigente em N. Fazer rotação com leguminosas.',
  },

  soja: {
    id: 'soja',
    nome: 'Soja',
    nomeCientifico: 'Glycine max',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual (100–140 dias)',
    espacamentoPadrao: { linha: 0.5, planta: 0.1 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 0,
      P2O5: { baixo: 95,  medio: 70,  alto: 30 },
      K2O:  { baixo: 130, medio: 90,  alto: 40 },
    },
    adubacaoCobertura: null,
    micronutrientes: { Mo: 0.05, Co: 0.01 },
    observacoes: 'Fazer inoculação das sementes. Não necessita N mineral. V% ≥ 60%.',
  },

  feijao: {
    id: 'feijao',
    nome: 'Feijão',
    nomeCientifico: 'Phaseolus vulgaris',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual (70–100 dias)',
    espacamentoPadrao: { linha: 0.5, planta: 0.2 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 20,
      P2O5: { baixo: 100, medio: 70,  alto: 35 },
      K2O:  { baixo: 80,  medio: 55,  alto: 25 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N aos 20–25 dias após emergência',
      N: 40, K2O: 0,
    },
    micronutrientes: { Zn: 1.5, B: 1.0, Mo: 0.02 },
    observacoes: 'Fixador de N (inoculação recomendada). Sensível à toxidez de Al.',
  },

  mandioca: {
    id: 'mandioca',
    nome: 'Mandioca',
    nomeCientifico: 'Manihot esculenta',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual/Bianual (8–18 meses)',
    espacamentoPadrao: { linha: 1, planta: 0.6 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 80,  medio: 60,  alto: 30 },
      K2O:  { baixo: 80,  medio: 60,  alto: 30 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com K aos 3–4 meses após plantio',
      N: 0, K2O: 60,
    },
    micronutrientes: { Zn: 1.5, B: 0.5 },
    observacoes: 'Tolerante a solos ácidos e pobres. Colheita escalonada possível.',
  },

  cana_de_acucar: {
    id: 'cana_de_acucar',
    nome: 'Cana-de-açúcar',
    nomeCientifico: 'Saccharum officinarum',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual/Plurianual (12–18 meses)',
    espacamentoPadrao: { linha: 1.4, planta: 0.5 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 80,
      P2O5: { baixo: 120, medio: 80,  alto: 40 },
      K2O:  { baixo: 120, medio: 80,  alto: 40 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N+K no perfilhamento (3–4 meses)',
      N: 60, K2O: 80,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Exige solos profundos e bem drenados. Alta demanda em K.',
  },

  arroz: {
    id: 'arroz',
    nome: 'Arroz',
    nomeCientifico: 'Oryza sativa',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual (100–130 dias)',
    espacamentoPadrao: { linha: 0.35, planta: 0.15 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: 80,
      P2O5: { baixo: 80,  medio: 60,  alto: 30 },
      K2O:  { baixo: 60,  medio: 40,  alto: 20 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N no perfilhamento (30–40 dias)',
      N: 40, K2O: 0,
    },
    micronutrientes: { Zn: 2.0 },
    observacoes: 'Tolerante à acidez (pH 4,5–6,0). V% ≥ 50% para cultivares melhoradas.',
  },

  amendoim: {
    id: 'amendoim',
    nome: 'Amendoim',
    nomeCientifico: 'Arachis hypogaea',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual (90–120 dias)',
    espacamentoPadrao: { linha: 0.7, planta: 0.15 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 30,
      P2O5: { baixo: 100, medio: 70,  alto: 35 },
      K2O:  { baixo: 80,  medio: 55,  alto: 25 },
    },
    adubacaoCobertura: null,
    micronutrientes: { B: 1.0, Zn: 1.5, Mo: 0.02 },
    observacoes: 'Fixador de N; inoculação recomendada. Exige Ca para os frutos.',
  },

  girassol: {
    id: 'girassol',
    nome: 'Girassol',
    nomeCientifico: 'Helianthus annuus',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual (90–120 dias)',
    espacamentoPadrao: { linha: 0.7, planta: 0.3 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 80,  medio: 60,  alto: 30 },
      K2O:  { baixo: 80,  medio: 60,  alto: 30 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N no estádio V4–V6',
      N: 40, K2O: 0,
    },
    micronutrientes: { B: 2.0, Zn: 1.5 },
    observacoes: 'Alta exigência em B. Sensível ao encharcamento.',
  },

  sorgo: {
    id: 'sorgo',
    nome: 'Sorgo Granífero',
    nomeCientifico: 'Sorghum bicolor',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual (100–130 dias)',
    espacamentoPadrao: { linha: 0.7, planta: 0.12 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 80,  medio: 55,  alto: 25 },
      K2O:  { baixo: 70,  medio: 50,  alto: 25 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N no perfilhamento',
      N: 40, K2O: 0,
    },
    micronutrientes: { Zn: 2.0 },
    observacoes: 'Tolerante à seca e ao Al. Boa alternativa para solos de Cerrado.',
  },

  mamona: {
    id: 'mamona',
    nome: 'Mamona',
    nomeCientifico: 'Ricinus communis',
    categoria: 'Temporárias',
    tipo: 'anual',
    ciclo: 'Anual (180–210 dias)',
    espacamentoPadrao: { linha: 3, planta: 1 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 60,  medio: 40,  alto: 20 },
      K2O:  { baixo: 60,  medio: 40,  alto: 20 },
    },
    adubacaoCobertura: {
      descricao: 'Cobertura com N aos 30 dias',
      N: 40, K2O: 0,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Tolerante à seca e a solos pobres. Importante para biodiesel.',
  },

  // ==================== ORNAMENTAIS ====================
  crisantemo: {
    id: 'crisantemo',
    nome: 'Crisântemo',
    nomeCientifico: 'Chrysanthemum morifolium',
    categoria: 'Ornamentais',
    tipo: 'hortalica',
    ciclo: 'Anual (3–4 meses)',
    espacamentoPadrao: { linha: 0.2, planta: 0.15 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 100,
      P2O5: { baixo: 250, medio: 160, alto: 80 },
      K2O:  { baixo: 200, medio: 140, alto: 70 },
    },
    adubacaoCobertura: {
      descricao: 'Fertirrigação semanal com NPK equilibrado',
      N: 80, K2O: 80,
    },
    micronutrientes: { B: 1.5, Zn: 2.0, Fe: 0 },
    observacoes: 'Alta exigência nutricional. Usar substrato rico em MO.',
  },

  palmeira_ornamental: {
    id: 'palmeira_ornamental',
    nome: 'Palmeira Ornamental',
    nomeCientifico: 'Dypsis / Roystonea spp.',
    categoria: 'Ornamentais',
    tipo: 'perene',
    ciclo: 'Perene',
    espacamentoPadrao: { linha: 5, planta: 5 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: 50,
      P2O5: { baixo: 100, medio: 70,  alto: 35 },
      K2O:  { baixo: 100, medio: 70,  alto: 35 },
    },
    adubacaoCobertura: {
      descricao: 'Adubação trimestral com NPK + micronutrientes',
      N: 40, K2O: 40,
    },
    micronutrientes: { Mn: 0, Fe: 0, B: 1.0, Zn: 1.5 },
    observacoes: 'Sensível à deficiência de Mn e Fe em solos alcalinos.',
  },

  roseira: {
    id: 'roseira',
    nome: 'Roseira',
    nomeCientifico: 'Rosa spp.',
    categoria: 'Ornamentais',
    tipo: 'perene',
    ciclo: 'Perene',
    espacamentoPadrao: { linha: 0.8, planta: 0.5 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: 80,
      P2O5: { baixo: 200, medio: 130, alto: 65 },
      K2O:  { baixo: 150, medio: 100, alto: 50 },
    },
    adubacaoCobertura: {
      descricao: 'Fertirrigação ou adubação mensal',
      N: 60, K2O: 60,
    },
    micronutrientes: { B: 1.0, Zn: 2.0, Cu: 1.0 },
    observacoes: 'pH ideal 5,5–6,5. Alta exigência em MO e micronutrientes.',
  },

  // ==================== FLORESTAIS ====================
  eucalipto: {
    id: 'eucalipto',
    nome: 'Eucalipto',
    nomeCientifico: 'Eucalyptus spp.',
    categoria: 'Florestais',
    tipo: 'perene',
    ciclo: 'Perene (6–8 anos)',
    espacamentoPadrao: { linha: 3, planta: 2 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: 45,
      P2O5: { baixo: 130, medio: 90,  alto: 50 },
      K2O:  { baixo: 130, medio: 90,  alto: 50 },
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6 e 12 meses após o plantio',
      N: 30, K2O: 30,
    },
    micronutrientes: { Zn: 1.5, B: 1.0, Cu: 1.0 },
    observacoes: 'Realizar análise de solo a cada 3 anos. Manter palhada para ciclagem de nutrientes.',
  },

  pinus: {
    id: 'pinus',
    nome: 'Pinus',
    nomeCientifico: 'Pinus spp.',
    categoria: 'Florestais',
    tipo: 'perene',
    ciclo: 'Perene (8–12 anos)',
    espacamentoPadrao: { linha: 3, planta: 2 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: 20,
      P2O5: { baixo: 100, medio: 60,  alto: 20 },
      K2O:  { baixo: 90,  medio: 50,  alto: 10 },
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6 meses após o plantio',
      N: 15, K2O: 15,
    },
    micronutrientes: { Zn: 1.0, B: 0.5 },
    observacoes: 'Tolerante a solos pobres. Evitar solos compactados.',
  },

  seringueira: {
    id: 'seringueira',
    nome: 'Seringueira',
    nomeCientifico: 'Hevea brasiliensis',
    categoria: 'Florestais',
    tipo: 'perene',
    ciclo: 'Perene (6–7 anos para sangria)',
    espacamentoPadrao: { linha: 8, planta: 2.5 },
    vIdeal: 55,
    adubacaoPlantio: {
      N: 40,
      P2O5: { baixo: 100, medio: 70,  alto: 35 },
      K2O:  { baixo: 80,  medio: 60,  alto: 30 },
    },
    adubacaoCobertura: {
      descricao: 'Parcelada em 2–3 aplicações anuais nos primeiros 4 anos',
      N: 40, K2O: 40,
    },
    micronutrientes: { Zn: 1.5, B: 1.0, Cu: 1.0 },
    observacoes: 'Exige solos profundos e bem drenados. Sensível ao vento.',
  },

  teca: {
    id: 'teca',
    nome: 'Teca',
    nomeCientifico: 'Tectona grandis',
    categoria: 'Florestais',
    tipo: 'perene',
    ciclo: 'Perene (12–15 anos)',
    espacamentoPadrao: { linha: 4, planta: 3 },
    vIdeal: 55,
    adubacaoPlantio: {
      N: 50,
      P2O5: { baixo: 120, medio: 80,  alto: 40 },
      K2O:  { baixo: 110, medio: 70,  alto: 35 },
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6, 12 e 18 meses após o plantio',
      N: 40, K2O: 35,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Alta exigência em Ca. Calagem necessária se V < 50%.',
  },

  mogno: {
    id: 'mogno',
    nome: 'Mogno',
    nomeCientifico: 'Swietenia macrophylla',
    categoria: 'Florestais',
    tipo: 'perene',
    ciclo: 'Perene (15–20 anos)',
    espacamentoPadrao: { linha: 4, planta: 3 },
    vIdeal: 55,
    adubacaoPlantio: {
      N: 60,
      P2O5: { baixo: 110, medio: 75,  alto: 35 },
      K2O:  { baixo: 100, medio: 65,  alto: 30 },
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6 e 12 meses após o plantio',
      N: 35, K2O: 25,
    },
    micronutrientes: { Zn: 1.5, B: 1.0 },
    observacoes: 'Espécie ameaçada. Cultivo consorciado recomendado.',
  },
};

// ─── Classes de Fertilidade — ES/BA 5ª Aproximação ───────────────────────────
// Fósforo: 3 classes (Baixo, Médio, Alto) por textura e tipo de cultura
// Potássio: 3 classes por tipo de cultura

export const fertilityClasses = {
  fosforo: {
    perene: {
      argilosa: { baixo: [0, 4.9],  medio: [5, 10],   alto: [10.1, Infinity] },
      media:    { baixo: [0, 9.9],  medio: [10, 20],  alto: [20.1, Infinity] },
      arenosa:  { baixo: [0, 19.9], medio: [20, 30],  alto: [30.1, Infinity] },
    },
    anual: {
      argilosa: { baixo: [0, 19.9], medio: [20, 40],  alto: [40.1, Infinity] },
      media:    { baixo: [0, 39.9], medio: [40, 60],  alto: [60.1, Infinity] },
      arenosa:  { baixo: [0, 59.9], medio: [60, 80],  alto: [80.1, Infinity] },
    },
    hortalica: {
      argilosa: { baixo: [0, 29.9], medio: [30, 60],  alto: [60.1, Infinity] },
      media:    { baixo: [0, 59.9], medio: [60, 100], alto: [100.1, Infinity] },
      arenosa:  { baixo: [0, 99.9], medio: [100, 150],alto: [150.1, Infinity] },
    },
    forrageira: {
      argilosa: { baixo: [0, 4.9],  medio: [5, 10],   alto: [10.1, Infinity] },
      media:    { baixo: [0, 9.9],  medio: [10, 20],  alto: [20.1, Infinity] },
      arenosa:  { baixo: [0, 19.9], medio: [20, 30],  alto: [30.1, Infinity] },
    },
  },
  potassio: {
    perene:     { baixo: [0, 59.9],  medio: [60, 150],  alto: [150.1, Infinity] },
    anual:      { baixo: [0, 59.9],  medio: [60, 150],  alto: [150.1, Infinity] },
    hortalica:  { baixo: [0, 79.9],  medio: [80, 200],  alto: [200.1, Infinity] },
    forrageira: { baixo: [0, 59.9],  medio: [60, 150],  alto: [150.1, Infinity] },
  },
};

// Obtém classe de fertilidade (baixo | medio | alto)
export function getFertilityClass(valor, nutriente, tipo = 'perene', textura = 'media') {
  const tipoKey = ['hortalica', 'anual', 'forrageira'].includes(tipo) ? tipo : 'perene';

  if (nutriente === 'fosforo') {
    const texturaKey = textura === 'argilosa' ? 'argilosa' : textura === 'arenosa' ? 'arenosa' : 'media';
    const classes = fertilityClasses.fosforo[tipoKey]?.[texturaKey];
    if (!classes) return 'medio';
    for (const [classe, [min, max]] of Object.entries(classes)) {
      if (valor >= min && valor <= max) return classe;
    }
    return 'alto';
  }

  if (nutriente === 'potassio') {
    const classes = fertilityClasses.potassio[tipoKey];
    if (!classes) return 'medio';
    for (const [classe, [min, max]] of Object.entries(classes)) {
      if (valor >= min && valor <= max) return classe;
    }
    return 'alto';
  }

  return 'medio';
}

// Retorna dose de adubação — aceita número fixo ou objeto { baixo, medio, alto }
export function getAdubacaoValue(adubacaoObj, classe) {
  if (typeof adubacaoObj === 'number') return adubacaoObj;
  if (!adubacaoObj || typeof adubacaoObj !== 'object') return 0;
  const valor = adubacaoObj[classe];
  return typeof valor === 'number' ? valor : 0;
}

// Recomendações de fertilizantes comerciais
export function getFertilizerRecommendation(adubacao) {
  const recomendacoes = { nitrogenio: [], fosforo: [], potassio: [] };

  if (adubacao.N > 0) {
    recomendacoes.nitrogenio.push(
      { nome: 'Ureia', concentracao: 45, formula: '45-0-0', dose: (adubacao.N / 45) * 100, vantagens: 'Fonte mais concentrada e econômica' },
      { nome: 'Sulfato de Amônio', concentracao: 21, formula: '21-0-0', dose: (adubacao.N / 21) * 100, vantagens: 'Fornece enxofre (24%)' },
      { nome: 'Nitrato de Amônio', concentracao: 32, formula: '32-0-0', dose: (adubacao.N / 32) * 100, vantagens: 'Absorção rápida' },
    );
  }

  if (adubacao.P2O5 > 0) {
    recomendacoes.fosforo.push(
      { nome: 'Superfosfato Simples', concentracao: 18, formula: '0-18-0', dose: (adubacao.P2O5 / 18) * 100, vantagens: 'Fornece Ca e S' },
      { nome: 'Superfosfato Triplo', concentracao: 41, formula: '0-41-0', dose: (adubacao.P2O5 / 41) * 100, vantagens: 'Alta concentração de P' },
      { nome: 'MAP', concentracao: 48, formula: '11-48-0', dose: (adubacao.P2O5 / 48) * 100, vantagens: 'Fornece N (9–11%)' },
    );
  }

  if (adubacao.K2O > 0) {
    recomendacoes.potassio.push(
      { nome: 'Cloreto de Potássio', concentracao: 60, formula: '0-0-60', dose: (adubacao.K2O / 60) * 100, vantagens: 'Fonte mais comum e econômica' },
      { nome: 'Sulfato de Potássio', concentracao: 50, formula: '0-0-50', dose: (adubacao.K2O / 50) * 100, vantagens: 'Fornece enxofre (17%)' },
    );
  }

  return recomendacoes;
}
