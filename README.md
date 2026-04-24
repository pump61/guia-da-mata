Corrigido! Aqui está o README atualizado com o nome correto **Guia da Mata**:

```markdown
# 🌳 Guia da Mata

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/seu-usuario/guia-da-mata)
[![Expo](https://img.shields.io/badge/Expo-SDK%2050-000.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-61DAFB.svg)](https://reactnative.dev)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Guia da Mata** é um aplicativo mobile completo para identificação botânica, dendrológica e entomológica, além de ferramentas de diagnóstico do solo para recomendação de calagem, gessagem e adubação. Desenvolvido em React Native/Expo, voltado para estudantes e profissionais da Engenharia Florestal.

---

## 📱 Capturas de Tela

| Tela Principal | Chaveamento Botânico | Diagnóstico do Solo |
|----------------|----------------------|---------------------|
| (Adicione aqui) | (Adicione aqui)      | (Adicione aqui)     |

---

## ✨ Funcionalidades

### 🌿 Chaveamento Botânico
- 4 chaves dicotômicas (A, B, C, D)
- 59 itens por chave
- Imagens de famílias botânicas
- Navegação passo a passo

### 🌲 Chaveamento Dendrológico
- Identificação vegetativa de espécies arbóreas
- Baseado em características morfologicas
- Interface intuitiva

### 🐞 Chaveamento Entomológico
- 31 ordens de insetos
- Chave dicotômica completa
- Imagens ilustrativas por ordem
- Nomes científicos e comuns

### 🧪 Diagnóstico do Solo
- Entrada completa de análise do solo (pH, P, K, Ca, Mg, Al, V%, T)
- Cálculo automático da necessidade de calagem
- Recomendação de gessagem (quando aplicável)
- Adubação recomendada (kg/ha e g/cova)
- Sugestão de fertilizantes comerciais (Ureia, Superfosfato, KCl, etc)
- Compartilhamento do relatório por mensagem

### 🎨 Personalização
- 7 temas integrados (Moss, Stone, Mist, Clay, Dusk, Sakura, Ink)
- Ajuste de tamanho da fonte
- Persistência das preferências via AsyncStorage

### 🔒 Segurança
- Validação de inputs
- Proteção contra divisão por zero
- Limites realistas para valores agronômicos
- Sanitização de entradas

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|-------------|
| React Native | 0.72 | Framework mobile |
| Expo | SDK 50 | Ambiente de desenvolvimento |
| React Navigation | 6.x | Navegação entre telas |
| AsyncStorage | - | Armazenamento local |
| React Native SVG | - | Animações vetoriais |
| React Native Slider | - | Controle de fonte |

---

## 📦 Estrutura do Projeto

```
guia-da-mata/
├── App.js                          # Arquivo principal
├── SplashScreen.js                 # Tela de abertura animada
├── screens/
│   └── AgriculturalScreen.js       # Diagnóstico do Solo
├── data/
│   ├── agricultural/
│   │   ├── cultures.js             # Banco de culturas
│   │   └── soilAnalysis.js         # Funções de análise
│   ├── chaveA.json, chaveB.json... # Chaves botânicas
│   ├── dendrologico.json           # Chave dendrológica
│   ├── chaveInsetos.json           # Chave entomológica
│   ├── botanicImages.js            # Mapeamento de imagens
│   └── insectImages.js             # Mapeamento de insetos
├── utils/
│   ├── theme.js                    # Temas e provider
│   ├── themeLogo.js                # Logo por tema
│   ├── keyEngine.js                # Engine das chaves
│   └── security.js                 # Validações de segurança
├── assets/                         # Imagens e ícones
├── app.json                        # Configuração Expo
└── package.json                    # Dependências
```

---

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Expo Go (Android) ou iOS Simulator (Mac)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/guia-da-mata.git
cd guia-da-mata

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Inicie o projeto
npx expo start

# 4. Execute no dispositivo
# - Android: Escaneie o QR code com o Expo Go
# - iOS: Escaneie o QR code com a câmera
# - Emulador: Pressione 'a' (Android) ou 'i' (iOS)
```

### Build para produção

```bash
# Android
eas build -p android --profile production

# iOS
eas build -p ios --profile production
```

---

## 📊 Dados das Chaves

| Chave | Descrição | Itens |
|-------|-----------|-------|
| Chave A | Flores aclamídeas ou monoclamídeas | 59 |
| Chave B | Flores diclamídeas dialipétalas | 59 |
| Chave C | Flores diclamídeas gamopétalas | 59 |
| Chave D | Gimnospermas | 59 |
| Dendrológica | Espécies arbóreas | 49 |
| Entomológica | Ordens de insetos | 59 |

---

## 🌱 Culturas Disponíveis no Diagnóstico do Solo

### Florestais
- Eucalipto (Eucalyptus spp.)
- Pinus (Pinus spp.)
- Acácia Negra (Acacia mearnsii)
- Araucária (Araucaria angustifolia)
- Teca (Tectona grandis)
- Mogno (Swietenia macrophylla)

### Fruteiras
- Café (Coffea arabica)
- Banana (Musa spp.)
- Cacau (Theobroma cacao)

### Grãos
- Milho (Zea mays)
- Soja (Glycine max)
- Feijão (Phaseolus vulgaris)

### Hortaliças
- Tomate (Solanum lycopersicum)
- Alface (Lactuca sativa)

---

## 🎨 Temas Disponíveis

| Tema | Cor Principal | Fundo |
|------|---------------|-------|
| Moss | #7A9E76 | #EEF2EC |
| Stone | #C9B99A | #F5F2ED |
| Mist | #7A95AA | #EEF1F4 |
| Clay | #B8956A | #F4EFE8 |
| Dusk | #8E82BE | #F0EEF5 |
| Sakura | #C48A94 | #F5EFF0 |
| Ink | #8A8A8A | #1E1E1E |

---

## 🔧 Configuração do App (app.json)

```json
{
  "expo": {
    "name": "Guia da Mata",
    "slug": "chave-botanica-base",
    "version": "1.0.0",
    "backgroundColor": "#fffbe9",
    "android": {
      "package": "com.pumpzera.chavebotanicabase"
    }
  }
}
```

---

## 📚 Referências

- Manual de Calagem e Adubação para o Estado do Rio de Janeiro (2013)
- Manual de Calagem e Adubação para RS/SC (2016)
- Manual de Interpretação de Análise de Solo (Incaper/ES)

---

## 👨‍💻 Desenvolvimento

**Curso:** Engenharia Florestal  
**Organização:** Dhouglas Silva  
**Plataforma:** React Native / Expo

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

- **Autor:** Dhouglas Silva
- **Curso:** Engenharia Florestal
- **GitHub:** [seu-usuario](https://github.com/seu-usuario)

---

## 🙏 Agradecimentos

- Universidade Federal Rural do Rio de Janeiro (UFRRJ)
- Embrapa Agrobiologia
- Emater-Rio
- Todos os colaboradores e testadores do aplicativo

---

## ⚠️ Nota

Este aplicativo é uma ferramenta de apoio técnica. Recomenda-se sempre consultar um engenheiro-agrônomo ou engenheiro florestal para decisões de manejo e adubação.

---

<div align="center">
  <sub>Built with ❤️ for the Forest Engineering community</sub>
</div>
```

## 📁 Nome do repositório sugerido

```
guia-da-mata
```
