import Slider from '@react-native-community/slider';
import * as NavigationBar from 'expo-navigation-bar';
import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import chaveA from './data/chaveA.json';
import chaveB from './data/chaveB.json';
import chaveC from './data/chaveC.json';
import chaveD from './data/chaveD.json';
import dendrologico from './data/dendrologico.json';
import chaveInsetos from './data/chaveInsetos.json';
import { botanicImages, getBotanicImage } from './data/botanicImages';
import { insectImages, getInsectImage } from './data/insectImages';
import { getThemeLogo } from './utils/themeLogo';
import SplashScreen from './SplashScreen';
import { normalizeKeyData, getItemById, isNodeDestination } from './utils/keyEngine';
import { ThemeProvider, useTheme } from './utils/theme';
import { AgriculturalScreen } from './screens/AgriculturalScreen';
import { WoodAnatomyScreen } from './screens/WoodAnatomyScreen';

// Suprime o warning do NavigationBar no Expo Go
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('setBackgroundColorAsync')) return;
  originalWarn(...args);
};

const Stack = createNativeStackNavigator();

const rawBotanicKeys = { A: chaveA, B: chaveB, C: chaveC, D: chaveD };
const botanicKeyTitles = { A: 'Chave A', B: 'Chave B', C: 'Chave C', D: 'Chave D' };
const botanicKeySubtitles = {
  A: 'Flores aclamídeas ou monoclamídeas',
  B: 'Flores diclamídeas dialipétalas',
  C: 'Flores diclamídeas gamopétalas',
  D: 'Gimnospermas',
};

const rawDendroKeys = { D: dendrologico };
const dendroKeyTitles = { D: 'Chave Dendrológica' };
const dendroKeySubtitles = { D: 'Identificação vegetativa de espécies arbóreas' };

const rawInsectKeys = { I: chaveInsetos };
const insectKeyTitles = { I: 'Chave Entomológica' };
const insectKeySubtitles = { I: 'Identificação de ordens de insetos' };

function getResultImage(result, mode) {
  if (!result) return null;
  
  if (mode === 'insect') {
    return getInsectImage(result);
  } else {
    // Modo botanic ou dendro
    const clean = result.split('(')[0].trim();
    return botanicImages[result] || botanicImages[clean] || null;
  }
}

// ─── SWATCHES ────────────────────────────────────────────────────────────────

const SWATCHES = [
  { name: 'Moss',   color: '#7A9E76', border: '#5C7D58' },
  { name: 'Stone',  color: '#F5F2ED', border: '#C9B99A' },
  { name: 'Mist',   color: '#7A95AA', border: '#5C7A8E' },
  { name: 'Clay',   color: '#B8956A', border: '#9A7A52' },
  { name: 'Dusk',   color: '#8E82BE', border: '#7265A4' },
  { name: 'Sakura', color: '#C48A94', border: '#A86E78' },
  { name: 'Ink',    color: '#3A3A3A', border: '#888888' },
];

// ─── PAINEL DE AJUSTES ────────────────────────────────────────────────────────

function SettingsPanel({ visible, onClose }) {
  const { theme, themeName, selectTheme, fontScale, setFontScale } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const backdropOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const panelOpacity    = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const translateY      = anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.name === 'Ink' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)',
              opacity: backdropOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback>
        <Animated.View
          style={[
            panelStyles.panel,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              opacity: panelOpacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={[panelStyles.sectionLabel, { color: theme.textMuted }]}>TEMA</Text>
          <View style={panelStyles.swatchRow}>
            {SWATCHES.map((s) => {
              const active = themeName === s.name;
              return (
                <TouchableOpacity
                  key={s.name}
                  onPress={() => selectTheme(s.name)}
                  activeOpacity={0.8}
                  style={panelStyles.swatchItem}
                >
                  <View style={[
                    panelStyles.swatch,
                    { backgroundColor: s.color },
                    active
                      ? { borderWidth: 2.5, borderColor: s.border }
                      : { borderWidth: 1, borderColor: theme.border },
                  ]} />
                  <Text style={[
                    panelStyles.swatchLabel,
                    { color: active ? theme.textPrimary : theme.textMuted },
                  ]}>
                    {s.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[panelStyles.divider, { backgroundColor: theme.border }]} />
          <Text style={[panelStyles.sectionLabel, { color: theme.textMuted }]}>TIPOGRAFIA</Text>

          <View style={panelStyles.sliderRow}>
            <Text style={[panelStyles.sliderLabel, { color: theme.textSecondary }]}>Títulos</Text>
            <Text style={[panelStyles.sliderValue, { color: theme.textPrimary }]}>
              {Math.round(fontScale * 100)}%
            </Text>
          </View>
          <Slider
            style={panelStyles.slider}
            minimumValue={0.8}
            maximumValue={1.4}
            step={0.05}
            value={fontScale}
            onValueChange={setFontScale}
            minimumTrackTintColor={theme.accent}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.accent}
          />

          <View style={panelStyles.previewRow}>
            <Text style={[panelStyles.previewHeading, { color: theme.textPrimary, fontSize: 18 * fontScale }]}>
              Chaveamento Botânico
            </Text>
            <Text style={[panelStyles.previewBody, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Selecione uma categoria
            </Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const panelStyles = StyleSheet.create({
  panel: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 200,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -6 },
    elevation: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  swatchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  swatchItem: {
    alignItems: 'center',
    gap: 5,
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 9,
  },
  swatchLabel: {
    fontSize: 9,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 13,
    fontWeight: '300',
  },
  sliderValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 32,
    marginBottom: 4,
  },
  previewRow: {
    marginTop: 10,
    gap: 4,
  },
  previewHeading: {
    fontWeight: '600',
  },
  previewBody: {
    fontWeight: '300',
  },
});

// ─── BOTÕES DO RODAPÉ ─────────────────────────────────────────────────────────

function GearButton({ onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[footerBtnStyles.btn, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <Text style={[footerBtnStyles.icon, { color: theme.textMuted }]}>⚙</Text>
    </TouchableOpacity>
  );
}

function CreditsButton({ onPress, theme }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[footerBtnStyles.btn, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <Text style={[footerBtnStyles.label, { color: theme.textMuted }]}>Créditos</Text>
    </TouchableOpacity>
  );
}

const footerBtnStyles = StyleSheet.create({
  btn: {
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

// ─── LOADING ──────────────────────────────────────────────────────────────────

function LoadingScreen() {
  const insets = useSafeAreaInsets();
  const { theme, themeName } = useTheme();
  const themeLogo = getThemeLogo(themeName);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.loadingBg }]} edges={['top','right','bottom','left']}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />
      <View style={[styles.loadingScreen, { backgroundColor: theme.loadingBg, paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.loadingContent}>
          <Image source={themeLogo} style={styles.loadingLogo} resizeMode="contain" />
          <Text style={[styles.loadingTitle, { color: theme.textPrimary }]}>Chave de Identificação</Text>
          <Text style={[styles.loadingSubtitle, { color: theme.textSecondary }]}>
            Angiospermas e gimnospermas nativas e cultivadas do Brasil
          </Text>
          <ActivityIndicator size="large" color={theme.accent} style={styles.loadingSpinner} />
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────

const mainCategories = [
  { id: 'botanico',     label: 'Chaveamento Botânico',     subtitle: 'Angiospermas e gimnospermas',        route: 'Botanic', available: true  },
  { id: 'dendrologico', label: 'Chaveamento Dendrológico', subtitle: 'Identificação de espécies arbóreas', route: 'Dendro',  available: true  },
  { id: 'entomologico', label: 'Chaveamento Entomológico', subtitle: 'Identificação de ordens de insetos', route: 'Insect',  available: true  },
  { id: 'agrario',      label: 'Diagnóstico de Solo',      subtitle: 'Recomendação de calagem, gessagem e adubação', route: 'Agricultural', available: true  },
  { id: 'madeira',      label: 'Anatomia de Madeira',      subtitle: 'Detecção de lúmens e vasos por microscopia',   route: 'WoodAnatomy',  available: true  },
];

function MainScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { theme, themeName, fontScale } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const themeLogo = getThemeLogo(themeName);

  function handleCategory(cat) {
    if (!cat.available) return;
    setSettingsOpen(false);
    navigation.navigate(cat.route);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top','right','bottom','left']}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />
      <View style={[styles.appFrame, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.homeScreen}>

          <View style={styles.headerWrap}>
            <Image source={themeLogo} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontSize: 20 * fontScale }]}>
              O que deseja identificar?
            </Text>
            <Text style={[styles.helperText, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Selecione uma categoria para iniciar a identificação.
            </Text>

            <View style={styles.buttonGroup}>
              {mainCategories.map((cat, index) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => handleCategory(cat)}
                  activeOpacity={cat.available ? 0.85 : 1}
                  style={[styles.keyCard, { backgroundColor: theme.surface, borderColor: theme.border }, !cat.available && styles.keyCardDisabled]}
                >
                  <View style={[styles.keyBadge, { backgroundColor: cat.available ? theme.accent : theme.badgeDisabled }]}>
                    <Text style={[styles.keyBadgeText, { color: theme.accentText }]}>{index + 1}</Text>
                  </View>
                  <View style={styles.keyTextWrap}>
                    <Text style={[styles.keyCardTitle, { color: cat.available ? theme.textPrimary : theme.textMuted, fontSize: 15 * fontScale }]}>
                      {cat.label}
                    </Text>
                    <Text style={[styles.keyCardSubtitle, { color: theme.textMuted, fontSize: 12 * fontScale }]}>
                      {cat.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <CreditsButton theme={theme} onPress={() => setCreditsOpen(true)} />
              <GearButton theme={theme} onPress={() => setSettingsOpen((v) => !v)} />
            </View>
          </View>
        </View>
      </View>

      {/* Painel de ajustes */}
      <SettingsPanel visible={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Modal de créditos */}
      {creditsOpen && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={() => setCreditsOpen(false)}>
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: theme.name === 'Ink' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)' },
              ]}
            />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback>
            <View style={[creditsStyles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[creditsStyles.title, { color: theme.textPrimary, fontSize: 18 * fontScale }]}>
                Créditos
              </Text>
              <View style={[creditsStyles.divider, { backgroundColor: theme.border }]} />
              <Text style={[creditsStyles.line, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
                Aplicativo de chave de identificação botânica.
              </Text>
              <Text style={[creditsStyles.line, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
                Curso: Engenharia Florestal
              </Text>
              <Text style={[creditsStyles.line, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
                Organização do projeto: Dhouglas Silva
              </Text>
              <Text style={[creditsStyles.line, { color: theme.textMuted, fontSize: 12 * fontScale }]}>
                Baseado em chaves botânicas estruturadas para navegação interativa.
              </Text>
              <TouchableOpacity
                style={[creditsStyles.closeBtn, { backgroundColor: theme.accent }]}
                onPress={() => setCreditsOpen(false)}
                activeOpacity={0.85}
              >
                <Text style={[creditsStyles.closeBtnText, { color: theme.accentText }]}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── BOTANIC SCREEN ───────────────────────────────────────────────────────────

function BotanicScreen({ navigation, normalizedBotanicKeys }) {
  const insets = useSafeAreaInsets();
  const { theme, themeName, fontScale } = useTheme();
  const themeLogo = getThemeLogo(themeName);

  function startKey(keyId) {
    const keyData = normalizedBotanicKeys[keyId];
    if (!keyData || !keyData.items.length) { Alert.alert('Erro', `A ${keyId} não possui itens carregados.`); return; }
    navigation.navigate('Flow', { selectedKey: keyId, currentItemId: keyData.items[0].id, history: [], mode: 'botanic' });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top','right','bottom','left']}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />
      <View style={[styles.appFrame, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.homeScreen}>
          <View style={styles.headerWrap}>
            <Image source={themeLogo} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.appTitle, { color: theme.textPrimary, fontSize: 22 * fontScale }]}>Chaveamento Botânico</Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Angiospermas e gimnospermas nativas e cultivadas do Brasil
            </Text>
          </View>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontSize: 20 * fontScale }]}>Escolha uma chave</Text>
            <Text style={[styles.helperText, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Selecione uma das chaves abaixo para iniciar a identificação botânica.
            </Text>
            <View style={styles.buttonGroup}>
              {Object.keys(normalizedBotanicKeys).map((keyId) => (
                <TouchableOpacity key={keyId} onPress={() => startKey(keyId)} activeOpacity={0.85}
                  style={[styles.keyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.keyBadge, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.keyBadgeText, { color: theme.accentText }]}>{keyId}</Text>
                  </View>
                  <View style={styles.keyTextWrap}>
                    <Text style={[styles.keyCardTitle, { color: theme.textPrimary, fontSize: 15 * fontScale }]}>{botanicKeyTitles[keyId]}</Text>
                    <Text style={[styles.keyCardSubtitle, { color: theme.textMuted, fontSize: 12 * fontScale }]}>{botanicKeySubtitles[keyId]}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── DENDRO SCREEN ────────────────────────────────────────────────────────────

function DendroScreen({ navigation, normalizedDendroKeys }) {
  const insets = useSafeAreaInsets();
  const { theme, themeName, fontScale } = useTheme();
  const themeLogo = getThemeLogo(themeName);

  function startKey(keyId) {
    const keyData = normalizedDendroKeys[keyId];
    if (!keyData || !keyData.items.length) { Alert.alert('Erro', `A chave ${keyId} não possui itens carregados.`); return; }
    navigation.navigate('Flow', { selectedKey: keyId, currentItemId: keyData.items[0].id, history: [], mode: 'dendro' });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top','right','bottom','left']}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />
      <View style={[styles.appFrame, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.homeScreen}>
          <View style={styles.headerWrap}>
            <Image source={themeLogo} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.appTitle, { color: theme.textPrimary, fontSize: 22 * fontScale }]}>Chaveamento Dendrológico</Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Identificação vegetativa de espécies arbóreas
            </Text>
          </View>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontSize: 20 * fontScale }]}>Escolha uma chave</Text>
            <Text style={[styles.helperText, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Selecione a chave abaixo para iniciar a identificação dendrológica.
            </Text>
            <View style={styles.buttonGroup}>
              {Object.keys(normalizedDendroKeys).map((keyId) => (
                <TouchableOpacity key={keyId} onPress={() => startKey(keyId)} activeOpacity={0.85}
                  style={[styles.keyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.keyBadge, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.keyBadgeText, { color: theme.accentText }]}>{keyId}</Text>
                  </View>
                  <View style={styles.keyTextWrap}>
                    <Text style={[styles.keyCardTitle, { color: theme.textPrimary, fontSize: 15 * fontScale }]}>{dendroKeyTitles[keyId]}</Text>
                    <Text style={[styles.keyCardSubtitle, { color: theme.textMuted, fontSize: 12 * fontScale }]}>{dendroKeySubtitles[keyId]}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── INSECT SCREEN ────────────────────────────────────────────────────────────

// ─── INSECT SCREEN ────────────────────────────────────────────────────────────

function InsectScreen({ navigation, normalizedInsectKeys }) {
  const insets = useSafeAreaInsets();
  const { theme, themeName, fontScale } = useTheme();
  const themeLogo = getThemeLogo(themeName);

  function startKey(keyId) {
    const keyData = normalizedInsectKeys[keyId];
    if (!keyData || !keyData.items.length) { 
      Alert.alert('Erro', `A chave ${keyId} não possui itens carregados.`); 
      return; 
    }
    navigation.navigate('Flow', { 
      selectedKey: keyId, 
      currentItemId: keyData.items[0].id, 
      history: [], 
      mode: 'insect' 
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top','right','bottom','left']}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />
      <View style={[styles.appFrame, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.homeScreen}>
          <View style={styles.headerWrap}>
            <Image source={themeLogo} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.appTitle, { color: theme.textPrimary, fontSize: 22 * fontScale }]}>Chaveamento Entomológico</Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Identificação de ordens de insetos
            </Text>
          </View>
          <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary, fontSize: 20 * fontScale }]}>Escolha uma chave</Text>
            <Text style={[styles.helperText, { color: theme.textSecondary, fontSize: 13 * fontScale }]}>
              Selecione a chave abaixo para iniciar a identificação entomológica.
            </Text>
            <View style={styles.buttonGroup}>
              {Object.keys(normalizedInsectKeys).map((keyId) => (
                <TouchableOpacity key={keyId} onPress={() => startKey(keyId)} activeOpacity={0.85}
                  style={[styles.keyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={[styles.keyBadge, { backgroundColor: theme.accent }]}>
                    <Text style={[styles.keyBadgeText, { color: theme.accentText }]}>{keyId}</Text>
                  </View>
                  <View style={styles.keyTextWrap}>
                    <Text style={[styles.keyCardTitle, { color: theme.textPrimary, fontSize: 15 * fontScale }]}>{insectKeyTitles[keyId]}</Text>
                    <Text style={[styles.keyCardSubtitle, { color: theme.textMuted, fontSize: 12 * fontScale }]}>{insectKeySubtitles[keyId]}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── FLOW SCREEN ──────────────────────────────────────────────────────────────

function FlowScreen({ navigation, route, normalizedBotanicKeys, normalizedDendroKeys, normalizedInsectKeys }) {
  const insets = useSafeAreaInsets();
  const { theme, fontScale } = useTheme();
  const { selectedKey, currentItemId, history = [], mode = 'botanic' } = route.params;

  const keyTitles = mode === 'dendro' ? dendroKeyTitles : (mode === 'insect' ? insectKeyTitles : botanicKeyTitles);
  const normalizedKeys = mode === 'dendro' ? normalizedDendroKeys : (mode === 'insect' ? normalizedInsectKeys : normalizedBotanicKeys);
  const currentKeyData = normalizedKeys[selectedKey];
  const currentItem = currentKeyData && currentItemId ? getItemById(currentKeyData, currentItemId) : null;

  function goHome() { 
    // Volta para a tela de seleção da chave específica (Botanic, Dendro ou Insect)
    const parentScreen = mode === 'dendro' ? 'Dendro' : (mode === 'insect' ? 'Insect' : 'Botanic');
    navigation.popToTop();
    navigation.navigate(parentScreen);
  }

  function goBackStep() {
    if (!history.length) { 
      navigation.goBack(); 
      return; 
    }
    const newHistory = [...history];
    const last = newHistory.pop();
    navigation.setParams({ selectedKey: last.key, currentItemId: last.itemId, history: newHistory, mode });
  }

  function resolveDestination(destination) {
    if (isNodeDestination(destination)) {
      const targetKey = destination.charAt(0).toUpperCase();
      const targetKeyData = normalizedKeys[targetKey];
      if (!targetKeyData) { Alert.alert('Destino inválido', `A chave ${targetKey} não foi encontrada.`); return; }
      const targetItem = getItemById(targetKeyData, destination);
      if (!targetItem) { Alert.alert('Destino inválido', `O item ${destination} não foi encontrado.`); return; }
      navigation.setParams({ selectedKey: targetKey, currentItemId: destination, history: [...history, { key: selectedKey, itemId: currentItemId }], mode });
      return;
    }
    navigation.navigate('Result', { selectedKey, result: destination, history: [...history, { key: selectedKey, itemId: currentItemId }], mode });
  }

  if (!currentItem) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top','right','bottom','left']}>
        <View style={[styles.appFrame, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 14) }]}>
          <View style={styles.flowScreen}>
            <View style={[styles.flowSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.errorText, { color: theme.danger }]}>Item atual não encontrado.</Text>
              <TouchableOpacity style={[styles.secondaryButton, { borderColor: theme.border }]} onPress={goHome}>
                <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>Voltar ao início</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top','right','bottom','left']}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 14) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.flowSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.badge, { color: theme.textMuted }]}>
            {keyTitles[selectedKey]} · Item {currentItem.numero_original}
          </Text>
          <Text style={[styles.questionTitle, { color: theme.textPrimary, fontSize: 18 * fontScale }]}>
            Escolha a alternativa observada
          </Text>
          <View style={styles.choiceArea}>
            <TouchableOpacity
              style={[styles.choiceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              activeOpacity={0.85}
              onPress={() => resolveDestination(currentItem.destino_a)}
            >
              <Text style={[styles.choiceLabel, { color: theme.accent }]}>Opção A</Text>
              <Text style={[styles.choiceText, { color: theme.textPrimary, fontSize: 15 * fontScale }]}>{currentItem.texto_a}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.choiceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              activeOpacity={0.85}
              onPress={() => resolveDestination(currentItem.destino_b)}
            >
              <Text style={[styles.choiceLabel, { color: theme.accent }]}>Opção B</Text>
              <Text style={[styles.choiceText, { color: theme.textPrimary, fontSize: 15 * fontScale }]}>{currentItem.texto_b}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerButtons}>
            <TouchableOpacity style={[styles.secondaryButton, { borderColor: theme.border }]} activeOpacity={0.85} onPress={goBackStep}>
              <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primarySmallButton, { backgroundColor: theme.accent }]} activeOpacity={0.85} onPress={goHome}>
              <Text style={[styles.primarySmallButtonText, { color: theme.accentText }]}>Início</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── RESULT SCREEN ────────────────────────────────────────────────────────────

function ResultScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { theme, fontScale } = useTheme();
  const { selectedKey, result, history = [], mode = 'botanic' } = route.params;
  
  const resultImage = mode === 'insect' ? getInsectImage(result) : getBotanicImage(result);
  
  const keyTitles = mode === 'dendro' ? dendroKeyTitles : (mode === 'insect' ? insectKeyTitles : botanicKeyTitles);
  const parentScreen = mode === 'dendro' ? 'Dendro' : (mode === 'insect' ? 'Insect' : 'Botanic');

  function goToKeySelection() { 
    navigation.popToTop();
    navigation.navigate(parentScreen);
  }

  function goBackStep() {
    if (!history.length) { 
      goToKeySelection();
      return; 
    }
    const newHistory = [...history];
    const last = newHistory.pop();
    navigation.reset({
      index: 2,
      routes: [
        { name: 'Main' },
        { name: parentScreen },
        { name: 'Flow', params: { selectedKey: last.key, currentItemId: last.itemId, history: newHistory, mode } },
      ],
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top','right','bottom','left']}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />
      <View style={[styles.appFrame, { paddingTop: Math.max(insets.top, 8), paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.flowScreen}>
          <View style={[styles.flowSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.badge, { color: theme.textMuted }]}>{keyTitles[selectedKey]}</Text>
            <Text style={[styles.questionTitle, { color: theme.textPrimary, fontSize: 18 * fontScale }]}>
              {mode === 'insect' ? 'Ordem identificada' : 'Família identificada'}
            </Text>
            <View style={[styles.resultCard, { backgroundColor: theme.surface, borderColor: theme.surfaceBorder }]}>
              <Text style={[styles.resultLabel, { color: theme.textMuted }]}>Resultado final</Text>
              {resultImage ? (
                <View style={styles.imageContainer}>
                  <Image 
                    source={resultImage} 
                    style={styles.resultImage} 
                    resizeMode="stretch"
                  />
                </View>
              ) : null}
              <Text style={[styles.resultText, { color: theme.textPrimary, fontSize: 26 * fontScale }]}>{result}</Text>
            </View>
            <View style={styles.footerButtons}>
              <TouchableOpacity style={[styles.secondaryButton, { borderColor: theme.border }]} activeOpacity={0.85} onPress={goBackStep}>
                <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primarySmallButton, { backgroundColor: theme.accent }]} activeOpacity={0.85} onPress={goToKeySelection}>
                <Text style={[styles.primarySmallButtonText, { color: theme.accentText }]}>Nova identificação</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── NAVIGATOR ────────────────────────────────────────────────────────────────

function RootNavigator() {
  const { theme } = useTheme();

  useEffect(() => {
    const apply = async () => {
      try {
        await NavigationBar.setBackgroundColorAsync(theme.background);
        await NavigationBar.setButtonStyleAsync(theme.name === 'Ink' ? 'light' : 'dark');
      } catch (_) {}
    };
    apply();
  }, [theme]);

  const normalizedBotanicKeys = useMemo(() => {
    const result = {};
    for (const [keyId, value] of Object.entries(rawBotanicKeys)) {
      result[keyId] = normalizeKeyData(value, keyId);
    }
    return result;
  }, []);

  const normalizedDendroKeys = useMemo(() => {
    const result = {};
    for (const [keyId, value] of Object.entries(rawDendroKeys)) {
      result[keyId] = normalizeKeyData(value, keyId);
    }
    return result;
  }, []);

  // 👇 ADICIONE ESTA LINHA 👇
  const normalizedInsectKeys = useMemo(() => {
    const result = {};
    for (const [keyId, value] of Object.entries(rawInsectKeys)) {
      result[keyId] = normalizeKeyData(value, keyId);
    }
    return result;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Botanic">
          {(props) => <BotanicScreen {...props} normalizedBotanicKeys={normalizedBotanicKeys} />}
        </Stack.Screen>
        <Stack.Screen name="Dendro">
          {(props) => <DendroScreen {...props} normalizedDendroKeys={normalizedDendroKeys} />}
        </Stack.Screen>
        <Stack.Screen name="Insect">
          {(props) => <InsectScreen {...props} normalizedInsectKeys={normalizedInsectKeys} />}
        </Stack.Screen>
        <Stack.Screen name="Agricultural" component={AgriculturalScreen} />
        <Stack.Screen name="WoodAnatomy" component={WoodAnatomyScreen} />
        <Stack.Screen name="Flow">
          {(props) => <FlowScreen {...props} 
            normalizedBotanicKeys={normalizedBotanicKeys} 
            normalizedDendroKeys={normalizedDendroKeys}
            normalizedInsectKeys={normalizedInsectKeys}
          />}
        </Stack.Screen>
        <Stack.Screen name="Result">
          {(props) => <ResultScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </View>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

import * as SplashScreenNative from 'expo-splash-screen';
SplashScreenNative.preventAutoHideAsync();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SplashScreenNative.hideAsync();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent isLoading={isLoading} setIsLoading={setIsLoading} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Componente interno que tem acesso ao tema
function AppContent({ isLoading, setIsLoading }) {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {isLoading ? (
        <SplashScreen onFinish={() => setIsLoading(false)} />
      ) : (
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      )}
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const creditsStyles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 200,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
    gap: 10,
  },
  title: {
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  line: {
    fontWeight: '300',
    lineHeight: 20,
  },
  closeBtn: {
    marginTop: 8,
    borderRadius: 12,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

const styles = StyleSheet.create({
  container:       { flex: 1 },
  appFrame:        { flex: 1, paddingHorizontal: 24 },
  loadingScreen:   { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  loadingContent:  { alignItems: 'center' },
  loadingLogo:     { width: 144, height: 144, marginBottom: 24, opacity: 0.7 },
  loadingTitle:    { fontSize: 22, fontWeight: '600', textAlign: 'center', letterSpacing: 0.5, marginBottom: 6 },
  loadingSubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20, maxWidth: 280, fontWeight: '300' },
  loadingSpinner:  { marginTop: 32 },
  homeScreen:      { flex: 1, justifyContent: 'center' },
  flowScreen:      { flex: 1, justifyContent: 'center' },
  headerWrap:      { alignItems: 'center', marginBottom: 28, paddingHorizontal: 6 },
  logo:            { width: 160, height: 160, opacity: 1 },
  appTitle:        { fontWeight: '600', textAlign: 'center', letterSpacing: 0.4, marginTop: 14, marginBottom: 4 },
  appSubtitle:     { fontWeight: '300', textAlign: 'center', lineHeight: 20, maxWidth: 300 },
  section:         { borderRadius: 20, padding: 22, borderWidth: 1 },
  flowSection:     { borderRadius: 20, padding: 22, borderWidth: 1 },
  sectionTitle:    { fontWeight: '600', letterSpacing: 0.2, marginBottom: 6 },
  helperText:      { lineHeight: 20, marginBottom: 20, fontWeight: '300' },
  buttonGroup:     { gap: 10 },
  keyCard:         { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 16 },
  keyCardDisabled: { opacity: 0.35 },
  keyBadge:        { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  keyBadgeText:    { fontSize: 15, fontWeight: '500' },
  keyTextWrap:     { flex: 1 },
  keyCardTitle:    { fontWeight: '600', marginBottom: 2, letterSpacing: 0.1 },
  keyCardSubtitle: { lineHeight: 18, fontWeight: '300' },
  cardFooter:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  badge:           { fontSize: 11, fontWeight: '500', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1.2 },
  questionTitle:   { fontWeight: '600', marginBottom: 20, textAlign: 'center', lineHeight: 26, letterSpacing: 0.2 },
  choiceArea:      { marginTop: 4, marginBottom: 4 },
  choiceCard:      { borderWidth: 1, borderRadius: 14, padding: 18, marginBottom: 10 },
  choiceLabel:     { fontSize: 10, fontWeight: '500', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1.2 },
  choiceText:      { lineHeight: 24, fontWeight: '300' },
  resultCard:      { borderRadius: 16, padding: 24, borderWidth: 1, marginBottom: 16, alignItems: 'center' },
  resultLabel:     { fontSize: 11, fontWeight: '500', marginBottom: 16, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1.2 },
  imageContainer:  { width: 280, height: 280, marginBottom: 16, justifyContent: 'center', alignItems: 'center' },
  resultImage:     { width: '100%', height: '100%', borderRadius: 12 },
  resultText:      { fontWeight: '300', textAlign: 'center', letterSpacing: 0.4 },
  footerButtons:   { flexDirection: 'row', gap: 10, marginTop: 14 },
  secondaryButton:     { flex: 1, borderRadius: 12, borderWidth: 1, minHeight: 50, paddingHorizontal: 16, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  primarySmallButton:  { flex: 1, borderRadius: 12, minHeight: 50, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  secondaryButtonText: { fontSize: 14, fontWeight: '400', textAlign: 'center', letterSpacing: 0.2 },
  primarySmallButtonText: { fontSize: 14, fontWeight: '500', textAlign: 'center', letterSpacing: 0.2 },
  errorText:       { fontSize: 14, marginBottom: 12, fontWeight: '300' },
});