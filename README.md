# Chave Botânica Base

Projeto base em Expo/React Native para rodar no VS Code.

## Como usar

1. Abra a pasta no VS Code.
2. No terminal, rode:
   ```bash
   npm install
   npx expo start
   ```
3. Instale o app Expo Go no celular.
4. Escaneie o QR code.

## Estrutura dos JSON

Cada chave deve seguir este padrão:

```json
{
  "chave": "C",
  "itens": [
    {
      "id": "C1",
      "numero_original": 1,
      "chave": "C",
      "tipo": "decisao",
      "texto_a": "Texto da alternativa A",
      "destino_a": "C2",
      "texto_b": "Texto da alternativa B",
      "destino_b": "Solanaceae"
    }
  ]
}
```

## Onde trocar os dados

Substitua os arquivos em `/data`:
- chaveA.json
- chaveB.json
- chaveC.json
- chaveD.json

## O que essa base já faz

- Escolha entre as chaves A, B, C e D
- Navegação entre nós da chave
- Redirecionamento entre chaves, como `"B"` ou `"C87"`
- Resultado final quando chega em uma família
- Botões de voltar e reiniciar

## Próximos passos sugeridos

- adicionar glossário botânico
- adicionar imagens por família
- salvar histórico de identificações
- destacar termos técnicos com ajuda visual
