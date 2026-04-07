import 'react-native-gesture-handler';
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
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
import { normalizeKeyData, getItemById, isNodeDestination } from './utils/keyEngine';

const Stack = createNativeStackNavigator();

const rawKeys = {
  A: chaveA,
  B: chaveB,
  C: chaveC,
  D: chaveD,
};

const keyTitles = {
  A: 'Chave A',
  B: 'Chave B',
  C: 'Chave C',
  D: 'Chave D',
};

const keySubtitles = {
  A: 'Flores aclamídeas ou monoclamídeas',
  B: 'Flores diclamídeas dialipétalas',
  C: 'Flores diclamídeas gamopétalas',
  D: 'Gimnospermas',
};

/**
 * Adicione aqui as famílias que tiverem imagem.
 * O nome da chave deve bater com o resultado final da família
 * ou com a versão "limpa" sem o texto entre parênteses.
 */
const familyImages = {
  Poaceae: require('./assets/familias/poaceae.png'),
  Moraceae: require('./assets/familias/moraceae.png'),
  Euphorbiaceae: require('./assets/familias/euphorbiaceae.png'),
};

function getFamilyImage(family) {
  if (!family) return null;

  const cleanFamily = family.split('(')[0].trim();
  return familyImages[family] || familyImages[cleanFamily] || null;
}

function HomeScreen({ navigation, normalizedKeys }) {
  const insets = useSafeAreaInsets();

  function startKey(keyId) {
    const keyData = normalizedKeys[keyId];

    if (!keyData || !keyData.items.length) {
      Alert.alert('Erro', `A ${keyId} não possui itens carregados.`);
      return;
    }

    navigation.navigate('Flow', {
      selectedKey: keyId,
      currentItemId: keyData.items[0].id,
      history: [],
    });
  }

  function showCredits() {
    Alert.alert(
      'Créditos',
      'Aplicativo de chave de identificação botânica.\n\nCurso: Engenharia Florestal\n\nOrganização do projeto: Dhouglas Silva\n\nBaseado em chaves botânicas estruturadas para navegação interativa.',
      [{ text: 'Fechar' }]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.appFrame,
          {
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 14),
          },
        ]}
      >
        <View style={styles.homeScreen}>
          <View style={styles.headerWrap}>
            <Image
              source={require('./assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>Chave de Identificação</Text>
            <Text style={styles.appSubtitle}>
              Angiosperms e gimnospermas nativas e cultivadas do Brasil
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escolha uma chave</Text>
            <Text style={styles.helperText}>
              Selecione uma das chaves abaixo para iniciar a identificação botânica.
            </Text>

            <View style={styles.buttonGroup}>
              {Object.keys(normalizedKeys).map((keyId) => (
                <TouchableOpacity
                  key={keyId}
                  onPress={() => startKey(keyId)}
                  activeOpacity={0.94}
                  style={styles.keyCard}
                >
                  <View style={styles.keyBadge}>
                    <Text style={styles.keyBadgeText}>{keyId}</Text>
                  </View>

                  <View style={styles.keyTextWrap}>
                    <Text style={styles.keyCardTitle}>{keyTitles[keyId]}</Text>
                    <Text style={styles.keyCardSubtitle}>{keySubtitles[keyId]}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.creditsButton}
              activeOpacity={0.88}
              onPress={showCredits}
            >
              <Text style={styles.creditsButtonText}>Créditos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FlowScreen({ navigation, route, normalizedKeys }) {
  const insets = useSafeAreaInsets();
  const { selectedKey, currentItemId, history = [] } = route.params;

  const currentKeyData = normalizedKeys[selectedKey];
  const currentItem =
    currentKeyData && currentItemId ? getItemById(currentKeyData, currentItemId) : null;

  function goHome() {
    navigation.popToTop();
  }

  function goBackStep() {
    if (!history.length) {
      navigation.goBack();
      return;
    }

    const newHistory = [...history];
    const last = newHistory.pop();

    navigation.setParams({
      selectedKey: last.key,
      currentItemId: last.itemId,
      history: newHistory,
    });
  }

  function resolveDestination(destination) {
    if (isNodeDestination(destination)) {
      const targetKey = destination.charAt(0).toUpperCase();
      const targetKeyData = normalizedKeys[targetKey];

      if (!targetKeyData) {
        Alert.alert('Destino inválido', `A chave ${targetKey} não foi encontrada.`);
        return;
      }

      const targetItem = getItemById(targetKeyData, destination);

      if (!targetItem) {
        Alert.alert('Destino inválido', `O item ${destination} não foi encontrado.`);
        return;
      }

      navigation.setParams({
        selectedKey: targetKey,
        currentItemId: destination,
        history: [...history, { key: selectedKey, itemId: currentItemId }],
      });
      return;
    }

    navigation.navigate('Result', {
      selectedKey,
      result: destination,
      history: [...history, { key: selectedKey, itemId: currentItemId }],
    });
  }

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
        <View
          style={[
            styles.appFrame,
            {
              paddingTop: Math.max(insets.top, 8),
              paddingBottom: Math.max(insets.bottom, 14),
            },
          ]}
        >
          <View style={styles.flowScreen}>
            <View style={styles.flowSection}>
              <Text style={styles.errorText}>Item atual não encontrado.</Text>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.88}
                onPress={goHome}
              >
                <Text style={styles.secondaryButtonText}>Voltar ao início</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.appFrame,
          {
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 14),
          },
        ]}
      >
        <View style={styles.flowScreen}>
          <View style={styles.flowSection}>
            <View>
              <Text style={styles.badge}>
                {keyTitles[selectedKey]} · Item {currentItem.numero_original}
              </Text>

              <Text style={styles.questionTitle}>Escolha a alternativa observada</Text>

              <View style={styles.choiceArea}>
                <TouchableOpacity
                  style={styles.choiceCard}
                  activeOpacity={0.94}
                  onPress={() => resolveDestination(currentItem.destino_a)}
                >
                  <Text style={styles.choiceLabel}>Opção A</Text>
                  <Text style={styles.choiceText}>{currentItem.texto_a}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.choiceCard}
                  activeOpacity={0.94}
                  onPress={() => resolveDestination(currentItem.destino_b)}
                >
                  <Text style={styles.choiceLabel}>Opção B</Text>
                  <Text style={styles.choiceText}>{currentItem.texto_b}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.88}
                onPress={goBackStep}
              >
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primarySmallButton}
                activeOpacity={0.9}
                onPress={goHome}
              >
                <Text style={styles.primarySmallButtonText}>Início</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function ResultScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { selectedKey, result, history = [] } = route.params;
  const familyImage = getFamilyImage(result);

  function goHome() {
    navigation.popToTop();
  }

  function goBackStep() {
    if (!history.length) {
      navigation.popToTop();
      return;
    }

    const newHistory = [...history];
    const last = newHistory.pop();

    navigation.reset({
      index: 1,
      routes: [
        { name: 'Home' },
        {
          name: 'Flow',
          params: {
            selectedKey: last.key,
            currentItemId: last.itemId,
            history: newHistory,
          },
        },
      ],
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.appFrame,
          {
            paddingTop: Math.max(insets.top, 8),
            paddingBottom: Math.max(insets.bottom, 14),
          },
        ]}
      >
        <View style={styles.flowScreen}>
          <View style={styles.flowSection}>
            <View>
              <Text style={styles.badge}>{keyTitles[selectedKey]}</Text>
              <Text style={styles.questionTitle}>Família identificada</Text>

              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Resultado final</Text>

                {familyImage ? (
                  <View style={styles.imageContainer}>
                    <Image
                      source={familyImage}
                      style={styles.resultImage}
                      resizeMode="cover"
                    />
                  </View>
                ) : null}

                <Text style={styles.resultText}>{result}</Text>
              </View>
            </View>

            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.88}
                onPress={goBackStep}
              >
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primarySmallButton}
                activeOpacity={0.9}
                onPress={goHome}
              >
                <Text style={styles.primarySmallButtonText}>Nova identificação</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function RootNavigator() {
  const normalizedKeys = useMemo(() => {
    const result = {};
    for (const [keyId, value] of Object.entries(rawKeys)) {
      result[keyId] = normalizeKeyData(value, keyId);
    }
    return result;
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: { backgroundColor: '#eef5ee' },
      }}
    >
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} normalizedKeys={normalizedKeys} />}
      </Stack.Screen>

      <Stack.Screen name="Flow">
        {(props) => <FlowScreen {...props} normalizedKeys={normalizedKeys} />}
      </Stack.Screen>

      <Stack.Screen name="Result">
        {(props) => <ResultScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef5ee',
  },

  appFrame: {
    flex: 1,
    paddingHorizontal: 18,
  },

  homeScreen: {
    flex: 1,
    justifyContent: 'center',
  },

  flowScreen: {
    flex: 1,
    justifyContent: 'center',
  },

  headerWrap: {
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 6,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2b20',
    textAlign: 'center',
    marginBottom: 6,
  },

  appSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#4f6b53',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },

  section: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  flowSection: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1e2a1f',
  },

  helperText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#526554',
    marginBottom: 18,
  },

  buttonGroup: {
    gap: 12,
  },

  keyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fbf8',
    borderWidth: 1,
    borderColor: '#d8e4d9',
    borderRadius: 18,
    padding: 14,
    overflow: 'hidden',
  },

  keyBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#355e3b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  keyBadgeText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },

  keyTextWrap: {
    flex: 1,
  },

  keyCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2b20',
    marginBottom: 2,
  },

  keyCardSubtitle: {
    fontSize: 14,
    color: '#58705c',
    lineHeight: 20,
  },

  creditsButton: {
    marginTop: 18,
    alignSelf: 'center',
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: '#eef6ef',
    borderWidth: 1,
    borderColor: '#d5e3d6',
  },

  creditsButtonText: {
    color: '#355e3b',
    fontSize: 14,
    fontWeight: '700',
  },

  badge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5b755e',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  questionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e2a1f',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 32,
  },

  choiceArea: {
    marginTop: 8,
    marginBottom: 8,
  },

  choiceCard: {
    borderWidth: 1,
    borderColor: '#d7e3d8',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9fcf9',
    overflow: 'hidden',
  },

  choiceLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5f7b63',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  choiceText: {
    fontSize: 16,
    lineHeight: 28,
    color: '#203022',
    flexShrink: 1,
  },

  resultCard: {
    borderRadius: 18,
    padding: 22,
    backgroundColor: '#eef7ef',
    borderWidth: 1,
    borderColor: '#d2e5d5',
    marginBottom: 16,
  },

  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5c7460',
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },

  resultImage: {
    width: 140,
    height: 140,
    borderRadius: 16,
  },

  resultText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#27442b',
    textAlign: 'center',
  },

  footerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },

  secondaryButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#c9d9cb',
    minHeight: 52,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  primarySmallButton: {
    flex: 1,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 16,
    backgroundColor: '#355e3b',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#355e3b',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  primarySmallButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },

  errorText: {
    fontSize: 16,
    color: '#8a2f2f',
    marginBottom: 12,
  },
});