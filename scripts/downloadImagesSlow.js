// scripts/downloadImagesSlow.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// Apenas as imagens que ainda faltam (excluindo as que já baixaram)
const missingImages = {
  SIPHONAPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Pulex_irritans_human_flea.jpg/800px-Pulex_irritans_human_flea.jpg',
    filename: 'siphonaptera.jpg',
  },
  PHTHIRAPTERA_ANOPLURA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Male_human_head_louse.jpg/800px-Male_human_head_louse.jpg',
    filename: 'phthiraptera_anoplura.jpg',
  },
  PHTHIRAPTERA_MALLOPHAGA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Menacanthus-chewing-louse-2.jpg',
    filename: 'phthiraptera_mallophaga.jpg',
  },
  HEMIPTERA_HETEROPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Palomena_prasina_MHNT_L%C3%A9guevin_Blanc.jpg/800px-Palomena_prasina_MHNT_L%C3%A9guevin_Blanc.jpg',
    filename: 'hemiptera_heteroptera.jpg',
  },
  DIPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Fly_06086.JPG/800px-Fly_06086.JPG',
    filename: 'diptera.jpg',
  },
  HYMENOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Lasioglossum_pseudosphecodimorphum.jpg/800px-Lasioglossum_pseudosphecodimorphum.jpg',
    filename: 'hymenoptera.jpg',
  },
  LEPIDOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Parthenos_sylvia_philippensis.jpg/800px-Parthenos_sylvia_philippensis.jpg',
    filename: 'lepidoptera.jpg',
  },
  COLEOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Anoplotrupes.stercorosus.jpg',
    filename: 'coleoptera.jpg',
  },
  STREPSIPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Elenchus_koebelei.jpg',
    filename: 'strepsiptera.jpg',
  },
  MECOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Scorpionfly_from_Coorg.jpg/800px-Scorpionfly_from_Coorg.jpg',
    filename: 'mecoptera.jpg',
  },
  DERMAPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Forficula.auricularia.-.lindsey.jpg',
    filename: 'dermaptera.jpg',
  },
  THYSANOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Thysanoptera2.jpg/800px-Thysanoptera2.jpg',
    filename: 'thysanoptera.jpg',
  },
  EMBIOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/CSIRO_ScienceImage_2198_Embioptera_Web_Spinner.jpg/800px-CSIRO_ScienceImage_2198_Embioptera_Web_Spinner.jpg',
    filename: 'embioptera.jpg',
  },
  ZORAPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Zorotypus_from_Los_Bancos%2C_Pichincha%2C_Ecuador.jpg/800px-Zorotypus_from_Los_Bancos%2C_Pichincha%2C_Ecuador.jpg',
    filename: 'zoraptera.jpg',
  },
  ISOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Flying_Termite.jpg/800px-Flying_Termite.jpg',
    filename: 'isoptera.jpg',
  },
  ORTHOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Reserva_Particular_do_Patrim%C3%B4nio_Natural_Corredeiras_do_Rio_Itajai-Paulo_Marcelo_Adamek-74.jpg/800px-Reserva_Particular_do_Patrim%C3%B4nio_Natural_Corredeiras_do_Rio_Itajai-Paulo_Marcelo_Adamek-74.jpg',
    filename: 'orthoptera.jpg',
  },
  MANTODEA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/European_praying_mantis_%28Mantis_religiosa%29_green_female_Dobruja.jpg/800px-European_praying_mantis_%28Mantis_religiosa%29_green_female_Dobruja.jpg',
    filename: 'mantodea.jpg',
  },
  PLECOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Plecoptera_P1420684a.jpg/800px-Plecoptera_P1420684a.jpg',
    filename: 'plecoptera.jpg',
  },
  PHASMATODEA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Phasmatodea_2966.jpg/800px-Phasmatodea_2966.jpg',
    filename: 'phasmatodea.jpg',
  },
  BLATTODEA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Blattodea_in_S%C3%A3o_Paulo_Zoo.jpg/800px-Blattodea_in_S%C3%A3o_Paulo_Zoo.jpg',
    filename: 'blattodea.jpg',
  },
  GRYLLOBLATTODEA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Galloisiana_nipponensis_2.jpg/800px-Galloisiana_nipponensis_2.jpg',
    filename: 'grylloblattodea.jpg',
  },
  EPHEMEROPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ephemeroptera_sp_04.jpg/800px-Ephemeroptera_sp_04.jpg',
    filename: 'ephemeroptera.jpg',
  },
  ODONATA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Sympetrum_flaveolum_-_side_%28aka%29.jpg/800px-Sympetrum_flaveolum_-_side_%28aka%29.jpg',
    filename: 'odonata.jpg',
  },
  NEUROPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Antlion._Distoleon_annulatus._%28Neuroptera._Myrmeleontidae%29.._-_Flickr_-_gailhampshire.jpg/800px-Antlion._Distoleon_annulatus._%28Neuroptera._Myrmeleontidae%29.._-_Flickr_-_gailhampshire.jpg',
    filename: 'neuroptera.jpg',
  },
  MEGALOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Chauliodes_rastricornis_P1000439a.jpg/800px-Chauliodes_rastricornis_P1000439a.jpg',
    filename: 'megaloptera.jpg',
  },
  TRICHOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Agrypnia_pagetana.jpg',
    filename: 'trichoptera.jpg',
  },
  HOMOPTERA: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Sis%C9%99k_%28Homoptera%29.png/800px-Sis%C9%99k_%28Homoptera%29.png',
    filename: 'homoptera.jpg',
  },
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    };
    
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Baixado: ${path.basename(filepath)}`);
          resolve();
        });
        file.on('error', reject);
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`   ↪️ Redirecionando...`);
        downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadMissingImages() {
  const assetsDir = path.join(__dirname, '../assets/ordens');
  
  console.log('🚀 Baixando imagens faltantes (com pausa entre downloads)...\n');
  
  let successCount = 0;
  let failCount = 0;
  const entries = Object.entries(missingImages);
  
  for (let i = 0; i < entries.length; i++) {
    const [order, data] = entries[i];
    const filepath = path.join(assetsDir, data.filename);
    
    process.stdout.write(`[${i+1}/${entries.length}] ${order}... `);
    
    // Pausa maior entre downloads para evitar bloqueio
    if (i > 0) {
      await sleep(3000); // 3 segundos entre cada download
    }
    
    try {
      await downloadImage(data.url, filepath);
      successCount++;
    } catch (error) {
      console.log(`❌ ${error.message}`);
      failCount++;
      
      // Se falhar, pausa ainda maior antes da próxima tentativa
      await sleep(5000);
    }
  }
  
  console.log(`\n📊 Resumo: ${successCount} OK, ${failCount} falhas`);
  
  if (failCount > 0) {
    console.log('\n❌ Imagens que falharam:');
    for (const [order, data] of entries) {
      const filepath = path.join(assetsDir, data.filename);
      if (!fs.existsSync(filepath) || fs.statSync(filepath).size < 1000) {
        console.log(`   - ${order}: ${data.url}`);
      }
    }
  }
}

downloadMissingImages();