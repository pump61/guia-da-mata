// scripts/downloadImagesSlow.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// Apenas as imagens que ainda faltam (baseado no seu último log)
const missingImages = {
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

function sleep(seconds) {
  console.log(`   😴 Aguardando ${seconds} segundos...`);
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      timeout: 60000, // 60 segundos de timeout
    };
    
    console.log(`   📥 Baixando de: ${url}`);
    
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
            reject(new Error('Arquivo muito pequeno'));
          }
        });
        file.on('error', reject);
      } else if (response.statusCode === 429) {
        reject(new Error('HTTP 429 - Too Many Requests'));
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        console.log(`   ↪️ Redirecionando...`);
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

async function downloadMissingImages() {
  const assetsDir = path.join(__dirname, '../assets/ordens');
  
  console.log('🚀 SCRIPT DE DOWNLOAD COM PAUSAS LONGAS\n');
  console.log('⏱️  Pausa de 15 segundos entre cada download');
  console.log('⏱️  Pausa de 30 segundos após cada erro 429\n');
  console.log(`📁 Destino: ${assetsDir}\n`);
  
  let successCount = 0;
  let failCount = 0;
  const entries = Object.entries(missingImages);
  
  for (let i = 0; i < entries.length; i++) {
    const [order, data] = entries[i];
    const filepath = path.join(assetsDir, data.filename);
    
    console.log(`\n[${i+1}/${entries.length}] ${order}`);
    
    // Verificar se já existe e é válido
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 1000) {
        console.log(`   ⏭️ Arquivo já existe (${(stats.size / 1024).toFixed(1)} KB)`);
        successCount++;
        continue;
      }
    }
    
    let retries = 0;
    const maxRetries = 3;
    let success = false;
    
    while (retries < maxRetries && !success) {
      try {
        await downloadImage(data.url, filepath);
        success = true;
        successCount++;
        
        // Pausa após sucesso (15 segundos)
        if (i < entries.length - 1) {
          await sleep(15);
        }
      } catch (error) {
        retries++;
        console.log(`   ❌ Tentativa ${retries}/${maxRetries} falhou: ${error.message}`);
        
        if (error.message.includes('429')) {
          // Pausa maior para erro 429 (30 segundos)
          await sleep(30);
        } else {
          // Pausa normal para outros erros (10 segundos)
          await sleep(10);
        }
      }
    }
    
    if (!success) {
      failCount++;
      console.log(`   ❌ ${order} falhou após ${maxRetries} tentativas`);
      
      // Pausa extra antes do próximo
      await sleep(20);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO FINAL');
  console.log('='.repeat(60));
  console.log(`✅ Baixados: ${successCount}`);
  console.log(`❌ Falhas: ${failCount}`);
  
  // Listar todos os arquivos na pasta
  console.log('\n📁 Arquivos na pasta ordens:');
  const files = fs.readdirSync(assetsDir);
  files.sort().forEach(file => {
    const stats = fs.statSync(path.join(assetsDir, file));
    console.log(`   - ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  });
  
  // Listar as que ainda faltam
  if (failCount > 0) {
    console.log('\n❌ Imagens que ainda faltam:');
    for (const [order, data] of entries) {
      const filepath = path.join(assetsDir, data.filename);
      if (!fs.existsSync(filepath) || fs.statSync(filepath).size < 1000) {
        console.log(`   - ${order}: ${data.url}`);
      }
    }
  }
}

// Executar
console.log('🔧 SCRIPT DE DOWNLOAD LENTO (EVITA 429)\n');
downloadMissingImages().catch(console.error);