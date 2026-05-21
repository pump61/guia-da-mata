/**
 * WoodAnatomyScreen.js  v4
 *
 * Fase 1 (lenta)  — preprocessWoodImage: decodifica + morfologia, 1×/imagem
 * Fase 2 (rápida) — detectLumens: filtros instantâneos via slider
 *
 * Extras:
 *  • Modo Detecção: toque numa elipse verde para remover a detecção incorreta
 *  • Modal de zoom: botão "Zoom 2×/1×" + ScrollViews aninhados para navegar
 *  • Métricas refletem apenas lúmens não removidos
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Ellipse, Text as SvgText } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';

import { useTheme } from '../utils/theme';
import {
  preprocessWoodImage,
  detectLumens,
  sensitivityToOptions,
} from '../utils/woodAnalysis';

const { width: SCREEN_W } = Dimensions.get('window');
const IMAGE_DISPLAY_W = SCREEN_W - 48;

const VIEW_MODES = [
  { key: 'original', label: 'Original' },
  { key: 'overlay',  label: 'Detecção' },
  { key: 'mask',     label: 'Máscara'  },
];

const DEFAULT_SENSITIVITY = 0.2;

// ─── Componente Principal ──────────────────────────────────────────────────────

export function WoodAnatomyScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { theme, fontScale } = useTheme();

  const [imageUri,     setImageUri]     = useState(null);
  const [preprocessed, setPreprocessed] = useState(null);
  const [result,       setResult]       = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [viewMode,     setViewMode]     = useState('original');
  const [sensitivity,  setSensitivity]  = useState(DEFAULT_SENSITIVITY);
  const [zoomVisible,  setZoomVisible]  = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [modalZoom,    setModalZoom]    = useState(1);

  // ── Lúmens ativos (sem os removidos manualmente) ─────────────────────────────
  const activeLumens = useMemo(
    () => result ? result.lumens.filter(l => !dismissedIds.has(l.id)) : [],
    [result, dismissedIds]
  );

  const activeCount = activeLumens.length;

  const activeAreaPercent = useMemo(() => {
    if (!result || activeLumens.length === 0) return 0;
    const total = result.processedWidth * result.processedHeight;
    return parseFloat(((activeLumens.reduce((s, l) => s + l.area, 0) / total) * 100).toFixed(1));
  }, [result, activeLumens]);

  // ── Escalas display ──────────────────────────────────────────────────────────
  const imageDisplayHeight = result
    ? Math.round((IMAGE_DISPLAY_W / result.processedWidth) * result.processedHeight)
    : Math.round(IMAGE_DISPLAY_W * 0.75);

  const sx = result ? IMAGE_DISPLAY_W / result.processedWidth  : 1;
  const sy = result ? imageDisplayHeight / result.processedHeight : 1;

  const modalImgH = result
    ? Math.round((SCREEN_W / result.processedWidth) * result.processedHeight)
    : Math.round(SCREEN_W * 0.75);
  const msx = result ? SCREEN_W / result.processedWidth  : 1;
  const msy = result ? modalImgH / result.processedHeight : 1;

  // ── Fase 1: Selecionar e pré-processar ───────────────────────────────────────
  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria nas configurações.');
      return;
    }

    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });
    if (picked.canceled || !picked.assets?.length) return;

    const uri = picked.assets[0].uri;
    setImageUri(uri);
    setPreprocessed(null);
    setResult(null);
    setViewMode('original');
    setSensitivity(DEFAULT_SENSITIVITY);
    setDismissedIds(new Set());
    setLoading(true);

    try {
      const pre = await preprocessWoodImage(uri);
      setPreprocessed(pre);
      const res = detectLumens(pre, sensitivityToOptions(DEFAULT_SENSITIVITY));
      setResult(res);
      setViewMode('overlay');
    } catch (err) {
      Alert.alert('Erro no processamento', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fase 2: Reaplicar filtros (instantâneo) ──────────────────────────────────
  const onSensitivityChange = useCallback((value) => {
    setSensitivity(value);
    if (!preprocessed) return;
    const res = detectLumens(preprocessed, sensitivityToOptions(value));
    setResult(res);
    setDismissedIds(new Set());
  }, [preprocessed]);

  // ── Salvar na galeria ────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!imageUri || saving) return;
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permita salvar fotos nas configurações.');
        return;
      }
      const local = await ImageManipulator.manipulateAsync(
        imageUri, [], { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      await MediaLibrary.createAssetAsync(local.uri);
      Alert.alert('Imagem salva!', `${activeCount} lúmens · ${activeAreaPercent}% de área`);
    } catch (err) {
      Alert.alert('Erro ao salvar', err.message ?? 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }, [imageUri, activeCount, activeAreaPercent, saving]);

  // ── Fechar modal ─────────────────────────────────────────────────────────────
  const closeModal = useCallback(() => {
    setZoomVisible(false);
    setModalZoom(1);
  }, []);

  // ── Remover lúmen manualmente ────────────────────────────────────────────────
  const dismissLumen = useCallback((id) => {
    setDismissedIds(prev => new Set([...prev, id]));
  }, []);

  // ── Overlay SVG — elipses com toque para remover ─────────────────────────────
  const renderOverlay = useCallback((lumens, scaleX, scaleY, imgW, imgH) => {
    if (!lumens?.length) return null;
    return (
      <Svg style={StyleSheet.absoluteFill} width={imgW} height={imgH}>
        {lumens.map((lumen) => (
          <Ellipse
            key={lumen.id}
            cx={(lumen.x + lumen.width  / 2) * scaleX}
            cy={(lumen.y + lumen.height / 2) * scaleY}
            rx={(lumen.width  / 2) * scaleX}
            ry={(lumen.height / 2) * scaleY}
            fill="rgba(60, 200, 100, 0.18)"
            stroke="rgba(30, 170, 70, 0.92)"
            strokeWidth={1.5}
            onPress={() => dismissLumen(lumen.id)}
          />
        ))}
      </Svg>
    );
  }, [dismissLumen]);

  // ── Máscara ───────────────────────────────────────────────────────────────────
  const renderMask = useCallback(() => {
    if (!result) return null;
    return (
      <View style={[woodStyles.maskContainer, { width: IMAGE_DISPLAY_W, height: imageDisplayHeight }]}>
        <Svg width={IMAGE_DISPLAY_W} height={imageDisplayHeight}>
          {activeLumens.map((lumen) => {
            const cx = (lumen.x + lumen.width  / 2) * sx;
            const cy = (lumen.y + lumen.height / 2) * sy;
            const rx = (lumen.width  / 2) * sx;
            const ry = (lumen.height / 2) * sy;
            const fs = Math.max(7, Math.min(13, Math.min(rx, ry) * 0.55));
            return (
              <React.Fragment key={lumen.id}>
                <Ellipse
                  cx={cx} cy={cy} rx={rx} ry={ry}
                  fill="rgba(100, 220, 140, 0.82)"
                  stroke="rgba(40, 170, 80, 1)"
                  strokeWidth={1}
                />
                {rx > 14 && ry > 10 && (
                  <SvgText
                    x={cx} y={cy + fs * 0.38}
                    textAnchor="middle"
                    fontSize={fs}
                    fill="#003a10"
                    fontWeight="700"
                  >
                    {`⌀${lumen.estDiameter}`}
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}
        </Svg>
        {activeLumens.length === 0 && (
          <Text style={[woodStyles.noLumensText, { color: theme.textMuted }]}>
            Nenhum lúmen detectado
          </Text>
        )}
      </View>
    );
  }, [result, activeLumens, imageDisplayHeight, sx, sy, theme]);

  const sensitivityLabel = sensitivity < 0.25
    ? 'Sensível — detecta lúmens pequenos e médios'
    : sensitivity < 0.55
    ? 'Moderado — equilíbrio entre cobertura e precisão'
    : sensitivity < 0.78
    ? 'Seletivo — exige vasos bem definidos'
    : 'Muito seletivo — apenas grandes vasos com núcleo sólido';

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[woodStyles.root, { backgroundColor: theme.background }]} edges={['top','right','bottom','left']}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={[woodStyles.scroll, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 28) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Cabeçalho ─────────────────────────────────────────────────────── */}
        <View style={woodStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={[woodStyles.backBtn, { borderColor: theme.border }]}
            activeOpacity={0.7}
          >
            <Text style={[woodStyles.backBtnText, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Voltar
            </Text>
          </TouchableOpacity>
          <Text style={[woodStyles.title, { color: theme.textPrimary, fontSize: 20 * fontScale }]}>
            Anatomia de Madeira
          </Text>
          <Text style={[woodStyles.subtitle, { color: theme.textSecondary, fontSize: 12 * fontScale }]}>
            Detecção de lúmens e vasos por microscopia
          </Text>
        </View>

        {/* ── Card de seleção ───────────────────────────────────────────────── */}
        <View style={[woodStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[woodStyles.cardTitle, { color: theme.textPrimary, fontSize: 15 * fontScale }]}>
            Como funciona
          </Text>
          <Text style={[woodStyles.cardBody, { color: theme.textSecondary, fontSize: 12 * fontScale }]}>
            Selecione uma imagem de corte transversal. O algoritmo detecta os grandes
            lúmens/vasos usando threshold de Otsu, morfologia e verificação de núcleo sólido.
          </Text>
          <View style={woodStyles.techBadgeRow}>
            {['Threshold Otsu', 'Morfologia', 'BFS Labels', 'Núcleo Sólido'].map(tag => (
              <View key={tag} style={[woodStyles.techBadge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[woodStyles.techBadgeText, { color: theme.textMuted, fontSize: 10 * fontScale }]}>{tag}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={[woodStyles.pickBtn, { backgroundColor: theme.accent }]}
            onPress={pickImage}
            activeOpacity={0.85}
          >
            <Text style={[woodStyles.pickBtnText, { color: theme.accentText, fontSize: 14 * fontScale }]}>
              {imageUri ? 'Selecionar Nova Imagem' : 'Selecionar Imagem da Galeria'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Carregamento ──────────────────────────────────────────────────── */}
        {loading && (
          <View style={[woodStyles.loadingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={[woodStyles.loadingText, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Processando imagem...
            </Text>
            <Text style={[woodStyles.loadingSubText, { color: theme.textMuted, fontSize: 11 * fontScale }]}>
              Otsu → morfologia → verificação de núcleo sólido
            </Text>
          </View>
        )}

        {/* ── Visualização ──────────────────────────────────────────────────── */}
        {imageUri && !loading && (
          <View style={[woodStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Abas */}
            <View style={[woodStyles.tabRow, { borderColor: theme.border }]}>
              {VIEW_MODES.map(mode => {
                const active = viewMode === mode.key;
                return (
                  <TouchableOpacity
                    key={mode.key}
                    onPress={() => setViewMode(mode.key)}
                    style={[woodStyles.tab, { backgroundColor: active ? theme.accent : theme.surface }]}
                    activeOpacity={0.8}
                  >
                    <Text style={[woodStyles.tabText, { fontSize: 12 * fontScale, color: active ? theme.accentText : theme.textMuted, fontWeight: active ? '600' : '400' }]}>
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Imagem — toque abre modal */}
            <TouchableOpacity activeOpacity={0.92} onPress={() => setZoomVisible(true)}>
              <View style={[woodStyles.imageWrapper, { width: IMAGE_DISPLAY_W, height: imageDisplayHeight, borderColor: theme.border }]}>
                {viewMode !== 'mask' && (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: IMAGE_DISPLAY_W, height: imageDisplayHeight }}
                    resizeMode="stretch"
                  />
                )}
                {viewMode === 'overlay' && result && renderOverlay(activeLumens, sx, sy, IMAGE_DISPLAY_W, imageDisplayHeight)}
                {viewMode === 'mask'    && renderMask()}

                <View style={woodStyles.modeBadge}>
                  <Text style={[woodStyles.modeBadgeText, { fontSize: 10 * fontScale }]}>
                    {viewMode === 'original' ? 'Original' : viewMode === 'overlay' ? `${activeCount} lúmens` : 'Máscara'}
                  </Text>
                </View>
                <View style={woodStyles.zoomHint}>
                  <Text style={[woodStyles.zoomHintText, { fontSize: 9 * fontScale }]}>Toque para abrir</Text>
                </View>
              </View>
            </TouchableOpacity>

            {viewMode === 'overlay' && result && (
              <>
                <Text style={[woodStyles.overlayNote, { color: theme.textMuted, fontSize: 11 * fontScale }]}>
                  Elipses verdes = vasos detectados · threshold Otsu: {result.otsuThreshold}
                </Text>
                <Text style={[woodStyles.removeHint, { color: theme.textMuted, fontSize: 10 * fontScale }]}>
                  Toque em uma elipse para remover uma detecção incorreta
                </Text>
              </>
            )}
            {viewMode === 'mask' && result && (
              <Text style={[woodStyles.overlayNote, { color: theme.textMuted, fontSize: 11 * fontScale }]}>
                ⌀ = diâmetro equivalente (px no espaço de 400 px)
              </Text>
            )}
          </View>
        )}

        {/* ── Resultados + Slider ───────────────────────────────────────────── */}
        {result && !loading && (
          <View style={[woodStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[woodStyles.cardTitle, { color: theme.textPrimary, fontSize: 15 * fontScale }]}>
              Resultados
            </Text>

            <View style={woodStyles.metricsRow}>
              <MetricBox line1="Lúmens" line2="detectados" value={String(activeCount)} theme={theme} fontScale={fontScale} />
              <MetricBox line1="Área" line2="ocupada" value={`${activeAreaPercent}%`} theme={theme} fontScale={fontScale} />
            </View>

            {/* Slider de Seletividade */}
            <View style={[woodStyles.sliderBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[woodStyles.sliderTitle, { color: theme.textSecondary, fontSize: 11 * fontScale }]}>
                FILTRO DE TAMANHO
              </Text>
              <View style={woodStyles.sliderPoles}>
                <Text style={[woodStyles.sliderPole, { color: theme.textMuted, fontSize: 10 * fontScale }]}>Sensível</Text>
                <Text style={[woodStyles.sliderPole, { color: theme.textMuted, fontSize: 10 * fontScale }]}>Seletivo</Text>
              </View>
              <Slider
                style={woodStyles.slider}
                minimumValue={0}
                maximumValue={1}
                step={0.05}
                value={sensitivity}
                onValueChange={onSensitivityChange}
                minimumTrackTintColor={theme.accent}
                maximumTrackTintColor={theme.border}
                thumbTintColor={theme.accent}
              />
              <Text style={[woodStyles.sliderDesc, { color: theme.textMuted, fontSize: 10 * fontScale }]}>
                {sensitivityLabel}
              </Text>
              <Text style={[woodStyles.sliderHint, { color: theme.textMuted, fontSize: 10 * fontScale }]}>
                Se detectou células pequenas, arraste para a direita.
              </Text>
            </View>

            {/* Parâmetros técnicos */}
            <View style={[woodStyles.techInfoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[woodStyles.techInfoTitle, { color: theme.textSecondary, fontSize: 10 * fontScale }]}>
                PARÂMETROS ATIVOS
              </Text>
              <TechRow label="Threshold (Otsu)"   value={String(result.otsuThreshold)}                               theme={theme} fs={fontScale} />
              <TechRow label="Imagem"              value={`${result.processedWidth} × ${result.processedHeight} px`}  theme={theme} fs={fontScale} />
              <TechRow label="Área mín."           value={`${(sensitivityToOptions(sensitivity).minAreaFraction * 100).toFixed(1)} %`} theme={theme} fs={fontScale} />
              <TechRow label="Kernel verificação"  value={`${sensitivityToOptions(sensitivity).verifyKernelSize} × ${sensitivityToOptions(sensitivity).verifyKernelSize}`} theme={theme} fs={fontScale} />
            </View>

            <Text style={[woodStyles.interpNote, { color: theme.textMuted, fontSize: 11 * fontScale }]}>
              {activeCount === 0
                ? 'Nenhum vaso detectado. Tente seletividade menor ou imagem com mais contraste.'
                : activeAreaPercent > 30
                ? `Alta porosidade (${activeAreaPercent}%). Típico de folhosas em anel (carvalho, freixo).`
                : activeAreaPercent > 10
                ? `Porosidade moderada (${activeAreaPercent}%). Madeira difuso-porosa.`
                : `Baixa porosidade (${activeAreaPercent}%). Possível madeira densa ou conífera.`
              }
            </Text>

            <TouchableOpacity
              style={[woodStyles.newBtn, { borderColor: theme.accent }]}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              <Text style={[woodStyles.newBtnText, { color: theme.accent, fontSize: 13 * fontScale }]}>
                Nova Análise
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ── Modal de Zoom + Salvar ─────────────────────────────────────────────── */}
      <Modal
        visible={zoomVisible}
        animationType="fade"
        transparent={false}
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        <View style={woodStyles.modalRoot}>

          {/* Barra superior */}
          <View style={[woodStyles.modalTopBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity onPress={closeModal} style={woodStyles.modalActionBtn}>
              <Text style={woodStyles.modalActionBtnText}>Fechar</Text>
            </TouchableOpacity>

            <Text style={woodStyles.modalTitle} numberOfLines={1}>
              {activeCount} lúmens · {activeAreaPercent}%
            </Text>

            <TouchableOpacity
              onPress={() => setModalZoom(z => z === 1 ? 2 : 1)}
              style={woodStyles.modalActionBtn}
            >
              <Text style={woodStyles.modalActionBtnText}>
                {modalZoom === 1 ? 'Zoom 2x' : 'Zoom 1x'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Imagem com zoom/pan via ScrollViews aninhados */}
          <ScrollView
            style={{ flex: 1 }}
            scrollEnabled={modalZoom > 1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalZoom === 1
              ? { flex: 1, alignItems: 'center', justifyContent: 'center' }
              : { flexGrow: 1 }
            }
          >
            <ScrollView
              horizontal
              scrollEnabled={modalZoom > 1}
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
            >
              <View style={{ width: SCREEN_W * modalZoom, height: modalImgH * modalZoom }}>
                {imageUri && (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: SCREEN_W * modalZoom, height: modalImgH * modalZoom }}
                    resizeMode="stretch"
                  />
                )}
                {viewMode === 'overlay' && renderOverlay(
                  activeLumens,
                  msx * modalZoom,
                  msy * modalZoom,
                  SCREEN_W * modalZoom,
                  modalImgH * modalZoom
                )}
              </View>
            </ScrollView>
          </ScrollView>

          {/* Relatório */}
          {result && (
            <View style={woodStyles.modalReport}>
              <Text style={woodStyles.modalReportTitle}>ANÁLISE ANATÔMICA DE MADEIRA</Text>
              <View style={woodStyles.modalReportRow}>

                <View style={woodStyles.modalReportItem}>
                  <Text style={woodStyles.modalReportValue}>{activeCount}</Text>
                  <Text style={woodStyles.modalReportLabel}>Lúmens</Text>
                  <Text style={woodStyles.modalReportLabel}>detectados</Text>
                </View>

                <View style={woodStyles.modalReportDivider} />

                <View style={woodStyles.modalReportItem}>
                  <Text style={woodStyles.modalReportValue}>{activeAreaPercent}%</Text>
                  <Text style={woodStyles.modalReportLabel}>Área</Text>
                  <Text style={woodStyles.modalReportLabel}>ocupada</Text>
                </View>

                <View style={woodStyles.modalReportDivider} />

                <View style={woodStyles.modalReportItem}>
                  <Text style={woodStyles.modalReportValue}>{result.otsuThreshold}</Text>
                  <Text style={woodStyles.modalReportLabel}>Threshold</Text>
                  <Text style={woodStyles.modalReportLabel}>Otsu</Text>
                </View>

                <View style={woodStyles.modalReportDivider} />

                <View style={woodStyles.modalReportItem}>
                  <Text style={woodStyles.modalReportValue}>
                    {result.processedWidth}×{result.processedHeight}
                  </Text>
                  <Text style={woodStyles.modalReportLabel}>Resolução</Text>
                  <Text style={woodStyles.modalReportLabel}>processada</Text>
                </View>

              </View>
            </View>
          )}

          {/* Rodapé */}
          <View style={[woodStyles.modalFooter, { paddingBottom: insets.bottom + 8 }]}>
            {viewMode === 'overlay'
              ? <Text style={woodStyles.modalFooterHint}>
                  Toque nas elipses para remover detecções incorretas
                </Text>
              : <Text style={woodStyles.modalFooterHint}>
                  {modalZoom === 1 ? 'Botão "Zoom 2x" para ampliar e navegar' : 'Arraste para navegar · "Zoom 1x" para reduzir'}
                </Text>
            }
            <TouchableOpacity
              style={[woodStyles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={woodStyles.saveBtnText}>Salvar na Galeria</Text>
              }
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Sub-componentes ───────────────────────────────────────────────────────────

function MetricBox({ line1, line2, value, theme, fontScale }) {
  return (
    <View style={[woodStyles.metricBox, { backgroundColor: theme.accent, borderColor: theme.border }]}>
      <Text style={[woodStyles.metricValue,    { color: theme.accentText, fontSize: 28 * fontScale }]}>{value}</Text>
      <Text style={[woodStyles.metricLabel,    { color: theme.accentText, fontSize: 11 * fontScale }]}>{line1}</Text>
      <Text style={[woodStyles.metricLabelSub, { color: theme.accentText, fontSize: 11 * fontScale }]}>{line2}</Text>
    </View>
  );
}

function TechRow({ label, value, theme, fs }) {
  return (
    <View style={woodStyles.techRow}>
      <Text style={[woodStyles.techRowLabel, { color: theme.textMuted,   fontSize: 11 * fs }]}>{label}</Text>
      <Text style={[woodStyles.techRowValue, { color: theme.textPrimary, fontSize: 11 * fs }]}>{value}</Text>
    </View>
  );
}

// ─── Estilos ───────────────────────────────────────────────────────────────────

const woodStyles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: 24, gap: 16 },

  header:      { marginBottom: 4 },
  backBtn:     { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginBottom: 12 },
  backBtnText: { fontWeight: '400', letterSpacing: 0.2 },
  title:       { fontWeight: '600', letterSpacing: 0.3, marginBottom: 3 },
  subtitle:    { fontWeight: '300', lineHeight: 18 },

  card:      { borderRadius: 18, padding: 18, borderWidth: 1, gap: 12 },
  cardTitle: { fontWeight: '600', letterSpacing: 0.2 },
  cardBody:  { lineHeight: 19, fontWeight: '300' },

  techBadgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  techBadge:    { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  techBadgeText:{ fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.8 },

  pickBtn:     { borderRadius: 13, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  pickBtnText: { fontWeight: '500', letterSpacing: 0.2 },

  loadingCard:    { borderRadius: 18, padding: 28, borderWidth: 1, alignItems: 'center', gap: 10 },
  loadingText:    { fontWeight: '400', letterSpacing: 0.2 },
  loadingSubText: { textAlign: 'center', lineHeight: 17, fontWeight: '300', maxWidth: 260 },

  tabRow: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  tab:    { flex: 1, paddingVertical: 9, alignItems: 'center', justifyContent: 'center' },
  tabText:{ letterSpacing: 0.1 },

  imageWrapper:  { borderRadius: 12, overflow: 'hidden', borderWidth: 1, alignSelf: 'center', position: 'relative' },
  maskContainer: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  noLumensText:  { fontSize: 13, textAlign: 'center' },

  modeBadge:     { position: 'absolute', bottom: 8, left: 8, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: 'rgba(0,0,0,0.55)' },
  modeBadgeText: { color: '#fff', fontWeight: '500' },
  zoomHint:      { position: 'absolute', bottom: 8, right: 8, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: 'rgba(0,0,0,0.40)' },
  zoomHintText:  { color: 'rgba(255,255,255,0.85)' },
  overlayNote:   { fontWeight: '300', lineHeight: 16, marginTop: -4 },
  removeHint:    { fontWeight: '300', lineHeight: 15, marginTop: -6, fontStyle: 'italic', opacity: 0.8 },

  metricsRow:    { flexDirection: 'row', gap: 10 },
  metricBox:     { flex: 1, borderRadius: 14, borderWidth: 1, paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', gap: 2 },
  metricValue:   { fontWeight: '700', letterSpacing: 0.5 },
  metricLabel:   { fontWeight: '600', textAlign: 'center', opacity: 0.9 },
  metricLabelSub:{ fontWeight: '300', textAlign: 'center', opacity: 0.8, marginTop: -2 },

  sliderBox:   { borderRadius: 12, borderWidth: 1, padding: 14, gap: 6 },
  sliderTitle: { fontWeight: '600', letterSpacing: 1.0, textTransform: 'uppercase' },
  sliderPoles: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: -6 },
  sliderPole:  { fontWeight: '400', opacity: 0.7 },
  slider:      { width: '100%', height: 36 },
  sliderDesc:  { textAlign: 'center', fontWeight: '500', marginTop: -4 },
  sliderHint:  { textAlign: 'center', fontWeight: '300', lineHeight: 15, opacity: 0.8 },

  techInfoBox:  { borderRadius: 12, borderWidth: 1, padding: 12, gap: 6 },
  techInfoTitle:{ fontWeight: '600', letterSpacing: 1.0, textTransform: 'uppercase', marginBottom: 2 },
  techRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  techRowLabel: { fontWeight: '300' },
  techRowValue: { fontWeight: '500' },

  interpNote: { lineHeight: 17, fontWeight: '300', fontStyle: 'italic' },
  newBtn:     { borderRadius: 12, borderWidth: 1.5, minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  newBtnText: { fontWeight: '500', letterSpacing: 0.2 },

  // Modal
  modalRoot:          { flex: 1, backgroundColor: '#0d0d0d' },
  modalTopBar:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 10, backgroundColor: '#161616' },
  modalActionBtn:     { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.1)', minWidth: 72, alignItems: 'center' },
  modalActionBtnText: { color: '#ccc', fontSize: 13, fontWeight: '500' },
  modalTitle:         { color: '#fff', fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'center', marginHorizontal: 8 },

  modalReport:        { backgroundColor: '#1c1c1e', paddingVertical: 14, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#2a2a2e' },
  modalReportTitle:   { color: '#6b9e7a', fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textAlign: 'center', marginBottom: 10, textTransform: 'uppercase' },
  modalReportRow:     { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  modalReportItem:    { flex: 1, alignItems: 'center', gap: 2 },
  modalReportValue:   { color: '#e8f5ec', fontSize: 20, fontWeight: '700', letterSpacing: 0.3 },
  modalReportLabel:   { color: '#8a9e90', fontSize: 10, fontWeight: '400', lineHeight: 13 },
  modalReportDivider: { width: 1, height: 40, backgroundColor: '#2e3e34', marginHorizontal: 4 },

  modalFooter:     { backgroundColor: '#161616', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, gap: 8 },
  modalFooterHint: { color: '#666', fontSize: 10, textAlign: 'center' },
  saveBtn:         { backgroundColor: '#2eaa5e', borderRadius: 13, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  saveBtnText:     { color: '#fff', fontSize: 14, fontWeight: '600', letterSpacing: 0.2 },
});
