export function normalizeKeyData(raw, fallbackKeyId) {
  if (Array.isArray(raw)) {
    return {
      chave: fallbackKeyId,
      items: raw,
    };
  }

  if (raw && Array.isArray(raw.itens)) {
    return {
      chave: raw.chave || fallbackKeyId,
      items: raw.itens,
    };
  }

  throw new Error(`Formato inválido para a chave ${fallbackKeyId}.`);
}

export function getItemById(keyData, itemId) {
  return keyData.items.find((item) => item.id === itemId) || null;
}

export function isNodeDestination(destination) {
  return typeof destination === 'string' && /^[A-D]\d+$/i.test(destination);
}
