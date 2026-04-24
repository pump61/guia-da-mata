// data/agricultural/soilAnalysis.js

// Interpretação do pH
export function interpretarPH(pH) {
  if (pH < 4.4) return { classe: 'Extremamente ácido', calagem: 'urgente' };
  if (pH < 5.4) return { classe: 'Fortemente ácido', calagem: 'necessária' };
  if (pH < 6.5) return { classe: 'Moderadamente ácido', calagem: 'desejável' };
  if (pH < 7.3) return { classe: 'Neutro', calagem: 'não necessária' };
  if (pH < 8.3) return { classe: 'Moderadamente alcalino', calagem: 'não necessária' };
  return { classe: 'Fortemente alcalino', calagem: 'não necessária' };
}

// Interpretação do Alumínio
export function interpretarAluminio(Al) {
  if (Al < 0.3) return { classe: 'Baixo', toxidez: 'baixa', calagemNecessaria: false };
  if (Al <= 1.0) return { classe: 'Médio', toxidez: 'média', calagemNecessaria: true };
  return { classe: 'Alto', toxidez: 'alta', calagemNecessaria: true };
}

// Interpretação do Fósforo (por classe de textura)
export function interpretarFosforo(P, argila) {
  // Classes baseadas no teor de argila
  let limiteBaixo, limiteMedio, limiteAlto;
  
  if (argila > 60) {
    limiteBaixo = 10; limiteMedio = 20; limiteAlto = 60;
  } else if (argila > 40) {
    limiteBaixo = 8; limiteMedio = 16; limiteAlto = 48;
  } else if (argila > 20) {
    limiteBaixo = 6; limiteMedio = 12; limiteAlto = 36;
  } else {
    limiteBaixo = 4; limiteMedio = 8; limiteAlto = 24;
  }
  
  if (P <= limiteBaixo) return { classe: 'Muito Baixo', adubacao: 'essencial' };
  if (P <= limiteMedio) return { classe: 'Baixo', adubacao: 'necessária' };
  if (P <= limiteAlto) return { classe: 'Médio', adubacao: 'recomendada' };
  return { classe: 'Alto', adubacao: 'manutenção' };
}

// Interpretação do Potássio
export function interpretarPotassio(K) {
  if (K < 45) return { classe: 'Muito Baixo', adubacao: 'essencial' };
  if (K < 91) return { classe: 'Baixo', adubacao: 'necessária' };
  if (K < 136) return { classe: 'Médio', adubacao: 'recomendada' };
  if (K < 181) return { classe: 'Alto', adubacao: 'manutenção' };
  return { classe: 'Muito Alto', adubacao: 'dispensável' };
}

// Interpretação da Saturação por Bases (V%)
export function interpretarV(V, culturaExigente = false) {
  const ideal = culturaExigente ? 70 : 60;
  
  if (V < 40) return { classe: 'Muito Baixa', calagemNecessaria: true, ideal: ideal };
  if (V < ideal) return { classe: 'Baixa', calagemNecessaria: true, ideal: ideal };
  if (V <= 80) return { classe: 'Adequada', calagemNecessaria: false, ideal: ideal };
  return { classe: 'Alta', calagemNecessaria: false, ideal: ideal };
}

// Cálculo da Necessidade de Calagem (método da saturação por bases)
export function calcularNecessidadeCalagem(V_atual, T, V_desejado = 60, prnt = 100) {
  // NC = (V2 - V1) * T / 100
  const NC_teorica = ((V_desejado - V_atual) * T) / 100;
  const NC_corrigida = (NC_teorica * 100) / prnt;
  
  return {
    teorica: NC_teorica,
    corrigida: NC_corrigida,
    prnt_utilizado: prnt,
    doseRecomendada: NC_corrigida
  };
}

// Verificar necessidade de gessagem
export function verificarGessagem(Al_subsolo, Ca_subsolo, NC) {
  // Gessagem recomendada quando Al > 0.5 ou Ca < 0.5 na camada 20-40cm
  const necessidade = Al_subsolo > 0.5 || Ca_subsolo < 0.5;
  const dose = necessidade ? NC * 0.3 : 0; // 30% da necessidade de calagem
  
  return {
    necessaria: necessidade,
    dose: dose,
    motivo: Al_subsolo > 0.5 ? `Alto teor de Al³⁺ (${Al_subsolo} cmolc/dm³)` : 
            Ca_subsolo < 0.5 ? `Baixo teor de Ca²⁺ (${Ca_subsolo} cmolc/dm³)` : null
  };
}

// Função principal de diagnóstico completo
export function diagnosticarSolo(dados, cultura, plantasPorHa) {
  const {
    pH, P, K, Ca, Mg, Al, H_Al, SB, t, T, V, m, MO,
    P_rem, Zn, B, espacamentoLinha, espacamentoPlanta
  } = dados;
  
  // Interpretações
  const interpretacaoPH = interpretarPH(pH);
  const interpretacaoAl = interpretarAluminio(Al);
  const interpretacaoV = interpretarV(V, cultura.exigente);
  const interpretacaoP = interpretarFosforo(P, dados.argila || 30);
  const interpretacaoK = interpretarPotassio(K);
  
  // Calagem
  const calagem = interpretacaoV.calagemNecessaria || interpretacaoAl.calagemNecessaria
    ? calcularNecessidadeCalagem(V, T, cultura.vIdeal || 60)
    : { doseRecomendada: 0, teorica: 0, corrigida: 0 };
  
  // Gessagem (valores padrão para subsolo - ideal seria ter análise)
  const gessagem = verificarGessagem(Al, Ca, calagem.doseRecomendada);
  
  // Adubação (baseada na cultura selecionada)
  const adubacao = {
    necessaria: interpretacaoP.adubacao !== 'Alto' || interpretacaoK.adubacao !== 'Alto',
    N: cultura.adubacaoPlantio?.N || 0,
    P2O5: cultura.adubacaoPlantio?.P2O5?.[interpretacaoP.classe.toLowerCase().replace(' ', '_')] || 0,
    K2O: cultura.adubacaoPlantio?.K2O?.[interpretacaoK.classe.toLowerCase().replace(' ', '_')] || 0
  };
  
  // Adubação por cova
  const adubacaoCova = {
    N: plantasPorHa ? (adubacao.N / plantasPorHa) * 1000 : 0,
    P2O5: plantasPorHa ? (adubacao.P2O5 / plantasPorHa) * 1000 : 0,
    K2O: plantasPorHa ? (adubacao.K2O / plantasPorHa) * 1000 : 0
  };
  
  return {
    interpretacao: {
      pH: interpretacaoPH,
      aluminio: interpretacaoAl,
      fosforo: interpretacaoP,
      potassio: interpretacaoK,
      saturacaoBases: interpretacaoV
    },
    calagem,
    gessagem,
    adubacao,
    adubacaoCova,
    resumo: {
      precisaCalagem: calagem.doseRecomendada > 0.5,
      precisaGessagem: gessagem.necessaria,
      precisaAdubacao: adubacao.necessaria
    }
  };
}