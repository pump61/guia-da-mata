// screens/AgriculturalScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../utils/theme';
import { cultures, getFertilityClass, getAdubacaoValue, getFertilizerRecommendation } from '../data/agricultural/cultures';
import { interpretarAluminio, interpretarV, calcularNecessidadeCalagem } from '../data/agricultural/soilAnalysis';
import { sanitizarInput, validarNumero, LIMITES_SOLO, validarAnaliseSolo } from '../utils/security';

const CATEGORIAS = [
  'Cafeeiro',
  'Fruteiras',
  'Olerícolas',
  'Forrageiras',
  'Permanentes',
  'Temporárias',
  'Ornamentais',
  'Florestais',
];

const TEXTURAS = [
  { id: 'argilosa', label: 'Argilosa', hint: 'P-rem < 10' },
  { id: 'media',    label: 'Média',    hint: 'P-rem 10–40' },
  { id: 'arenosa',  label: 'Arenosa',  hint: 'P-rem > 40' },
];

export function AgriculturalScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { theme, fontScale } = useTheme();

  const inputRefs = {
    pH: useRef(null), P: useRef(null), K: useRef(null), Ca: useRef(null),
    Mg: useRef(null), Al: useRef(null), V: useRef(null), T: useRef(null),
  };

  const [culturaSelecionada,   setCulturaSelecionada]   = useState(null);
  const [dropdownVisible,      setDropdownVisible]       = useState(false);
  const [espacamentoLinha,     setEspacamentoLinha]      = useState('');
  const [espacamentoPlanta,    setEspacamentoPlanta]     = useState('');
  const [plantasPorHa,         setPlantasPorHa]          = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada]  = useState('Fruteiras');
  const [textura,              setTextura]               = useState('media');

  const [analise, setAnalise] = useState({
    pH: '', P: '', K: '', Ca: '', Mg: '', Al: '', V: '', T: '',
  });

  const [resultado, setResultado] = useState(null);

  const culturasFiltradas = Object.values(cultures).filter(
    (c) => c.categoria === categoriaSelecionada
  );

  // ── Espaçamento ──────────────────────────────────────────────────────────────

  const calcularPlantasPorHa = (linha, planta) => {
    const l = parseFloat(String(linha).replace(',', '.'));
    const p = parseFloat(String(planta).replace(',', '.'));
    if (isNaN(l) || isNaN(p) || l <= 0 || p <= 0) return 0;
    return Math.min(Math.round(10000 / (l * p)), 500000);
  };

  const handleEspacamentoLinha = (text) => {
    const s = sanitizarInput(text);
    setEspacamentoLinha(s);
    setPlantasPorHa(calcularPlantasPorHa(s, espacamentoPlanta));
  };

  const handleEspacamentoPlanta = (text) => {
    const s = sanitizarInput(text);
    setEspacamentoPlanta(s);
    setPlantasPorHa(calcularPlantasPorHa(espacamentoLinha, s));
  };

  // ── Análise do solo ───────────────────────────────────────────────────────────

  // Só sanitiza caracteres inválidos; não converte número para não quebrar "5." ao digitar
  const handleAnaliseChange = (campo, valor) => {
    const sanitizado = sanitizarInput(valor);
    setAnalise((prev) => ({ ...prev, [campo]: sanitizado }));
  };

  // Foco avança para o próximo campo apenas ao pressionar Enter/Next
  const handleSubmitEditing = (currentField) => {
    const fields = ['pH', 'P', 'K', 'Ca', 'Mg', 'Al', 'V', 'T'];
    const idx = fields.indexOf(currentField);
    if (idx < fields.length - 1) inputRefs[fields[idx + 1]]?.current?.focus();
  };

  function safeNumber(value, defaultValue = 0) {
    const num = parseFloat(String(value).replace(',', '.'));
    return isNaN(num) ? defaultValue : num;
  }

  // ── Cálculo ───────────────────────────────────────────────────────────────────

  function calcular() {
    if (!culturaSelecionada) { Alert.alert('Atenção', 'Selecione uma cultura'); return; }
    if (!espacamentoLinha || !espacamentoPlanta) { Alert.alert('Atenção', 'Informe o espaçamento de plantio'); return; }

    const erros = validarAnaliseSolo(analise);
    if (erros.length > 0) { Alert.alert('Erro na Análise', erros.join('\n')); return; }

    const dados = {
      pH: safeNumber(analise.pH, 5.5),
      P:  safeNumber(analise.P,  0),
      K:  safeNumber(analise.K,  0),
      Ca: safeNumber(analise.Ca, 0),
      Mg: safeNumber(analise.Mg, 0),
      Al: safeNumber(analise.Al, 0),
      V:  safeNumber(analise.V,  0),
      T:  safeNumber(analise.T,  0),
    };

    const tipo = culturaSelecionada.tipo || 'perene';
    const vIdeal = culturaSelecionada.vIdeal || 60;

    // Classes de fertilidade (manual ES/BA 5ª aprox.)
    const pClasse = getFertilityClass(dados.P, 'fosforo',   tipo, textura);
    const kClasse = getFertilityClass(dados.K, 'potassio',  tipo, textura);

    // Interpretações
    const interpretacaoAl = interpretarAluminio(dados.Al);
    const interpretacaoV  = interpretarV(dados.V, vIdeal);

    // Calagem
    const precisaCalagem = interpretacaoV.calagemNecessaria || interpretacaoAl.calagemNecessaria;
    const calagem = precisaCalagem
      ? calcularNecessidadeCalagem(dados.V, dados.T, vIdeal)
      : { doseRecomendada: 0, teorica: 0, corrigida: 0 };

    // Gessagem
    const gessagem = {
      necessaria: dados.Al > 0.5,
      dose: dados.Al > 0.5 ? calagem.doseRecomendada * 0.3 : 0,
      motivo: dados.Al > 0.5 ? `Alto teor de Al³⁺ (${dados.Al.toFixed(2)} cmolc/dm³)` : null,
    };

    // Adubação: N fixo por cultura; P2O5 pela classe de P; K2O pela classe de K
    const adubacao = {
      N:    getAdubacaoValue(culturaSelecionada.adubacaoPlantio?.N,    pClasse),
      P2O5: getAdubacaoValue(culturaSelecionada.adubacaoPlantio?.P2O5, pClasse),
      K2O:  getAdubacaoValue(culturaSelecionada.adubacaoPlantio?.K2O,  kClasse),
    };

    const plantasPorHaValido = plantasPorHa > 0 ? plantasPorHa : 1;
    const adubacaoCova = {
      N:    (adubacao.N    / plantasPorHaValido) * 1000,
      P2O5: (adubacao.P2O5 / plantasPorHaValido) * 1000,
      K2O:  (adubacao.K2O  / plantasPorHaValido) * 1000,
    };

    const recomendacaoFertilizantes = getFertilizerRecommendation(adubacao);

    setResultado({
      cultura: culturaSelecionada,
      textura,
      espacamento:  { linha: safeNumber(espacamentoLinha), planta: safeNumber(espacamentoPlanta) },
      plantasPorHa,
      analise: dados,
      classes: { P: pClasse, K: kClasse },
      interpretacaoAl,
      interpretacaoV,
      calagem,
      gessagem,
      adubacao,
      adubacaoCova,
      recomendacaoFertilizantes,
      precisaCalagem,
      precisaGessagem: gessagem.necessaria,
    });
  }

  // ── Compartilhar ──────────────────────────────────────────────────────────────

  async function compartilharRelatorio() {
    if (!resultado) return;
    const r = resultado;
    const texturasLabel = { argilosa: 'Argilosa', media: 'Média', arenosa: 'Arenosa' };
    const relatorio = `
RELATÓRIO DE RECOMENDAÇÃO AGRÍCOLA
=====================================

CULTURA: ${r.cultura.nome}
Nome Científico: ${r.cultura.nomeCientifico}
Categoria: ${r.cultura.categoria}
Ciclo: ${r.cultura.ciclo}
Textura do solo: ${texturasLabel[r.textura]}
Espaçamento: ${r.espacamento.linha} x ${r.espacamento.planta} m
Plantas por hectare: ${r.plantasPorHa}

ANÁLISE DO SOLO:
• pH: ${r.analise.pH.toFixed(2)}
• P: ${r.analise.P.toFixed(1)} mg/dm³ (${r.classes.P})
• K: ${r.analise.K.toFixed(1)} mg/dm³ (${r.classes.K})
• Ca: ${r.analise.Ca.toFixed(2)} cmolc/dm³
• Mg: ${r.analise.Mg.toFixed(2)} cmolc/dm³
• Al: ${r.analise.Al.toFixed(2)} cmolc/dm³ (${r.interpretacaoAl.classe})
• V: ${r.analise.V.toFixed(1)}% (${r.interpretacaoV.classe}) — V ideal: ${r.cultura.vIdeal}%

DIAGNÓSTICO:
${r.precisaCalagem   ? '✓ CALAGEM: NECESSÁRIA'    : '✗ CALAGEM: DISPENSÁVEL'}
${r.precisaGessagem  ? '✓ GESSAGEM: NECESSÁRIA'   : '✗ GESSAGEM: DISPENSÁVEL'}

${r.precisaCalagem && r.calagem.doseRecomendada > 0 ? `CALAGEM:\nDose recomendada: ${r.calagem.doseRecomendada.toFixed(2)} t/ha\n` : ''}
${r.precisaGessagem && r.gessagem.dose > 0 ? `GESSAGEM:\nDose recomendada: ${r.gessagem.dose.toFixed(2)} t/ha\nMotivo: ${r.gessagem.motivo}\n` : ''}

ADUBAÇÃO POR HECTARE (kg/ha):
N: ${r.adubacao.N} | P₂O₅: ${r.adubacao.P2O5} | K₂O: ${r.adubacao.K2O}

ADUBAÇÃO POR COVA (g/cova) — ${r.plantasPorHa.toLocaleString('pt-BR')} plantas/ha:
N: ${r.adubacaoCova.N.toFixed(1)} | P₂O₅: ${r.adubacaoCova.P2O5.toFixed(1)} | K₂O: ${r.adubacaoCova.K2O.toFixed(1)}
${r.cultura.adubacaoCobertura ? `
ADUBAÇÃO DE COBERTURA (kg/ha):
${r.cultura.adubacaoCobertura.descricao}
N: ${r.cultura.adubacaoCobertura.N} | K₂O: ${r.cultura.adubacaoCobertura.K2O}
` : ''}
RECOMENDAÇÃO DE FERTILIZANTES:
Nitrogênio:
${r.recomendacaoFertilizantes.nitrogenio.map(f => `• ${f.nome}: ${f.dose.toFixed(0)} kg/ha — ${f.vantagens}`).join('\n')}

Fósforo:
${r.recomendacaoFertilizantes.fosforo.map(f => `• ${f.nome}: ${f.dose.toFixed(0)} kg/ha — ${f.vantagens}`).join('\n')}

Potássio:
${r.recomendacaoFertilizantes.potassio.map(f => `• ${f.nome}: ${f.dose.toFixed(0)} kg/ha — ${f.vantagens}`).join('\n')}

${r.cultura.observacoes ? `OBSERVAÇÕES:\n${r.cultura.observacoes}` : ''}

=====================================
Relatório gerado por Guia da Mata
Ref.: Manual ES/BA — 5ª Aproximação
    `.trim();

    await Share.share({ message: relatorio, title: 'Relatório de Recomendação Agrícola' });
  }

  // ── Dropdown de culturas ──────────────────────────────────────────────────────

  const renderCulturaDropdown = () => (
    <Modal
      visible={dropdownVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setDropdownVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setDropdownVisible(false)}
      >
        <View style={[styles.dropdownContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.dropdownTitle, { color: theme.textPrimary }]}>
            {categoriaSelecionada}
          </Text>
          <FlatList
            data={culturasFiltradas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  { backgroundColor: culturaSelecionada?.id === item.id ? theme.accent : theme.surface },
                ]}
                onPress={() => { setCulturaSelecionada(item); setDropdownVisible(false); }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  { color: culturaSelecionada?.id === item.id ? theme.accentText : theme.textPrimary },
                ]}>
                  {item.nome}
                </Text>
                <Text style={[styles.dropdownItemSubtext, { color: theme.textMuted }]}>
                  {item.nomeCientifico}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // ── Campo de entrada ──────────────────────────────────────────────────────────

  const renderInput = (campo, label, placeholder, nextField) => (
    <View style={styles.halfInput}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <TextInput
        ref={inputRefs[campo]}
        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
        keyboardType="decimal-pad"
        value={analise[campo]}
        onChangeText={(v) => handleAnaliseChange(campo, v)}
        onSubmitEditing={() => nextField ? handleSubmitEditing(campo) : calcular()}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        returnKeyType={nextField ? 'next' : 'done'}
      />
    </View>
  );

  // ── Render principal ──────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={theme.name === 'Ink' ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 14),
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: theme.textPrimary, fontSize: 24 * fontScale }]}>
            Diagnóstico do Solo
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontSize: 14 * fontScale }]}>
            Recomendação de calagem, gessagem e adubação
          </Text>

          {/* Categorias */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Categoria</Text>
            <View style={styles.categoriaGrid}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoriaButton,
                    {
                      backgroundColor: categoriaSelecionada === cat ? theme.accent : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => { setCategoriaSelecionada(cat); setCulturaSelecionada(null); }}
                >
                  <Text style={[
                    styles.categoriaButtonText,
                    { color: categoriaSelecionada === cat ? theme.accentText : theme.textPrimary },
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Seleção da Cultura */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Cultura</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => setDropdownVisible(true)}
            >
              <Text style={[styles.dropdownButtonText, { color: culturaSelecionada ? theme.textPrimary : theme.textMuted }]}>
                {culturaSelecionada ? culturaSelecionada.nome : 'Selecione uma cultura'}
              </Text>
              <Text style={[styles.dropdownArrow, { color: theme.textMuted }]}>▼</Text>
            </TouchableOpacity>
            {culturaSelecionada && (
              <Text style={[styles.culturaInfo, { color: theme.textSecondary }]}>
                {culturaSelecionada.nomeCientifico} • {culturaSelecionada.ciclo} • V ideal: {culturaSelecionada.vIdeal}%
              </Text>
            )}
          </View>

          {/* Espaçamento */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Espaçamento (metros)</Text>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Entre linhas</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={espacamentoLinha}
                  onChangeText={handleEspacamentoLinha}
                  placeholder="Ex: 3"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Entre plantas</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={espacamentoPlanta}
                  onChangeText={handleEspacamentoPlanta}
                  placeholder="Ex: 2"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="done"
                />
              </View>
            </View>
            {plantasPorHa > 0 && (
              <Text style={[styles.infoText, { color: theme.accent }]}>
                {plantasPorHa.toLocaleString('pt-BR')} plantas por hectare
              </Text>
            )}
          </View>

          {/* Análise do Solo */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Análise do Solo</Text>

            {/* Textura */}
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>Textura do solo</Text>
            <View style={styles.texturaRow}>
              {TEXTURAS.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.texturaButton,
                    {
                      backgroundColor: textura === t.id ? theme.accent : theme.surface,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setTextura(t.id)}
                >
                  <Text style={[
                    styles.texturaLabel,
                    { color: textura === t.id ? theme.accentText : theme.textPrimary },
                  ]}>
                    {t.label}
                  </Text>
                  <Text style={[styles.texturaHint, { color: textura === t.id ? theme.accentText : theme.textMuted }]}>
                    {t.hint}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Campos da análise */}
            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.row}>
              {renderInput('pH', 'pH',          'Ex: 5.1', 'P')}
              {renderInput('P',  'P (mg/dm³)',  'Ex: 8',   'K')}
            </View>
            <View style={styles.row}>
              {renderInput('K',  'K (mg/dm³)',  'Ex: 73',  'Ca')}
              {renderInput('Ca', 'Ca (cmolc)',  'Ex: 1.2', 'Mg')}
            </View>
            <View style={styles.row}>
              {renderInput('Mg', 'Mg (cmolc)',  'Ex: 0.6', 'Al')}
              {renderInput('Al', 'Al (cmolc)',  'Ex: 1.1', 'V')}
            </View>
            <View style={styles.row}>
              {renderInput('V',  'V (%)',       'Ex: 28',  'T')}
              {renderInput('T',  'T (cmolc)',   'Ex: 7.1', null)}
            </View>

            <TouchableOpacity
              style={[styles.calcButton, { backgroundColor: theme.accent }]}
              onPress={calcular}
            >
              <Text style={[styles.calcButtonText, { color: theme.accentText }]}>CALCULAR</Text>
            </TouchableOpacity>
          </View>

          {/* Resultado */}
          {resultado && (
            <View style={[styles.resultCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.resultTitle, { color: theme.accent }]}>RELATÓRIO DE RECOMENDAÇÃO</Text>
              <Text style={[styles.resultSubtitle, { color: theme.textMuted }]}>
                {resultado.cultura.nome} • Solo {({ argilosa: 'Argiloso', media: 'Médio', arenosa: 'Arenoso' })[resultado.textura]}
              </Text>

              {/* Diagnóstico */}
              <View style={[styles.resultSection, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Diagnóstico</Text>
                <View style={styles.diagnosticoRow}>
                  <Text style={[styles.diagnosticoLabel, { color: theme.textMuted }]}>Calagem:</Text>
                  <Text style={{ color: resultado.precisaCalagem ? '#E53935' : '#4CAF50', fontWeight: '600' }}>
                    {resultado.precisaCalagem ? 'NECESSÁRIA' : 'DISPENSÁVEL'}
                  </Text>
                </View>
                <View style={styles.diagnosticoRow}>
                  <Text style={[styles.diagnosticoLabel, { color: theme.textMuted }]}>Gessagem:</Text>
                  <Text style={{ color: resultado.precisaGessagem ? '#E53935' : '#4CAF50', fontWeight: '600' }}>
                    {resultado.precisaGessagem ? 'NECESSÁRIA' : 'DISPENSÁVEL'}
                  </Text>
                </View>
                <View style={styles.diagnosticoRow}>
                  <Text style={[styles.diagnosticoLabel, { color: theme.textMuted }]}>V atual / V ideal:</Text>
                  <Text style={{ color: theme.textPrimary, fontWeight: '500' }}>
                    {resultado.analise.V.toFixed(1)}% / {resultado.cultura.vIdeal}%
                  </Text>
                </View>
                <View style={styles.diagnosticoRow}>
                  <Text style={[styles.diagnosticoLabel, { color: theme.textMuted }]}>Classe P / K:</Text>
                  <Text style={{ color: theme.textPrimary, fontWeight: '500' }}>
                    {resultado.classes.P} / {resultado.classes.K}
                  </Text>
                </View>
              </View>

              {/* Calagem */}
              {resultado.precisaCalagem && resultado.calagem.doseRecomendada > 0 && (
                <View style={[styles.resultSection, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Calagem</Text>
                  <Text style={[styles.resultValue, { color: theme.textPrimary }]}>
                    {resultado.calagem.doseRecomendada.toFixed(2)} t/ha
                  </Text>
                  <Text style={[styles.resultHint, { color: theme.textMuted }]}>PRNT 100% • método V%</Text>
                </View>
              )}

              {/* Gessagem */}
              {resultado.precisaGessagem && resultado.gessagem.dose > 0 && (
                <View style={[styles.resultSection, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Gessagem</Text>
                  <Text style={[styles.resultValue, { color: theme.textPrimary }]}>
                    {resultado.gessagem.dose.toFixed(2)} t/ha
                  </Text>
                  <Text style={[styles.resultHint, { color: theme.textMuted }]}>{resultado.gessagem.motivo}</Text>
                </View>
              )}

              {/* Adubação por hectare */}
              <View style={[styles.resultSection, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Adubação por Hectare (kg/ha)</Text>
                <View style={styles.npkRow}>
                  {[['N', resultado.adubacao.N], ['P₂O₅', resultado.adubacao.P2O5], ['K₂O', resultado.adubacao.K2O]].map(([label, val]) => (
                    <View key={label} style={styles.npkItem}>
                      <Text style={[styles.npkLabel, { color: theme.accent }]}>{label}</Text>
                      <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{val}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Adubação por cova */}
              <View style={[styles.resultSection, { borderBottomColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Adubação por Cova (g/cova)</Text>
                <Text style={[styles.resultHint, { color: theme.textMuted }]}>
                  {resultado.plantasPorHa.toLocaleString('pt-BR')} plantas/ha
                </Text>
                <View style={styles.npkRow}>
                  {[['N', resultado.adubacaoCova.N], ['P₂O₅', resultado.adubacaoCova.P2O5], ['K₂O', resultado.adubacaoCova.K2O]].map(([label, val]) => (
                    <View key={label} style={styles.npkItem}>
                      <Text style={[styles.npkLabel, { color: theme.accent }]}>{label}</Text>
                      <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{val.toFixed(1)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Adubação de cobertura */}
              {resultado.cultura.adubacaoCobertura && (
                <View style={[styles.resultSection, { borderBottomColor: theme.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Adubação de Cobertura (kg/ha)</Text>
                  <Text style={[styles.resultHint, { color: theme.textMuted }]}>
                    {resultado.cultura.adubacaoCobertura.descricao}
                  </Text>
                  <View style={styles.npkRow}>
                    {resultado.cultura.adubacaoCobertura.N > 0 && (
                      <View style={styles.npkItem}>
                        <Text style={[styles.npkLabel, { color: theme.accent }]}>N</Text>
                        <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{resultado.cultura.adubacaoCobertura.N}</Text>
                      </View>
                    )}
                    {resultado.cultura.adubacaoCobertura.K2O > 0 && (
                      <View style={styles.npkItem}>
                        <Text style={[styles.npkLabel, { color: theme.accent }]}>K₂O</Text>
                        <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{resultado.cultura.adubacaoCobertura.K2O}</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Botões */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.shareButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={compartilharRelatorio}
                >
                  <Text style={[styles.shareButtonText, { color: theme.textPrimary }]}>Compartilhar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.newButton, { backgroundColor: theme.accent }]}
                  onPress={() => {
                    setResultado(null);
                    setCulturaSelecionada(null);
                    setEspacamentoLinha('');
                    setEspacamentoPlanta('');
                    setPlantasPorHa(0);
                    setAnalise({ pH: '', P: '', K: '', Ca: '', Mg: '', Al: '', V: '', T: '' });
                  }}
                >
                  <Text style={[styles.newButtonText, { color: theme.accentText }]}>Nova Análise</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {renderCulturaDropdown()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1 },
  title:               { fontWeight: '600', marginBottom: 4 },
  subtitle:            { marginBottom: 20, opacity: 0.7 },
  card:                { borderRadius: 16, borderWidth: 1, padding: 18, marginBottom: 16 },
  cardTitle:           { fontWeight: '600', marginBottom: 12, fontSize: 16 },
  sectionSubtitle:     { fontSize: 13, fontWeight: '500', marginBottom: 8 },
  categoriaGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoriaButton:     { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  categoriaButtonText: { fontWeight: '500', fontSize: 13 },
  dropdownButton:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  dropdownButtonText:  { fontSize: 15 },
  dropdownArrow:       { fontSize: 14 },
  culturaInfo:         { fontSize: 12, marginTop: 8, textAlign: 'center', fontStyle: 'italic' },
  modalOverlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dropdownContainer:   { width: '85%', maxHeight: '70%', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  dropdownTitle:       { fontSize: 18, fontWeight: '600', padding: 16, textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  dropdownItem:        { padding: 14, borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  dropdownItemText:    { fontSize: 15, fontWeight: '500' },
  dropdownItemSubtext: { fontSize: 11, marginTop: 2 },
  texturaRow:          { flexDirection: 'row', gap: 8, marginBottom: 12 },
  texturaButton:       { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 10, alignItems: 'center' },
  texturaLabel:        { fontWeight: '600', fontSize: 13 },
  texturaHint:         { fontSize: 10, marginTop: 2 },
  divider:             { height: 1, marginVertical: 14 },
  row:                 { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfInput:           { flex: 1 },
  label:               { fontSize: 12, marginBottom: 4 },
  input:               { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  infoText:            { textAlign: 'center', marginTop: 8, fontSize: 12, fontWeight: '500' },
  calcButton:          { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  calcButtonText:      { fontWeight: '700', fontSize: 16 },
  resultCard:          { borderRadius: 16, borderWidth: 1, padding: 18, marginTop: 16, marginBottom: 32 },
  resultTitle:         { fontWeight: '700', textAlign: 'center', marginBottom: 4, fontSize: 18 },
  resultSubtitle:      { textAlign: 'center', marginBottom: 16, fontSize: 12 },
  resultSection:       { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 0.5 },
  sectionTitle:        { fontWeight: '600', marginBottom: 10, fontSize: 14 },
  diagnosticoRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  diagnosticoLabel:    { fontSize: 13 },
  resultValue:         { fontWeight: '600', fontSize: 20, textAlign: 'center' },
  resultHint:          { fontSize: 11, textAlign: 'center', marginTop: 4 },
  npkRow:              { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  npkItem:             { alignItems: 'center', flex: 1 },
  npkLabel:            { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  npkValue:            { fontSize: 20, fontWeight: '600' },
  actionButtons:       { flexDirection: 'row', gap: 12, marginTop: 8 },
  shareButton:         { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
  shareButtonText:     { fontWeight: '500', fontSize: 14 },
  newButton:           { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  newButtonText:       { fontWeight: '600', fontSize: 14 },
});
