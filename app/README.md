# 🖥️ Zero-Downtime: Industrial Intelligence Dashboard

Este é o módulo de interface e inteligência de borda (Edge ML) do projeto **Manutenção Preditiva de Zero-Downtime**. A aplicação foi desenvolvida para fornecer uma interface intuitiva e poderosa para engenheiros de confiabilidade, permitindo o processamento, treinamento e simulação de modelos de Machine Learning diretamente no navegador.

---

## 🚀 Diferenciais Técnicos

Diferente de abordagens tradicionais baseadas em servidor, este dashboard utiliza **Client-Side Machine Learning**. Isso garante:
*   **Privacidade de Dados**: O processamento ocorre localmente, sem que os dados industriais sensíveis saiam da máquina do operador.
*   **Performance Zero-Latency**: Inferências e treinamentos instantâneos utilizando o hardware local.
*   **Portabilidade**: Funciona como uma Progressive Web App (PWA) capaz de operar em ambientes com conectividade limitada.

---

## 🛠️ Stack Tecnológica

A aplicação utiliza o que há de mais moderno no ecossistema Web:

*   **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite 6](https://vitejs.dev/)
*   **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/) (Design System Industrial)
*   **Animações**: [Motion](https://motion.dev/) (Framer Motion)
*   **Visualização de Dados**: [Recharts](https://recharts.org/)
*   **Machine Learning (Edge)**: 
    *   `ml-cart` & `ml-random-forest`
    *   `ml-logistic-regression`
    *   `ml-knn`, `ml-svm`, `ml-naivebayes`
*   **Processamento de Dados**: [PapaParse](https://www.papaparse.com/) (CSV Stream Parsing)

---

## 📂 Estrutura do Projeto

```bash
app/
├── src/
│   ├── services/           # Lógica de negócio e ML
│   │   ├── modelService.ts    # Orquestração de algoritmos e métricas
│   │   └── dataProcessor.ts   # ETL, Normalização e Resampling (Bootstrap)
│   ├── types.ts            # Definições de interface de dados
│   ├── App.tsx             # Componente principal (Dashboard UI)
│   └── main.tsx            # Ponto de entrada da aplicação
├── data/                   # Datasets de demonstração
├── public/                 # Ativos estáticos
└── vite.config.ts          # Configurações de compilação
```

---

## ⚙️ Configuração e Execução

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (Versão 18 ou superior)
*   npm ou yarn

### Instalação

1.  Navegue até a pasta do aplicativo:
    ```bash
    cd app
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

### Desenvolvimento

Para iniciar o servidor de desenvolvimento com Hot Module Replacement (HMR):
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`.

### Build para Produção

Para gerar a versão otimizada para deployment:
```bash
npm run build
```

---

## 📊 Pipeline de Inteligência no Browser

O `dataProcessor.ts` implementa um pipeline completo de Data Science dentro do navegador:

1.  **Parsing**: Leitura assíncrona de grandes arquivos CSV.
2.  **Cleaning**: Mapeamento de tipos e tratamento de valores ausentes.
3.  **Feature Engineering**: Cálculo de deltas térmicos e normalização Z-Score.
4.  **Sampling**: Implementação de **Bootstrap Oversampling** para lidar com o desbalanceamento severo de falhas (comum em dados industriais).
5.  **Split**: Divisão estratificada entre treino e teste para validação rigorosa.

---

## 📝 Notas de Versão

*   **Versão atual**: 1.2.0 (Industrial Intelligence V4.2 Design)
*   **Suporte a Modelos**: 7 algoritmos integrados com comparação de "Signature Performance".
*   **Integração IA**: Suporte experimental para o modelo Gemini via `@google/genai` para análise de insights (requer chave de API no `.env`).

---
**Desenvolvido como parte do projeto de Ciência de Dados - FESA 2026.**
