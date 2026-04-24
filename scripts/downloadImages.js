// scripts/downloadImages.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// URLs DIRETAS (sem thumb, sem parâmetros) - todas funcionam
const insectOrdersImages = {
  // Já baixadas (pular)
  // ARCHAEOGNATHA: { url: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Archaeognatha.jpg', filename: 'archaeognatha.jpg' },
  // THYSANURA: { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Thysanura_on_the_wall_-_1.jpg', filename: 'thysanura.jpg' },
  // HEMIPTERA_HOMOPTERA: { url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Dornzikade_Centrotus_cornutus.jpg', filename: 'hemiptera_homoptera.jpg' },
  // PSOCOPTERA: { url: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Graphopsocus_cruciatus_02.jpg', filename: 'psocoptera.jpg' },
  
  // FALTAM estas (URLs diretas e funcionais)
  SIPHONAPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Pulex_irritans_human_flea.jpg', 
    filename: 'siphonaptera.jpg' 
  },
  PHTHIRAPTERA_ANOPLURA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Male_human_head_louse.jpg', 
    filename: 'phthiraptera_anoplura.jpg' 
  },
  PHTHIRAPTERA_MALLOPHAGA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Menacanthus-chewing-louse-2.jpg', 
    filename: 'phthiraptera_mallophaga.jpg' 
  },
  HEMIPTERA_HETEROPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Palomena_prasina_MHNT_L%C3%A9guevin_Blanc.jpg', 
    filename: 'hemiptera_heteroptera.jpg' 
  },
  DIPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Fly_06086.JPG', 
    filename: 'diptera.jpg' 
  },
  HYMENOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Lasioglossum_pseudosphecodimorphum.jpg', 
    filename: 'hymenoptera.jpg' 
  },
  LEPIDOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Parthenos_sylvia_philippensis.jpg', 
    filename: 'lepidoptera.jpg' 
  },
  COLEOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Anoplotrupes.stercorosus.jpg', 
    filename: 'coleoptera.jpg' 
  },
  STREPSIPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Elenchus_koebelei.jpg', 
    filename: 'strepsiptera.jpg' 
  },
  MECOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Scorpionfly_from_Coorg.jpg', 
    filename: 'mecoptera.jpg' 
  },
  DERMAPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Forficula.auricularia.-.lindsey.jpg', 
    filename: 'dermaptera.jpg' 
  },
  THYSANOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Thysanoptera2.jpg', 
    filename: 'thysanoptera.jpg' 
  },
  EMBIOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/CSIRO_ScienceImage_2198_Embioptera_Web_Spinner.jpg', 
    filename: 'embioptera.jpg' 
  },
  ZORAPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Zorotypus_from_Los_Bancos%2C_Pichincha%2C_Ecuador.jpg', 
    filename: 'zoraptera.jpg' 
  },
  ISOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Flying_Termite.jpg', 
    filename: 'isoptera.jpg' 
  },
  ORTHOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Reserva_Particular_do_Patrim%C3%B4nio_Natural_Corredeiras_do_Rio_Itajai-Paulo_Marcelo_Adamek-74.jpg', 
    filename: 'orthoptera.jpg' 
  },
  MANTODEA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/European_praying_mantis_%28Mantis_religiosa%29_green_female_Dobruja.jpg', 
    filename: 'mantodea.jpg' 
  },
  PLECOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Plecoptera_P1420684a.jpg', 
    filename: 'plecoptera.jpg' 
  },
  PHASMATODEA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Phasmatodea_2966.jpg', 
    filename: 'phasmatodea.jpg' 
  },
  BLATTODEA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Blattodea_in_S%C3%A3o_Paulo_Zoo.jpg', 
    filename: 'blattodea.jpg' 
  },
  GRYLLOBLATTODEA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Galloisiana_nipponensis_2.jpg', 
    filename: 'grylloblattodea.jpg' 
  },
  EPHEMEROPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Ephemeroptera_sp_04.jpg', 
    filename: 'ephemeroptera.jpg' 
  },
  ODONATA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Sympetrum_flaveolum_-_side_%28aka%29.jpg', 
    filename: 'odonata.jpg' 
  },
  NEUROPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Antlion._Distoleon_annulatus._%28Neuroptera._Myrmeleontidae%29.._-_Flickr_-_gailhampshire.jpg', 
    filename: 'neuroptera.jpg' 
  },
  MEGALOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Chauliodes_rastricornis_P1000439a.jpg', 
    filename: 'megaloptera.jpg' 
  },
  TRICHOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Agrypnia_pagetana.jpg', 
    filename: 'trichoptera.jpg' 
  },
  HOMOPTERA: { 
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Sis%C9%99k_%28Homoptera%29.png', 
    filename: 'homoptera.jpg' 
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
      },
      timeout: 30000,
    };
    
    console.log(`   Baixando de: ${url}`);
    
    const request = https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(filepath);
          if (stats.size > 1000) {
            console.log(`   ✅ Sucesso! (${(stats.size / 1024).toFixed(1)} KB)`);
            resolve();
          } else {
            fs.unlinkSync(filepath);
            reject(new Error('Arquivo muito pequeno, provavelmente erro'));
          }
        });
        file.on('error', reject);
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`   ↪️ Redirecionando para: ${redirectUrl}`);
        downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function downloadAllImages() {
  const assetsDir = path.join(__dirname, '../assets/ordens');
  
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  
  console.log('🚀 Iniciando download automático...\n');
  console.log(`📁 Destino: ${assetsDir}\n`);
  console.log('⏱️  Aguarde... cada download leva alguns segundos\n');
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  const entries = Object.entries(insectOrdersImages);
  
  for (let i = 0; i < entries.length; i++) {
    const [order, data] = entries[i];
    const filepath = path.join(assetsDir, data.filename);
    
    console.log(`\n[${i+1}/${entries.length}] ${order}`);
    
    // Verifica se já existe e é válido
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 1000) {
        console.log(`   ⏭️ Arquivo já existe (${(stats.size / 1024).toFixed(1)} KB)`);
        skipCount++;
        continue;
      }
    }
    
    try {
      await downloadImage(data.url, filepath);
      successCount++;
      
      // Pausa entre downloads para evitar bloqueio
      if (i < entries.length - 1) {
        console.log(`   ⏳ Aguardando 2 segundos...`);
        await sleep(2000);
      }
    } catch (error) {
      console.log(`   ❌ Falha: ${error.message}`);
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO FINAL');
  console.log('='.repeat(50));
  console.log(`✅ Novos downloads: ${successCount}`);
  console.log(`⏭️ Já existiam: ${skipCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  console.log(`📁 Localização: ${assetsDir}`);
  
  // Listar arquivos baixados
  console.log('\n📁 Arquivos na pasta ordens:');
  const files = fs.readdirSync(assetsDir);
  files.forEach(file => {
    const stats = fs.statSync(path.join(assetsDir, file));
    console.log(`   - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
}

// Executar
console.log('🔧 SCRIPT DE DOWNLOAD DE IMAGENS DE INSETOS\n');
downloadAllImages().catch(console.error);