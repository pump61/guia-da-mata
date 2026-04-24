// data/insectImages.js

export const insectImages = {
  // Subclasse APTERYGOTA
  ARCHAEOGNATHA: require('../assets/ordens/archaeognatha.webp'),
  THYSANURA: require('../assets/ordens/thysanura.webp'),
  
  // Hemiptera
  HEMIPTERA_HOMOPTERA: require('../assets/ordens/hemiptera_homoptera.webp'),
  HEMIPTERA_HETEROPTERA: require('../assets/ordens/hemiptera_heteroptera.webp'),
  HOMOPTERA: require('../assets/ordens/homoptera.webp'),
  
  // Siphonaptera
  SIPHONAPTERA: require('../assets/ordens/siphonaptera.webp'),
  
  // Phthiraptera
  PHTHIRAPTERA_ANOPLURA: require('../assets/ordens/phthiraptera_anoplura.webp'),
  PHTHIRAPTERA_MALLOPHAGA: require('../assets/ordens/phthiraptera_mallophaga.webp'),
  
  // Diptera
  DIPTERA: require('../assets/ordens/diptera.webp'),
  
  // Hymenoptera
  HYMENOPTERA: require('../assets/ordens/hymenoptera.webp'),
  
  // Lepidoptera
  LEPIDOPTERA: require('../assets/ordens/lepidoptera.webp'),
  
  // Coleoptera
  COLEOPTERA: require('../assets/ordens/coleoptera.webp'),
  
  // Strepsiptera
  STREPSIPTERA: require('../assets/ordens/strepsiptera.webp'),
  
  // Mecoptera
  MECOPTERA: require('../assets/ordens/mecoptera.webp'),
  
  // Dermaptera
  DERMAPTERA: require('../assets/ordens/dermaptera.webp'),
  
  // Thysanoptera
  THYSANOPTERA: require('../assets/ordens/thysanoptera.webp'),
  
  // Embioptera
  EMBIOPTERA: require('../assets/ordens/embioptera.webp'),
  
  // Zoraptera
  ZORAPTERA: require('../assets/ordens/zoraptera.webp'),
  
  // Isoptera / Blattodea-Isoptera
  ISOPTERA: require('../assets/ordens/isoptera.webp'),
  BLATTODEA_ISOPTERA: require('../assets/ordens/blattodea_isoptera.webp'),
  
  // Psocoptera
  PSOCOPTERA: require('../assets/ordens/psocoptera.webp'),
  
  // Orthoptera
  ORTHOPTERA: require('../assets/ordens/orthoptera.webp'),
  
  // Mantodea
  MANTODEA: require('../assets/ordens/mantodea.webp'),
  
  // Plecoptera
  PLECOPTERA: require('../assets/ordens/plecoptera.webp'),
  
  // Phasmatodea
  PHASMATODEA: require('../assets/ordens/phasmatodea.webp'),
  
  // Blattodea
  BLATTODEA: require('../assets/ordens/blattodea.webp'),
  
  // Grylloblattodea
  GRYLLOBLATTODEA: require('../assets/ordens/grylloblattodea.webp'),
  
  // Ephemeroptera
  EPHEMEROPTERA: require('../assets/ordens/ephemeroptera.webp'),
  
  // Odonata
  ODONATA: require('../assets/ordens/odonata.webp'),
  
  // Neuroptera
  NEUROPTERA: require('../assets/ordens/neuroptera.webp'),
  
  // Megaloptera
  MEGALOPTERA: require('../assets/ordens/megaloptera.webp'),
  
  // Trichoptera
  TRICHOPTERA: require('../assets/ordens/trichoptera.webp'),
};

// Função para obter a imagem da ordem
export function getInsectImage(order) {
  if (!order) return null;
  
  // Normaliza o nome da ordem (remove hífens, upper case)
  const normalized = order.replace(/-/g, '_').toUpperCase();
  
  // Tenta encontrar a imagem
  const image = insectImages[normalized];
  
  if (image) {
    return image;
  }
  
  // Se não encontrar, retorna null (mostra só texto)
  return null;
}