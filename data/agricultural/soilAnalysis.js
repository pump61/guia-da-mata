// data/agricultural/soilAnalysis.js
// Baseado no Manual de Recomendação de Calagem e Adubação — ES/BA 5ª Aproximação

// Quadro 1 — pH em água
export function interpretarPH(pH) {
  if (pH < 5.0) return { classe: 'Acidez Elevada', descricao: 'Solo fortemente ácido', calagemNecessaria: true };
  if (pH < 6.0) return { classe: 'Acidez Média', descricao: 'Solo medianamente ácido', calagemNecessaria: true };
  if (pH < 7.0) return { classe: 'Acidez Fraca', descricao: 'Solo levemente ácido', calagemNecessaria: false };
  return { classe: 'Neutro a Alcalino', descricao: 'Solo neutro ou alcalino', calagemNecessaria: false };
}

// Quadro 2 — Textura estimada pelo P-rem
export function estimarTexturaByPrem(pRem) {
  if (pRem <= 10) return 'argilosa';
  if (pRem <= 40) return 'media';
  return 'arenosa';
}

// Quadro 3 — Fósforo (Mehlich-1) em função da textura e tipo de cultura
export function interpretarFosforo(P, textura = 'media', tipo = 'perene') {
  const tabela = {
    perene:    { argilosa: [5, 10],    media: [10, 20],   arenosa: [20, 30] },
    anual:     { argilosa: [20, 40],   media: [40, 60],   arenosa: [60, 80] },
    hortalica: { argilosa: [30, 60],   media: [60, 100],  arenosa: [100, 150] },
    forrageira:{ argilosa: [5, 10],    media: [10, 20],   arenosa: [20, 30] },
  };

  const tipoKey = ['hortalica', 'anual', 'forrageira'].includes(tipo) ? tipo : 'perene';
  const texturaKey = textura === 'argilosa' ? 'argilosa' : textura === 'arenosa' ? 'arenosa' : 'media';
  const [limBaixo, limAlto] = tabela[tipoKey][texturaKey];

  if (P < limBaixo) return { classe: 'baixo', label: 'Baixo', adubacao: 'essencial' };
  if (P <= limAlto)  return { classe: 'medio', label: 'Médio', adubacao: 'recomendada' };
  return { classe: 'alto', label: 'Alto', adubacao: 'manutenção' };
}

// Quadro 4 — Potássio (Mehlich-1) em função do tipo de cultura
export function interpretarPotassio(K, tipo = 'perene') {
  const isHortalica = tipo === 'hortalica';
  const limBaixo = isHortalica ? 80 : 60;
  const limAlto  = isHortalica ? 200 : 150;

  if (K < limBaixo) return { classe: 'baixo', label: 'Baixo', adubacao: 'essencial' };
  if (K <= limAlto)  return { classe: 'medio', label: 'Médio', adubacao: 'recomendada' };
  return { classe: 'alto', label: 'Alto', adubacao: 'manutenção' };
}

// Quadro 5 — Alumínio (KCl 1M)
export function interpretarAluminio(Al) {
  if (Al < 0.3)  return { classe: 'Baixo', toxidez: 'baixa',  calagemNecessaria: false };
  if (Al <= 1.0) return { classe: 'Médio', toxidez: 'média',  calagemNecessaria: true };
  return { classe: 'Alto', toxidez: 'alta', calagemNecessaria: true };
}

// Quadro 5 — Cálcio (KCl 1M)
export function interpretarCa(Ca) {
  if (Ca < 1.5)  return { classe: 'Baixo' };
  if (Ca <= 4.0) return { classe: 'Médio' };
  return { classe: 'Alto' };
}

// Quadro 5 — Magnésio (KCl 1M)
export function interpretarMg(Mg) {
  if (Mg < 0.5)  return { classe: 'Baixo' };
  if (Mg <= 1.0) return { classe: 'Médio' };
  return { classe: 'Alto' };
}

// Quadro 5 — Saturação por Bases (V%)
// calagemNecessaria é definida comparando V com o vIdeal da cultura
export function interpretarV(V, vIdeal = 60) {
  const calagemNecessaria = V < vIdeal;
  if (V < 50)  return { classe: 'Baixo',  calagemNecessaria };
  if (V <= 70) return { classe: 'Médio',  calagemNecessaria };
  return { classe: 'Alto', calagemNecessaria: false };
}

// Quadro 5 — Saturação de Alumínio (m%)
export function interpretarSatAl(m) {
  if (m < 20)  return { classe: 'Baixo', risco: 'baixo' };
  if (m <= 40) return { classe: 'Médio', risco: 'moderado' };
  return { classe: 'Alto', risco: 'alto' };
}

// Quadro 5 — Matéria Orgânica (dag/dm³)
export function interpretarMO(MO) {
  if (MO < 1.5)  return { classe: 'Baixo', descricao: 'Baixo teor de MO — risco de deficiência nutricional' };
  if (MO <= 3.0) return { classe: 'Médio', descricao: 'Teor adequado de MO' };
  return { classe: 'Alto', descricao: 'Alto teor de MO — solo fértil' };
}

// Quadro 6 — Micronutrientes disponíveis
export function interpretarMicronutriente(valor, nutriente) {
  const limites = {
    B:  { baixo: 0.35, alto: 0.9 },
    Zn: { baixo: 1.0,  alto: 2.2 },
    Cu: { baixo: 0.8,  alto: 1.8 },
    Fe: { baixo: 20,   alto: 45  },
    Mn: { baixo: 5.0,  alto: 12  },
  };
  const lim = limites[nutriente];
  if (!lim) return { classe: 'Desconhecido' };
  if (valor < lim.baixo) return { classe: 'Baixo', adubacao: 'necessária' };
  if (valor <= lim.alto)  return { classe: 'Médio', adubacao: 'monitorar'  };
  return { classe: 'Alto', adubacao: 'dispensável' };
}

// Cálculo da Necessidade de Calagem — método da saturação por bases (NC = (V2–V1)×T/100)
export function calcularNecessidadeCalagem(V_atual, T, V_desejado = 60, prnt = 100) {
  const NC_teorica  = ((V_desejado - V_atual) * T) / 100;
  const NC_corrigida = (NC_teorica * 100) / prnt;
  return {
    teorica: NC_teorica,
    corrigida: NC_corrigida,
    prnt_utilizado: prnt,
    doseRecomendada: NC_corrigida,
  };
}

// Gessagem — recomendada quando Al > 0.5 ou Ca < 0.5 na camada 20–40 cm
export function verificarGessagem(Al, Ca, NC) {
  const necessidade = Al > 0.5 || Ca < 0.5;
  return {
    necessaria: necessidade,
    dose: necessidade ? NC * 0.3 : 0,
    motivo: Al > 0.5
      ? `Alto teor de Al³⁺ (${Al} cmolc/dm³)`
      : Ca < 0.5
        ? `Baixo teor de Ca²⁺ (${Ca} cmolc/dm³)`
        : null,
  };
}

// Diagnóstico completo do solo
export function diagnosticarSolo(dados, cultura, plantasPorHa) {
  const { pH, P, K, Ca, Mg, Al, V, T, textura = 'media' } = dados;
  const tipo = cultura.tipo || 'perene';

  const interpretacaoPH  = interpretarPH(pH);
  const interpretacaoAl  = interpretarAluminio(Al);
  const interpretacaoV   = interpretarV(V, cultura.vIdeal || 60);
  const interpretacaoP   = interpretarFosforo(P, textura, tipo);
  const interpretacaoK   = interpretarPotassio(K, tipo);

  const calagem = (interpretacaoV.calagemNecessaria || interpretacaoAl.calagemNecessaria)
    ? calcularNecessidadeCalagem(V, T, cultura.vIdeal || 60)
    : { doseRecomendada: 0, teorica: 0, corrigida: 0 };

  const gessagem = verificarGessagem(Al, Ca, calagem.doseRecomendada);

  return {
    interpretacao: {
      pH: interpretacaoPH,
      aluminio: interpretacaoAl,
      fosforo: interpretacaoP,
      potassio: interpretacaoK,
      saturacaoBases: interpretacaoV,
    },
    calagem,
    gessagem,
    resumo: {
      precisaCalagem:  calagem.doseRecomendada > 0,
      precisaGessagem: gessagem.necessaria,
    },
  };
}
