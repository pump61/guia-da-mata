/**
 * woodAnalysis.js  —  Pipeline de visão computacional para detecção de lúmens
 *
 * Duas fases separadas para permitir re-filtragem instantânea sem re-processar:
 *
 *   preprocessWoodImage(uri)          → lento (~1-3s): decodifica, normaliza,
 *                                        aplica morfologia, retorna máscara binária
 *
 *   detectLumens(preprocessed, opts)  → rápido (<100ms): componentes conectados
 *                                        + filtros ajustáveis pelo usuário
 *
 *   analyzeWoodImage(uri, opts)        → atalho que chama as duas fases
 */

import * as ImageManipulator from 'expo-image-manipulator';
import jpeg from 'jpeg-js';

// ─── Constantes do Pipeline ────────────────────────────────────────────────────

const PROCESS_MAX_DIM  = 400;   // px máximo para processamento
const MAX_AREA_FRACTION = 0.80; // ignora regiões > 80% da imagem (fundo)
const MIN_COMPACTNESS   = 0.18; // área_real / área_bbox mínima (filtra formas muito irregulares)
const MORPH_CLOSE_SIZE  = 1;    // desabilitado: evita fusão de células de parênquima adjacentes
const MORPH_OPEN_SIZE   = 13;   // remove micro-estruturas e células pequenas

// ─── API Pública ───────────────────────────────────────────────────────────────

/**
 * Fase 1 — Pré-processamento.
 * Roda uma única vez por imagem selecionada.
 * Retorna a máscara binária morfológica pronta para a fase 2.
 */
export async function preprocessWoodImage(imageUri) {
  // 1. Redimensionar
  const result = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: PROCESS_MAX_DIM } }],
    { compress: 0.95, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  const { width: W, height: H, base64 } = result;

  // 2. Decodificar JPEG → RGBA
  const rawB64  = base64.includes(',') ? base64.split(',')[1] : base64;
  const jpegBytes = base64ToUint8Array(rawB64);
  let rgbaData;
  try {
    const decoded = jpeg.decode(jpegBytes, { useTArray: true });
    rgbaData = decoded.data;
  } catch (err) {
    throw new Error(`Falha ao decodificar imagem: ${err.message}`);
  }

  // 3. Escala de cinza (luminosidade ponderada BT.601)
  const gray = rgbaToGray(rgbaData, W, H);

  // 4. Equalização global de histograma (normaliza variações de iluminação)
  const equalized = histogramEqualize(gray);

  // 5. Blur Gaussiano 5×5 separável (reduz ruído de alta frequência)
  const blurred = gaussianBlur5x5(equalized, W, H);

  // 6. Threshold de Otsu (limiar ótimo automático entre fundo e lúmens)
  const otsuT  = computeOtsuThreshold(blurred);
  let   binary = applyThreshold(blurred, otsuT);

  // 7. Fechamento morfológico (fecha lacunas pequenas dentro dos vasos)
  binary = morphClose(binary, W, H, MORPH_CLOSE_SIZE);

  // 8. Abertura morfológica (remove células pequenas e ruídos)
  binary = morphOpen(binary, W, H, MORPH_OPEN_SIZE);

  return { binary, W, H, otsuThreshold: otsuT };
}

/**
 * Fase 2 — Detecção de lúmens com filtros ajustáveis.
 * Roda em < 100ms — pode ser repetida ao mudar o slider de seletividade.
 *
 * @param {{ binary, W, H, otsuThreshold }} preprocessed  saída da fase 1
 * @param {{ minAreaFraction?, verifyKernelSize?, minCompactness? }} options
 */
export function detectLumens(preprocessed, options = {}) {
  const { binary, W, H, otsuThreshold } = preprocessed;
  const {
    minAreaFraction  = 0.006,
    verifyKernelSize = 11,     // erosão extra para verificar núcleo sólido
    minCompactness   = MIN_COMPACTNESS,
  } = options;

  const regions    = connectedComponentsBFS(binary, W, H);
  const totalPixels = W * H;
  const minArea    = totalPixels * minAreaFraction;
  const maxArea    = totalPixels * MAX_AREA_FRACTION;

  const lumens = regions
    .filter(r => {
      // Filtro 1: área absoluta
      if (r.area < minArea || r.area > maxArea) return false;

      // Filtro 2: compacidade (rejeita nuvens de pontos fundidos)
      const bboxArea = (r.maxX - r.minX + 1) * (r.maxY - r.minY + 1);
      if (r.area / bboxArea < minCompactness) return false;

      // Filtro 3: verificação de núcleo sólido.
      // Erode fortemente a sub-imagem da região. Se sobrar algum pixel branco,
      // o lúmen tem "profundidade" real em todas as direções → é um vaso genuíno.
      // Grupos de células pequenas (parênquima) não sobrevivem a esta erosão.
      if (verifyKernelSize > 1 && !hasLumenCore(r, binary, W, verifyKernelSize)) {
        return false;
      }

      return true;
    })
    .map((r, i) => {
      const w   = r.maxX - r.minX + 1;
      const h   = r.maxY - r.minY + 1;
      const estDiameter = Math.round(2 * Math.sqrt(r.area / Math.PI));
      return { id: i, x: r.minX, y: r.minY, width: w, height: h, area: r.area, estDiameter };
    })
    .sort((a, b) => b.area - a.area);

  const detectedArea = lumens.reduce((acc, r) => acc + r.area, 0);
  const areaPercent  = parseFloat(((detectedArea / totalPixels) * 100).toFixed(1));

  return {
    lumens,
    lumenCount:      lumens.length,
    areaPercent,
    otsuThreshold,
    processedWidth:  W,
    processedHeight: H,
  };
}

/**
 * Atalho: pré-processa e detecta em uma única chamada.
 * Retorna o resultado completo mais o objeto preprocessed para re-filtragem.
 */
export async function analyzeWoodImage(imageUri, options = {}) {
  const pre = await preprocessWoodImage(imageUri);
  const res = detectLumens(pre, options);
  return { ...res, preprocessed: pre };
}

/**
 * Converte um valor de seletividade (0.0 = sensível, 1.0 = seletivo)
 * em opções concretas para detectLumens.
 *
 * Intervalo calibrado para imagens 400px:
 *   s=0.0 → min área ~0.1% (diâmetro ~22px), kernel=1 (sem erosão extra)
 *   s=0.2 → min área ~0.6% (diâmetro ~31px), kernel=3  ← padrão
 *   s=0.5 → min área ~1.3% (diâmetro ~46px), kernel=6→7
 *   s=1.0 → min área ~2.5% (diâmetro ~64px), kernel=11
 */
export function sensitivityToOptions(s) {
  // minAreaFraction: 0.001 → 0.025 (escala comprimida para detectar vasos médios)
  const minAreaFraction = 0.001 + s * 0.024;

  // verifyKernelSize: 1 → 11 (cresce lentamente para não rejeitar vasos reais)
  const raw = Math.round(1 + s * 10);
  const verifyKernelSize = raw % 2 === 0 ? raw + 1 : raw;

  return { minAreaFraction, verifyKernelSize, minCompactness: MIN_COMPACTNESS };
}

// ─── Verificação de Núcleo Sólido ─────────────────────────────────────────────

/**
 * Verifica se a região tem um "núcleo sólido" ao aplicar erosão profunda
 * sobre a sub-imagem do bounding box da região.
 *
 * Lúmen real (vaso): após erosão, sobram pixels → tem "espessura" em todas as direções.
 * Grupo de células (parênquima): após erosão profunda, NENHUM pixel sobra → é oco.
 */
function hasLumenCore(region, binary, W, verifyK) {
  const rw  = region.maxX - region.minX + 1;
  const rh  = region.maxY - region.minY + 1;
  const sub = new Uint8Array(rw * rh);

  for (let y = 0; y < rh; y++) {
    for (let x = 0; x < rw; x++) {
      sub[y * rw + x] = binary[(region.minY + y) * W + (region.minX + x)];
    }
  }

  const eroded = erode(sub, rw, rh, verifyK);
  for (let i = 0; i < eroded.length; i++) {
    if (eroded[i] === 1) return true;
  }
  return false;
}

// ─── Conversão e Pré-processamento ────────────────────────────────────────────

function base64ToUint8Array(b64) {
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

function rgbaToGray(rgba, w, h) {
  const n    = w * h;
  const gray = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    gray[i] = (0.299 * rgba[i * 4] + 0.587 * rgba[i * 4 + 1] + 0.114 * rgba[i * 4 + 2] + 0.5) | 0;
  }
  return gray;
}

function histogramEqualize(gray) {
  const n    = gray.length;
  const hist = new Int32Array(256);
  for (let i = 0; i < n; i++) hist[gray[i]]++;

  const cdf = new Int32Array(256);
  cdf[0] = hist[0];
  for (let i = 1; i < 256; i++) cdf[i] = cdf[i - 1] + hist[i];

  let cdfMin = 0;
  for (let i = 0; i < 256; i++) { if (cdf[i] > 0) { cdfMin = cdf[i]; break; } }

  const out   = new Uint8Array(n);
  const range = n - cdfMin;
  if (range === 0) return gray.slice();

  for (let i = 0; i < n; i++) {
    out[i] = Math.round(((cdf[gray[i]] - cdfMin) / range) * 255);
  }
  return out;
}

function gaussianBlur5x5(src, w, h) {
  const K = [1, 4, 6, 4, 1];
  const N = 16;
  const tmp = new Uint8Array(w * h);
  const dst = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let k = 0; k < 5; k++) {
        acc += src[row + Math.max(0, Math.min(w - 1, x + k - 2))] * K[k];
      }
      tmp[row + x] = (acc / N) | 0;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let k = 0; k < 5; k++) {
        acc += tmp[Math.max(0, Math.min(h - 1, y + k - 2)) * w + x] * K[k];
      }
      dst[y * w + x] = (acc / N) | 0;
    }
  }
  return dst;
}

function computeOtsuThreshold(gray) {
  const n    = gray.length;
  const hist = new Int32Array(256);
  for (let i = 0; i < n; i++) hist[gray[i]]++;

  let total = 0;
  for (let i = 0; i < 256; i++) total += i * hist[i];

  let sumB = 0, wB = 0, maxVar = 0, bestT = 0;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = n - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (total - sumB) / wF;
    const v  = wB * wF * (mB - mF) * (mB - mF);
    if (v > maxVar) { maxVar = v; bestT = t; }
  }
  return bestT;
}

function applyThreshold(gray, t) {
  const b = new Uint8Array(gray.length);
  for (let i = 0; i < gray.length; i++) b[i] = gray[i] > t ? 1 : 0;
  return b;
}

// ─── Morfologia (implementação separável O(n·k)) ──────────────────────────────

function dilate(src, w, h, kSize) {
  const r   = kSize >> 1;
  const tmp = new Uint8Array(w * h);
  const dst = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let f = false;
      for (let dx = -r; dx <= r && !f; dx++) {
        const nx = x + dx;
        if (nx >= 0 && nx < w && src[row + nx] === 1) f = true;
      }
      tmp[row + x] = f ? 1 : 0;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let f = false;
      for (let dy = -r; dy <= r && !f; dy++) {
        const ny = y + dy;
        if (ny >= 0 && ny < h && tmp[ny * w + x] === 1) f = true;
      }
      dst[y * w + x] = f ? 1 : 0;
    }
  }
  return dst;
}

function erode(src, w, h, kSize) {
  const r   = kSize >> 1;
  const tmp = new Uint8Array(w * h);
  const dst = new Uint8Array(w * h);

  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let all = true;
      for (let dx = -r; dx <= r && all; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= w || src[row + nx] === 0) all = false;
      }
      tmp[row + x] = all ? 1 : 0;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let all = true;
      for (let dy = -r; dy <= r && all; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h || tmp[ny * w + x] === 0) all = false;
      }
      dst[y * w + x] = all ? 1 : 0;
    }
  }
  return dst;
}

function morphClose(b, w, h, k) { return erode(dilate(b, w, h, k), w, h, k); }
function morphOpen(b, w, h, k)  { return dilate(erode(b, w, h, k), w, h, k); }

// ─── Componentes Conectados (BFS) ─────────────────────────────────────────────

function connectedComponentsBFS(binary, w, h) {
  const visited = new Uint8Array(w * h);
  const regions = [];
  const queue   = new Int32Array(w * h);

  for (let sy = 0; sy < h; sy++) {
    for (let sx = 0; sx < w; sx++) {
      const idx = sy * w + sx;
      if (binary[idx] === 0 || visited[idx] === 1) continue;

      const region = { area: 0, minX: sx, minY: sy, maxX: sx, maxY: sy };
      let head = 0, tail = 0;
      queue[tail++]  = idx;
      visited[idx]   = 1;

      while (head < tail) {
        const cur = queue[head++];
        const cy  = (cur / w) | 0;
        const cx  = cur - cy * w;

        region.area++;
        if (cx < region.minX) region.minX = cx;
        if (cy < region.minY) region.minY = cy;
        if (cx > region.maxX) region.maxX = cx;
        if (cy > region.maxY) region.maxY = cy;

        if (cy > 0)     { const n = cur - w; if (binary[n] && !visited[n]) { visited[n] = 1; queue[tail++] = n; } }
        if (cy < h - 1) { const n = cur + w; if (binary[n] && !visited[n]) { visited[n] = 1; queue[tail++] = n; } }
        if (cx > 0)     { const n = cur - 1; if (binary[n] && !visited[n]) { visited[n] = 1; queue[tail++] = n; } }
        if (cx < w - 1) { const n = cur + 1; if (binary[n] && !visited[n]) { visited[n] = 1; queue[tail++] = n; } }
      }

      regions.push(region);
    }
  }
  return regions;
}
