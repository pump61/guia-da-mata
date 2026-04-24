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
import { cultures, getFertilityClass, getFertilizerRecommendation } from '../data/agricultural/cultures';
import { interpretarAluminio, interpretarV, calcularNecessidadeCalagem } from '../data/agricultural/soilAnalysis';
import { sanitizarInput, validarNumero, LIMITES_SOLO, validarAnaliseSolo } from '../utils/security';

export function AgriculturalScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { theme, fontScale } = useTheme();
  
  const inputRefs = {
    pH: useRef(null),
    P: useRef(null),
    K: useRef(null),
    Ca: useRef(null),
    Mg: useRef(null),
    Al: useRef(null),
    V: useRef(null),
    T: useRef(null),
  };
  
  const [culturaSelecionada, setCulturaSelecionada] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [espacamentoLinha, setEspacamentoLinha] = useState('');
  const [espacamentoPlanta, setEspacamentoPlanta] = useState('');
  const [plantasPorHa, setPlantasPorHa] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Florestais');
  
  const [analise, setAnalise] = useState({
    pH: '',
    P: '',
    K: '',
    Ca: '',
    Mg: '',
    Al: '',
    V: '',
    T: '',
  });
  
  const [resultado, setResultado] = useState(null);
  
  const categorias = ['Florestais', 'Fruteiras', 'Grãos', 'Hortaliças'];
  
  const culturasFiltradas = Object.values(cultures).filter(
    (c) => c.categoria === categoriaSelecionada
  );
  
  // Função segura para calcular plantas por hectare
  const calcularPlantasPorHa = (linha, planta) => {
    const linhaNum = parseFloat(String(linha).replace(',', '.'));
    const plantaNum = parseFloat(String(planta).replace(',', '.'));
    
    if (isNaN(linhaNum) || isNaN(plantaNum)) return 0;
    if (linhaNum <= 0 || plantaNum <= 0) return 0;
    
    const area = linhaNum * plantaNum;
    const plantas = Math.round(10000 / area);
    
    // Limite máximo de 500.000 plantas/ha
    return Math.min(plantas, 500000);
  };
  
  const atualizarPlantasPorHa = (linha, planta) => {
    const plantas = calcularPlantasPorHa(linha, planta);
    setPlantasPorHa(plantas);
  };
  
  const handleEspacamentoLinha = (text) => {
    const sanitizado = sanitizarInput(text);
    setEspacamentoLinha(sanitizado);
    atualizarPlantasPorHa(sanitizado, espacamentoPlanta);
  };
  
  const handleEspacamentoPlanta = (text) => {
    const sanitizado = sanitizarInput(text);
    setEspacamentoPlanta(sanitizado);
    atualizarPlantasPorHa(espacamentoLinha, sanitizado);
  };
  
  // Handle seguro para os inputs de análise do solo
  const handleAnaliseChange = (campo, valor, nextField) => {
    // Sanitiza e valida o input
    const sanitizado = sanitizarInput(valor);
    
    // Aplica limites do campo
    const limite = LIMITES_SOLO[campo];
    let valorFinal = sanitizado;
    
    if (limite && sanitizado !== '') {
      const num = validarNumero(sanitizado, limite.min, limite.max);
      if (num !== null) {
        valorFinal = String(num);
      }
    }
    
    setAnalise({ ...analise, [campo]: valorFinal });
    
    // Move para próximo campo se existir
    if (nextField && inputRefs[nextField]?.current) {
      inputRefs[nextField].current.focus();
    }
  };
  
  const handleSubmitEditing = (currentField) => {
    const fields = ['pH', 'P', 'K', 'Ca', 'Mg', 'Al', 'V', 'T'];
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      const nextField = fields[currentIndex + 1];
      inputRefs[nextField]?.current?.focus();
    }
  };
  
  function getAdubacaoValue(adubacaoObj, classe) {
    if (!adubacaoObj || typeof adubacaoObj !== 'object') return 0;
    const valor = adubacaoObj[classe];
    return typeof valor === 'number' ? valor : 0;
  }
  
  function safeNumber(value, defaultValue = 0) {
    const num = parseFloat(String(value).replace(',', '.'));
    return isNaN(num) ? defaultValue : num;
  }
  
  function calcular() {
    // Validações de segurança
    if (!culturaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma cultura');
      return;
    }
    
    if (!espacamentoLinha || !espacamentoPlanta) {
      Alert.alert('Atenção', 'Informe o espaçamento de plantio');
      return;
    }
    
    // Valida análise do solo
    const erros = validarAnaliseSolo(analise);
    if (erros.length > 0) {
      Alert.alert('Erro na Análise', erros.join('\n'));
      return;
    }
    
    // Converte valores com segurança
    const dadosAnalise = {
      pH: safeNumber(analise.pH, 5.5),
      P: safeNumber(analise.P, 0),
      K: safeNumber(analise.K, 0),
      Ca: safeNumber(analise.Ca, 0),
      Mg: safeNumber(analise.Mg, 0),
      Al: safeNumber(analise.Al, 0),
      V: safeNumber(analise.V, 0),
      T: safeNumber(analise.T, 0),
    };
    
    // Extrai classes de fertilidade
    const pClasse = getFertilityClass(dadosAnalise.P, 'fosforo');
    const kClasse = getFertilityClass(dadosAnalise.K, 'potassio');
    
    // Interpretações
    const interpretacaoAl = interpretarAluminio(dadosAnalise.Al);
    const interpretacaoV = interpretarV(dadosAnalise.V, false);
    
    // Calagem
    const precisaCalagem = interpretacaoV.calagemNecessaria || interpretacaoAl.calagemNecessaria;
    const calagem = precisaCalagem 
      ? calcularNecessidadeCalagem(dadosAnalise.V, dadosAnalise.T, culturaSelecionada.vIdeal || 60)
      : { doseRecomendada: 0, teorica: 0, corrigida: 0 };
    
    // Gessagem
    const gessagem = {
      necessaria: dadosAnalise.Al > 0.5,
      dose: dadosAnalise.Al > 0.5 ? calagem.doseRecomendada * 0.3 : 0,
      motivo: dadosAnalise.Al > 0.5 ? `Alto teor de Al³⁺ (${dadosAnalise.Al.toFixed(2)} cmolc/dm³)` : null
    };
    
    // Adubação
    const adubacao = {
      N: getAdubacaoValue(culturaSelecionada.adubacaoPlantio?.N, pClasse),
      P2O5: getAdubacaoValue(culturaSelecionada.adubacaoPlantio?.P2O5, kClasse),
      K2O: getAdubacaoValue(culturaSelecionada.adubacaoPlantio?.K2O, kClasse)
    };
    
    // Adubação por cova
    const plantasPorHaValido = plantasPorHa > 0 ? plantasPorHa : 1;
    const adubacaoCova = {
      N: (adubacao.N / plantasPorHaValido) * 1000,
      P2O5: (adubacao.P2O5 / plantasPorHaValido) * 1000,
      K2O: (adubacao.K2O / plantasPorHaValido) * 1000
    };
    
    // Recomendações de fertilizantes
    const recomendacaoFertilizantes = getFertilizerRecommendation(adubacao);
    
    setResultado({
      cultura: culturaSelecionada,
      espacamento: { linha: safeNumber(espacamentoLinha), planta: safeNumber(espacamentoPlanta) },
      plantasPorHa,
      analise: dadosAnalise,
      classes: { P: pClasse, K: kClasse },
      interpretacaoAl,
      interpretacaoV,
      calagem,
      gessagem,
      adubacao,
      adubacaoCova,
      recomendacaoFertilizantes,
      precisaCalagem,
      precisaGessagem: gessagem.necessaria
    });
  }
  
  async function compartilharRelatorio() {
    if (!resultado) return;
    
    const relatorio = `
RELATÓRIO DE RECOMENDAÇÃO AGRÍCOLA
=====================================

CULTURA: ${resultado.cultura.nome}
Nome Científico: ${resultado.cultura.nomeCientifico}
Categoria: ${resultado.cultura.categoria}
Ciclo: ${resultado.cultura.ciclo}
Espaçamento: ${resultado.espacamento.linha} x ${resultado.espacamento.planta} m
Plantas por hectare: ${resultado.plantasPorHa}

ANÁLISE DO SOLO:
• pH: ${resultado.analise.pH.toFixed(2)}
• P: ${resultado.analise.P.toFixed(1)} mg/dm³ (${resultado.classes.P})
• K: ${resultado.analise.K.toFixed(1)} mg/dm³ (${resultado.classes.K})
• Ca: ${resultado.analise.Ca.toFixed(2)} cmolc/dm³
• Mg: ${resultado.analise.Mg.toFixed(2)} cmolc/dm³
• Al: ${resultado.analise.Al.toFixed(2)} cmolc/dm³ (${resultado.interpretacaoAl.classe})
• V: ${resultado.analise.V.toFixed(1)}% (${resultado.interpretacaoV.classe})

DIAGNÓSTICO:
${resultado.precisaCalagem ? 'SIM' : 'NÃO'} - CALAGEM: ${resultado.precisaCalagem ? 'NECESSÁRIA' : 'DISPENSÁVEL'}
${resultado.precisaGessagem ? 'SIM' : 'NÃO'} - GESSAGEM: ${resultado.precisaGessagem ? 'NECESSÁRIA' : 'DISPENSÁVEL'}

${resultado.precisaCalagem && resultado.calagem.doseRecomendada > 0 ? `
CALAGEM:
Dose recomendada: ${resultado.calagem.doseRecomendada.toFixed(2)} t/ha
` : ''}
${resultado.precisaGessagem && resultado.gessagem.dose > 0 ? `
GESSAGEM:
Dose recomendada: ${resultado.gessagem.dose.toFixed(2)} t/ha
Motivo: ${resultado.gessagem.motivo}
` : ''}

ADUBAÇÃO POR HECTARE (kg/ha):
N: ${resultado.adubacao.N} kg/ha
P₂O₅: ${resultado.adubacao.P2O5} kg/ha
K₂O: ${resultado.adubacao.K2O} kg/ha

ADUBAÇÃO POR COVA (g/cova):
N: ${resultado.adubacaoCova.N.toFixed(1)} g
P₂O₅: ${resultado.adubacaoCova.P2O5.toFixed(1)} g
K₂O: ${resultado.adubacaoCova.K2O.toFixed(1)} g

RECOMENDAÇÃO DE FERTILIZANTES:
Nitrogênio:
${resultado.recomendacaoFertilizantes.nitrogenio.map(f => `• ${f.nome}: ${f.dose.toFixed(0)} kg/ha (${f.concentracao}% N) - ${f.vantagens}`).join('\n')}

Fósforo:
${resultado.recomendacaoFertilizantes.fosforo.map(f => `• ${f.nome}: ${f.dose.toFixed(0)} kg/ha (${f.concentracao}% P₂O₅) - ${f.vantagens}`).join('\n')}

Potássio:
${resultado.recomendacaoFertilizantes.potassio.map(f => `• ${f.nome}: ${f.dose.toFixed(0)} kg/ha (${f.concentracao}% K₂O) - ${f.vantagens}`).join('\n')}

${resultado.cultura.adubacaoCobertura ? `
ADUBAÇÃO DE COBERTURA:
${resultado.cultura.adubacaoCobertura.descricao}
` : ''}

${resultado.cultura.observacoes ? `
OBSERVAÇÕES:
${resultado.cultura.observacoes}
` : ''}

=====================================
Relatório gerado por Guia Florestal
    `;
    
    await Share.share({
      message: relatorio,
      title: 'Relatório de Recomendação Agrícola'
    });
  }
  
  const renderCulturaDropdown = () => (
    <Modal
      visible={dropdownVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setDropdownVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setDropdownVisible(false)}
      >
        <View style={[styles.dropdownContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.dropdownTitle, { color: theme.textPrimary }]}>Selecione a Cultura</Text>
          <FlatList
            data={culturasFiltradas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  { 
                    backgroundColor: culturaSelecionada?.id === item.id ? theme.accent : theme.surface,
                  }
                ]}
                onPress={() => {
                  setCulturaSelecionada(item);
                  setDropdownVisible(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  { color: culturaSelecionada?.id === item.id ? theme.accentText : theme.textPrimary }
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
          
          {/* Categorias - Centralizadas */}
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Categoria</Text>
            <View style={styles.categoriaContainer}>
              <View style={styles.categoriaGrid}>
                {categorias.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoriaButton,
                      { 
                        backgroundColor: categoriaSelecionada === cat ? theme.accent : theme.surface,
                        borderColor: theme.border,
                      }
                    ]}
                    onPress={() => {
                      setCategoriaSelecionada(cat);
                      setCulturaSelecionada(null);
                    }}
                  >
                    <Text style={[
                      styles.categoriaButtonText,
                      { color: categoriaSelecionada === cat ? theme.accentText : theme.textPrimary }
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          {/* Seleção da Cultura - Dropdown */}
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
                {culturaSelecionada.nomeCientifico} • {culturaSelecionada.ciclo}
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
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>pH</Text>
                <TextInput
                  ref={inputRefs.pH}
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={analise.pH}
                  onChangeText={(v) => handleAnaliseChange('pH', v, 'P')}
                  onSubmitEditing={() => handleSubmitEditing('pH')}
                  placeholder="Ex: 5.1"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>P (mg/dm³)</Text>
                <TextInput
                  ref={inputRefs.P}
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={analise.P}
                  onChangeText={(v) => handleAnaliseChange('P', v, 'K')}
                  onSubmitEditing={() => handleSubmitEditing('P')}
                  placeholder="Ex: 8"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="next"
                />
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>K (mg/dm³)</Text>
                <TextInput
                  ref={inputRefs.K}
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={analise.K}
                  onChangeText={(v) => handleAnaliseChange('K', v, 'Ca')}
                  onSubmitEditing={() => handleSubmitEditing('K')}
                  placeholder="Ex: 73"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Ca (cmolc/dm³)</Text>
                <TextInput
                  ref={inputRefs.Ca}
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={analise.Ca}
                  onChangeText={(v) => handleAnaliseChange('Ca', v, 'Mg')}
                  onSubmitEditing={() => handleSubmitEditing('Ca')}
                  placeholder="Ex: 1.2"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="next"
                />
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Mg (cmolc/dm³)</Text>
                <TextInput
                  ref={inputRefs.Mg}
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={analise.Mg}
                  onChangeText={(v) => handleAnaliseChange('Mg', v, 'Al')}
                  onSubmitEditing={() => handleSubmitEditing('Mg')}
                  placeholder="Ex: 0.6"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Al (cmolc/dm³)</Text>
                <TextInput
                  ref={inputRefs.Al}
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={analise.Al}
                  onChangeText={(v) => handleAnaliseChange('Al', v, 'V')}
                  onSubmitEditing={() => handleSubmitEditing('Al')}
                  placeholder="Ex: 1.1"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="next"
                />
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>V (%)</Text>
                <TextInput
                  ref={inputRefs.V}
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={analise.V}
                  onChangeText={(v) => handleAnaliseChange('V', v, 'T')}
                  onSubmitEditing={() => handleSubmitEditing('V')}
                  placeholder="Ex: 28"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>T (cmolc/dm³)</Text>
                <TextInput
                  ref={inputRefs.T}
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]}
                  keyboardType="numeric"
                  value={analise.T}
                  onChangeText={(v) => handleAnaliseChange('T', v, null)}
                  onSubmitEditing={() => calcular()}
                  placeholder="Ex: 7.1"
                  placeholderTextColor={theme.textMuted}
                  returnKeyType="done"
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.calcButton, { backgroundColor: theme.accent }]}
              onPress={calcular}
            >
              <Text style={[styles.calcButtonText, { color: theme.accentText }]}>
                CALCULAR
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Resultado */}
          {resultado && (
            <View style={[styles.resultCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.resultTitle, { color: theme.accent }]}>
                RELATÓRIO DE RECOMENDAÇÃO
              </Text>
              
              <View style={styles.resultSection}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Diagnóstico</Text>
                <View style={styles.diagnosticoRow}>
                  <Text style={[styles.diagnosticoLabel, { color: theme.textMuted }]}>Calagem:</Text>
                  <Text style={{ color: resultado.precisaCalagem ? '#E53935' : '#4CAF50' }}>
                    {resultado.precisaCalagem ? 'NECESSÁRIA' : 'DISPENSÁVEL'}
                  </Text>
                </View>
                <View style={styles.diagnosticoRow}>
                  <Text style={[styles.diagnosticoLabel, { color: theme.textMuted }]}>Gessagem:</Text>
                  <Text style={{ color: resultado.precisaGessagem ? '#E53935' : '#4CAF50' }}>
                    {resultado.precisaGessagem ? 'NECESSÁRIA' : 'DISPENSÁVEL'}
                  </Text>
                </View>
              </View>
              
              {resultado.precisaCalagem && resultado.calagem.doseRecomendada > 0 && (
                <View style={styles.resultSection}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Calagem</Text>
                  <Text style={[styles.resultValue, { color: theme.textPrimary }]}>
                    {resultado.calagem.doseRecomendada.toFixed(2)} t/ha
                  </Text>
                </View>
              )}
              
              {resultado.precisaGessagem && resultado.gessagem.dose > 0 && (
                <View style={styles.resultSection}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Gessagem</Text>
                  <Text style={[styles.resultValue, { color: theme.textPrimary }]}>
                    {resultado.gessagem.dose.toFixed(2)} t/ha
                  </Text>
                </View>
              )}
              
              <View style={styles.resultSection}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Adubação por Hectare (kg/ha)</Text>
                <View style={styles.npkRow}>
                  <View style={styles.npkItem}>
                    <Text style={[styles.npkLabel, { color: theme.accent }]}>N</Text>
                    <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{resultado.adubacao.N}</Text>
                  </View>
                  <View style={styles.npkItem}>
                    <Text style={[styles.npkLabel, { color: theme.accent }]}>P₂O₅</Text>
                    <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{resultado.adubacao.P2O5}</Text>
                  </View>
                  <View style={styles.npkItem}>
                    <Text style={[styles.npkLabel, { color: theme.accent }]}>K₂O</Text>
                    <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{resultado.adubacao.K2O}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.resultSection}>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Adubação por Cova (g/cova)</Text>
                <Text style={[styles.infoText, { color: theme.textMuted, fontSize: 12 }]}>
                  {resultado.plantasPorHa.toLocaleString('pt-BR')} plantas/ha
                </Text>
                <View style={styles.npkRow}>
                  <View style={styles.npkItem}>
                    <Text style={[styles.npkLabel, { color: theme.accent }]}>N</Text>
                    <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{resultado.adubacaoCova.N.toFixed(1)}</Text>
                  </View>
                  <View style={styles.npkItem}>
                    <Text style={[styles.npkLabel, { color: theme.accent }]}>P₂O₅</Text>
                    <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{resultado.adubacaoCova.P2O5.toFixed(1)}</Text>
                  </View>
                  <View style={styles.npkItem}>
                    <Text style={[styles.npkLabel, { color: theme.accent }]}>K₂O</Text>
                    <Text style={[styles.npkValue, { color: theme.textPrimary }]}>{resultado.adubacaoCova.K2O.toFixed(1)}</Text>
                  </View>
                </View>
              </View>
              
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
  container: { flex: 1 },
  title: { fontWeight: '600', marginBottom: 4 },
  subtitle: { marginBottom: 20, opacity: 0.7 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, marginBottom: 16 },
  cardTitle: { fontWeight: '600', marginBottom: 12, fontSize: 16 },
  categoriaContainer: { alignItems: 'center' },
  categoriaGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  categoriaButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center', minWidth: 90 },
  categoriaButtonText: { fontWeight: '500', fontSize: 14 },
  dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  dropdownButtonText: { fontSize: 15 },
  dropdownArrow: { fontSize: 14 },
  culturaInfo: { fontSize: 12, marginTop: 8, textAlign: 'center', fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  dropdownContainer: { width: '85%', maxHeight: '70%', borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  dropdownTitle: { fontSize: 18, fontWeight: '600', padding: 16, textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  dropdownItem: { padding: 14, borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  dropdownItemText: { fontSize: 15, fontWeight: '500' },
  dropdownItemSubtext: { fontSize: 11, marginTop: 2 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfInput: { flex: 1 },
  label: { fontSize: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  infoText: { textAlign: 'center', marginTop: 8, fontSize: 12, fontWeight: '500' },
  calcButton: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  calcButtonText: { fontWeight: '700', fontSize: 16 },
  resultCard: { borderRadius: 16, borderWidth: 1, padding: 18, marginTop: 16, marginBottom: 32 },
  resultTitle: { fontWeight: '700', textAlign: 'center', marginBottom: 16, fontSize: 18 },
  resultSection: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: '#ccc', opacity: 0.8 },
  sectionTitle: { fontWeight: '600', marginBottom: 10, fontSize: 14 },
  diagnosticoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  diagnosticoLabel: { fontSize: 13 },
  resultValue: { fontWeight: '600', fontSize: 16, textAlign: 'center' },
  npkRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  npkItem: { alignItems: 'center', flex: 1 },
  npkLabel: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  npkValue: { fontSize: 20, fontWeight: '600' },
  actionButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  shareButton: { flex: 1, borderRadius: 12, borderWidth: 1, paddingVertical: 12, alignItems: 'center' },
  shareButtonText: { fontWeight: '500', fontSize: 14 },
  newButton: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  newButtonText: { fontWeight: '600', fontSize: 14 },
});