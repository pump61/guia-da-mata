// data/agricultural/cultures.js
// Banco de dados de culturas para cálculos agrários

export const cultures = {
  // ==================== ESPÉCIES FLORESTAIS ====================
  eucalipto: {
    id: 'eucalipto',
    nome: 'Eucalipto',
    nomeCientifico: 'Eucalyptus spp.',
    categoria: 'Florestais',
    ciclo: 'Perene (6-8 anos)',
    espacamentoPadrao: { linha: 3, planta: 2 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: { muitoBaixo: 45, baixo: 45, medio: 45, alto: 45, muitoAlto: 45 },
      P2O5: { muitoBaixo: 130, baixo: 90, medio: 70, alto: 50, muitoAlto: 50 },
      K2O: { muitoBaixo: 130, baixo: 90, medio: 70, alto: 50, muitoAlto: 50 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6 e 12 meses após o plantio',
      N: 30,
      K2O: 30
    },
    micronutrientes: {
      Zn: 1.5,
      B: 1.0,
      Cu: 1.0
    },
    observacoes: 'Realizar análise de solo a cada 3 anos. Manter palhada para ciclagem de nutrientes.'
  },
  
  pinus: {
    id: 'pinus',
    nome: 'Pinus',
    nomeCientifico: 'Pinus spp.',
    categoria: 'Florestais',
    ciclo: 'Perene (8-12 anos)',
    espacamentoPadrao: { linha: 3, planta: 2 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: { muitoBaixo: 20, baixo: 20, medio: 20, alto: 20, muitoAlto: 0 },
      P2O5: { muitoBaixo: 100, baixo: 60, medio: 40, alto: 20, muitoAlto: 20 },
      K2O: { muitoBaixo: 90, baixo: 50, medio: 30, alto: 10, muitoAlto: 10 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6 meses após o plantio',
      N: 15,
      K2O: 15
    },
    micronutrientes: {
      Zn: 1.0,
      B: 0.5
    },
    observacoes: 'Tolerante a solos pobres. Evitar solos compactados.'
  },
  
  cacau: {
    id: 'cacau',
    nome: 'Cacau',
    nomeCientifico: 'Theobroma cacao',
    categoria: 'Fruteiras',
    ciclo: 'Perene (3-4 anos para produção)',
    espacamentoPadrao: { linha: 3.5, planta: 2.5 },
    vIdeal: 65,
    adubacaoPlantio: {
      N: { muitoBaixo: 30, baixo: 25, medio: 20, alto: 15, muitoAlto: 10 },
      P2O5: { muitoBaixo: 120, baixo: 100, medio: 80, alto: 60, muitoAlto: 40 },
      K2O: { muitoBaixo: 110, baixo: 90, medio: 70, alto: 50, muitoAlto: 30 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar anualmente no início das chuvas (3-4 aplicações)',
      N: 80,
      K2O: 70
    },
    micronutrientes: {
      Zn: 2.0,
      B: 1.5,
      Cu: 1.5
    },
    observacoes: 'Cultivo consorciado com espécies sombreadoras. Alta exigência em K.'
  },
  
  acacia_negra: {
    id: 'acacia_negra',
    nome: 'Acácia Negra',
    nomeCientifico: 'Acacia mearnsii',
    categoria: 'Florestais',
    ciclo: 'Perene (7-10 anos)',
    espacamentoPadrao: { linha: 3, planta: 2 },
    vIdeal: 50,
    adubacaoPlantio: {
      N: { muitoBaixo: 40, baixo: 20, medio: 20, alto: 10, muitoAlto: 10 },
      P2O5: { muitoBaixo: 130, baixo: 90, medio: 70, alto: 50, muitoAlto: 50 },
      K2O: { muitoBaixo: 120, baixo: 80, medio: 60, alto: 40, muitoAlto: 40 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6 meses após o plantio',
      N: 15,
      K2O: 15
    },
    micronutrientes: {
      Zn: 1.0,
      B: 0.5
    },
    observacoes: 'Fixadora de nitrogênio. Não exige adubação nitrogenada após estabelecida.'
  },
  
  araucaria: {
    id: 'araucaria',
    nome: 'Araucária',
    nomeCientifico: 'Araucaria angustifolia',
    categoria: 'Florestais',
    ciclo: 'Perene (15-20 anos)',
    espacamentoPadrao: { linha: 4, planta: 4 },
    vIdeal: 45,
    adubacaoPlantio: {
      N: { muitoBaixo: 30, baixo: 25, medio: 20, alto: 15, muitoAlto: 10 },
      P2O5: { muitoBaixo: 100, baixo: 70, medio: 50, alto: 30, muitoAlto: 20 },
      K2O: { muitoBaixo: 90, baixo: 60, medio: 40, alto: 20, muitoAlto: 15 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar anualmente nos primeiros 3 anos',
      N: 25,
      K2O: 20
    },
    micronutrientes: {
      Zn: 1.0,
      B: 0.5
    },
    observacoes: 'Espécie nativa. Evitar solos encharcados.'
  },
  
  teca: {
    id: 'teca',
    nome: 'Teca',
    nomeCientifico: 'Tectona grandis',
    categoria: 'Florestais',
    ciclo: 'Perene (12-15 anos)',
    espacamentoPadrao: { linha: 4, planta: 3 },
    vIdeal: 55,
    adubacaoPlantio: {
      N: { muitoBaixo: 50, baixo: 40, medio: 35, alto: 30, muitoAlto: 25 },
      P2O5: { muitoBaixo: 120, baixo: 100, medio: 80, alto: 60, muitoAlto: 40 },
      K2O: { muitoBaixo: 110, baixo: 90, medio: 70, alto: 50, muitoAlto: 30 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6, 12 e 18 meses após o plantio',
      N: 40,
      K2O: 35
    },
    micronutrientes: {
      Zn: 1.5,
      B: 1.0
    },
    observacoes: 'Alta exigência em Ca. Fazer calagem se V < 50%.'
  },
  
  mogno: {
    id: 'mogno',
    nome: 'Mogno',
    nomeCientifico: 'Swietenia macrophylla',
    categoria: 'Florestais',
    ciclo: 'Perene (15-20 anos)',
    espacamentoPadrao: { linha: 4, planta: 3 },
    vIdeal: 55,
    adubacaoPlantio: {
      N: { muitoBaixo: 60, baixo: 50, medio: 40, alto: 35, muitoAlto: 30 },
      P2O5: { muitoBaixo: 110, baixo: 90, medio: 70, alto: 50, muitoAlto: 30 },
      K2O: { muitoBaixo: 100, baixo: 80, medio: 60, alto: 40, muitoAlto: 20 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 6 e 12 meses após o plantio',
      N: 35,
      K2O: 25
    },
    micronutrientes: {
      Zn: 1.5,
      B: 1.0
    },
    observacoes: 'Espécie ameaçada. Cultivo consorciado com espécies fixadoras de N.'
  },
  
  // ==================== FRUTÍFERAS ====================
  cafe: {
    id: 'cafe',
    nome: 'Café',
    nomeCientifico: 'Coffea arabica',
    categoria: 'Fruteiras',
    ciclo: 'Perene (20-25 anos)',
    espacamentoPadrao: { linha: 3.5, planta: 0.8 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: { muitoBaixo: 30, baixo: 25, medio: 20, alto: 15, muitoAlto: 10 },
      P2O5: { muitoBaixo: 80, baixo: 70, medio: 60, alto: 40, muitoAlto: 20 },
      K2O: { muitoBaixo: 70, baixo: 60, medio: 50, alto: 30, muitoAlto: 15 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar parcelado em 3-4 vezes durante o ano',
      N: 120,
      K2O: 100
    },
    micronutrientes: {
      Zn: 2.0,
      B: 1.5,
      Cu: 1.0
    },
    observacoes: 'Calagem essencial para produtividade. Fazer análise foliar anualmente.'
  },
  
  banana: {
    id: 'banana',
    nome: 'Banana',
    nomeCientifico: 'Musa spp.',
    categoria: 'Fruteiras',
    ciclo: 'Perene (10-15 anos)',
    espacamentoPadrao: { linha: 3, planta: 3 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: { muitoBaixo: 40, baixo: 40, medio: 40, alto: 40, muitoAlto: 40 },
      P2O5: { muitoBaixo: 80, baixo: 60, medio: 50, alto: 40, muitoAlto: 30 },
      K2O: { muitoBaixo: 100, baixo: 80, medio: 60, alto: 40, muitoAlto: 20 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar parcelado em 4-5 vezes durante o ano',
      N: 120,
      K2O: 200
    },
    micronutrientes: {
      Zn: 2.0,
      B: 1.5
    },
    observacoes: 'Altamente exigente em K. Manter cobertura morta no solo.'
  },
  
  // ==================== GRÃOS ====================
  milho: {
    id: 'milho',
    nome: 'Milho',
    nomeCientifico: 'Zea mays',
    categoria: 'Grãos',
    ciclo: 'Anual (90-120 dias)',
    espacamentoPadrao: { linha: 0.8, planta: 0.2 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: { muitoBaixo: 80, baixo: 80, medio: 80, alto: 80, muitoAlto: 80 },
      P2O5: { muitoBaixo: 200, baixo: 140, medio: 130, alto: 90, muitoAlto: 0 },
      K2O: { muitoBaixo: 140, baixo: 120, medio: 90, alto: 60, muitoAlto: 0 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar aos 30-40 dias após emergência',
      N: 60
    },
    micronutrientes: {
      Zn: 2.0
    },
    observacoes: 'Cultura exigente em N. Fazer rotação com leguminosas.'
  },
  
  soja: {
    id: 'soja',
    nome: 'Soja',
    nomeCientifico: 'Glycine max',
    categoria: 'Grãos',
    ciclo: 'Anual (100-140 dias)',
    espacamentoPadrao: { linha: 0.5, planta: 0.1 },
    vIdeal: 60,
    adubacaoPlantio: {
      N: { muitoBaixo: 0, baixo: 0, medio: 0, alto: 0, muitoAlto: 0 },
      P2O5: { muitoBaixo: 95, baixo: 95, medio: 85, alto: 45, muitoAlto: 0 },
      K2O: { muitoBaixo: 155, baixo: 115, medio: 95, alto: 45, muitoAlto: 0 }
    },
    adubacaoCobertura: null,
    micronutrientes: {
      Mo: 0.05,
      Co: 0.01
    },
    observacoes: 'Fazer inoculação das sementes. Não necessita N mineral.'
  },
  
  // ==================== HORTALIÇAS ====================
  tomate: {
    id: 'tomate',
    nome: 'Tomate',
    nomeCientifico: 'Solanum lycopersicum',
    categoria: 'Hortaliças',
    ciclo: 'Anual (90-120 dias)',
    espacamentoPadrao: { linha: 1, planta: 0.5 },
    vIdeal: 70,
    adubacaoPlantio: {
      N: { muitoBaixo: 190, baixo: 190, medio: 190, alto: 190, muitoAlto: 190 },
      P2O5: { muitoBaixo: 230, baixo: 150, medio: 110, alto: 70, muitoAlto: 40 },
      K2O: { muitoBaixo: 270, baixo: 180, medio: 135, alto: 90, muitoAlto: 60 }
    },
    adubacaoCobertura: {
      descricao: 'Aplicar parcelado em 3-4 vezes durante o ciclo',
      N: 80,
      K2O: 60
    },
    micronutrientes: {
      Zn: 1.5,
      B: 1.0
    },
    observacoes: 'Exigente em Ca. Fazer calagem para evitar podridão apical.'
  }
};

// Classes de fertilidade do solo
export const fertilityClasses = {
  fosforo: {
    muitoBaixo: { min: 0, max: 5, label: 'Muito Baixo' },
    baixo: { min: 6, max: 10, label: 'Baixo' },
    medio: { min: 11, max: 20, label: 'Médio' },
    alto: { min: 21, max: 30, label: 'Alto' },
    muitoAlto: { min: 31, max: Infinity, label: 'Muito Alto' }
  },
  potassio: {
    muitoBaixo: { min: 0, max: 45, label: 'Muito Baixo' },
    baixo: { min: 46, max: 90, label: 'Baixo' },
    medio: { min: 91, max: 135, label: 'Médio' },
    alto: { min: 136, max: 180, label: 'Alto' },
    muitoAlto: { min: 181, max: Infinity, label: 'Muito Alto' }
  }
};

// Função para obter classe de fertilidade
export function getFertilityClass(valor, tipo) {
  const classes = fertilityClasses[tipo];
  for (const [classe, range] of Object.entries(classes)) {
    if (valor >= range.min && valor <= range.max) {
      return classe;
    }
  }
  return 'muitoAlto';
}

// Função para obter recomendação de adubo
export function getFertilizerRecommendation(adubacao) {
  const recomendacoes = {
    nitrogenio: [],
    fosforo: [],
    potassio: [],
    micronutrientes: []
  };
  
  // Recomendações para Nitrogênio
  if (adubacao.N > 0) {
    recomendacoes.nitrogenio.push({
      nome: 'Ureia',
      concentracao: 45,
      formula: '45-0-0',
      dose: (adubacao.N / 45) * 100,
      vantagens: 'Fonte mais concentrada e econômica'
    });
    recomendacoes.nitrogenio.push({
      nome: 'Sulfato de Amônio',
      concentracao: 21,
      formula: '21-0-0',
      dose: (adubacao.N / 21) * 100,
      vantagens: 'Fornece enxofre (24%)'
    });
    recomendacoes.nitrogenio.push({
      nome: 'Nitrato de Amônio',
      concentracao: 32,
      formula: '32-0-0',
      dose: (adubacao.N / 32) * 100,
      vantagens: 'Absorção rápida pelas raízes'
    });
  }
  
  // Recomendações para Fósforo
  if (adubacao.P2O5 > 0) {
    recomendacoes.fosforo.push({
      nome: 'Superfosfato Simples',
      concentracao: 18,
      formula: '0-18-0',
      dose: (adubacao.P2O5 / 18) * 100,
      vantagens: 'Fornece cálcio (16-20%) e enxofre (10-12%)'
    });
    recomendacoes.fosforo.push({
      nome: 'Superfosfato Triplo',
      concentracao: 41,
      formula: '0-41-0',
      dose: (adubacao.P2O5 / 41) * 100,
      vantagens: 'Alta concentração de fósforo'
    });
    recomendacoes.fosforo.push({
      nome: 'MAP (Fosfato Monoamônico)',
      concentracao: 48,
      formula: '11-48-0',
      dose: (adubacao.P2O5 / 48) * 100,
      vantagens: 'Fornece nitrogênio (9-11%)'
    });
  }
  
  // Recomendações para Potássio
  if (adubacao.K2O > 0) {
    recomendacoes.potassio.push({
      nome: 'Cloreto de Potássio',
      concentracao: 60,
      formula: '0-0-60',
      dose: (adubacao.K2O / 60) * 100,
      vantagens: 'Fonte mais comum e econômica'
    });
    recomendacoes.potassio.push({
      nome: 'Sulfato de Potássio',
      concentracao: 50,
      formula: '0-0-50',
      dose: (adubacao.K2O / 50) * 100,
      vantagens: 'Fornece enxofre (17%)'
    });
  }
  
  return recomendacoes;
}