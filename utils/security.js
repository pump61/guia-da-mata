// utils/security.js

// Limites realistas para valores de análise do solo
export const LIMITES_SOLO = {
  pH: { min: 3.0, max: 10.0, mensagem: 'pH deve estar entre 3.0 e 10.0' },
  P: { min: 0, max: 500, mensagem: 'Fósforo (P) deve estar entre 0 e 500 mg/dm³' },
  K: { min: 0, max: 1000, mensagem: 'Potássio (K) deve estar entre 0 e 1000 mg/dm³' },
  Ca: { min: 0, max: 20, mensagem: 'Cálcio (Ca) deve estar entre 0 e 20 cmolc/dm³' },
  Mg: { min: 0, max: 10, mensagem: 'Magnésio (Mg) deve estar entre 0 e 10 cmolc/dm³' },
  Al: { min: 0, max: 10, mensagem: 'Alumínio (Al) deve estar entre 0 e 10 cmolc/dm³' },
  V: { min: 0, max: 100, mensagem: 'Saturação por bases (V%) deve estar entre 0 e 100%' },
  T: { min: 0, max: 50, mensagem: 'CTC (T) deve estar entre 0 e 50 cmolc/dm³' },
};

// Sanitiza entradas do usuário
export function sanitizarInput(valor) {
  if (valor === null || valor === undefined) return '';
  if (typeof valor !== 'string') return String(valor);
  
  // Permite apenas números, ponto, vírgula e sinal negativo
  // Remove caracteres potencialmente perigosos
  return valor
    .replace(/[^0-9.,-]/g, '')  // Remove tudo exceto números, ponto, vírgula e hífen
    .replace(/\.\.+/g, '.')      // Remove múltiplos pontos
    .replace(/,+/g, ',')         // Remove múltiplas vírgulas
    .replace(/-+/g, '-')         // Remove múltiplos hífens
    .trim();
}

// Valida e converte número com segurança
export function validarNumero(valor, min = -Infinity, max = Infinity) {
  if (valor === null || valor === undefined || valor === '') return null;
  
  // Converte vírgula para ponto
  let str = String(valor).replace(',', '.');
  
  // Remove caracteres indesejados
  str = str.replace(/[^0-9.-]/g, '');
  
  const num = parseFloat(str);
  
  if (isNaN(num)) return null;
  if (num < min) return min;
  if (num > max) return max;
  
  // Arredonda para 1 casa decimal para valores pequenos, 0 para inteiros
  if (Math.abs(num) < 1 && num !== 0) {
    return Math.round(num * 10) / 10;
  }
  
  return num;
}

// Valida análise do solo completa
export function validarAnaliseSolo(analise) {
  const erros = [];
  
  for (const [campo, valor] of Object.entries(analise)) {
    const limite = LIMITES_SOLO[campo];
    if (limite && valor !== null && valor !== undefined && valor !== '') {
      const num = validarNumero(valor, limite.min, limite.max);
      if (num === null) {
        erros.push(`Campo "${campo}" não é um número válido`);
      }
    }
  }
  
  // Validações adicionais de consistência
  const pH = validarNumero(analise.pH);
  const al = validarNumero(analise.Al);
  const v = validarNumero(analise.V);
  
  if (pH !== null && al !== null && pH > 5.5 && al > 0.3) {
    erros.push('Inconsistência: pH acima de 5.5 com alumínio elevado. Verifique os valores.');
  }
  
  if (pH !== null && v !== null && pH > 6.5 && v < 50) {
    erros.push('Inconsistência: pH alto com saturação por bases baixa. Verifique os valores.');
  }
  
  return erros;
}

// Escapa texto para exibição segura
export function escaparTexto(texto) {
  if (!texto) return '';
  if (typeof texto !== 'string') return String(texto);
  
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Valida espaçamento de plantio
export function validarEspacamento(linha, planta) {
  const linhaNum = validarNumero(linha, 0.1, 100);
  const plantaNum = validarNumero(planta, 0.1, 100);
  
  if (linhaNum === null || plantaNum === null) {
    return { valido: false, erro: 'Espaçamento inválido' };
  }
  
  if (linhaNum * plantaNum < 0.1) {
    return { valido: false, erro: 'Espaçamento muito pequeno (mínimo 0.1m² por planta)' };
  }
  
  if (linhaNum * plantaNum > 100) {
    return { valido: false, erro: 'Espaçamento muito grande (máximo 100m² por planta)' };
  }
  
  return { valido: true, linha: linhaNum, planta: plantaNum };
}