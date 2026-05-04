# 🛠️ AI Industrial Maintenance Predictor

Uma plataforma avançada de Ciência de Dados voltada para a **Engenharia de Manutenção** e **Análise de Falhas Industriais**. O sistema utiliza algoritmos de Machine Learning para processar dados operacionais de máquinas e prever falhas antes que elas ocorram, permitindo uma transição da manutenção reativa para a **Manutenção Preditiva**.

---

## 🚀 Funcionalidades Principais

*   **Ingestão de Dados Inteligente**: Upload e processamento de arquivos CSV com mapeamento automático de colunas e limpeza de dados.
*   **Pipeline de Dados Robusto**:
    *   Normalização via **Z-Score Standardization**.
    *   Divisão **Estratificada** (Train/Test Split) para manter a proporção de falhas.
    *   Balanceamento de classes via **Bootstrap Oversampling** (Otimizado para evitar viés em datasets desequilibrados).
*   **Múltiplos Algoritmos de Machine Learning**: Treinamento simultâneo e comparação de 7 modelos distintos.
*   **Dashboards de Performance**: Visualização de métricas críticas (**Accuracy, Precision, Recall, F1-Score**) e Matriz de Confusão em tempo real.
*   **Preditor em Tempo Real**: Simulador para entrada de parâmetros manuais e classificação instantânea da condição da máquina.

---

## 🧪 Modelagem e Algoritmos

O sistema avalia a performance através de uma assinatura de desempenho, comparando os seguintes modelos:

1.  **Gradient Boosting**: Ensemble de árvores de decisão focado em resíduos (Alta sensibilidade).
2.  **Random Forest**: Floresta aleatória com 60 estimadores para robustez.
3.  **Support Vector Machine (SVM)**: Classificação via hiperplanos no espaço normalizado.
4.  **K-Nearest Neighbors (KNN)**: Classificação baseada em proximidade espacial (K=3).
5.  **Decision Tree**: Árvore CART para interpretabilidade direta.
6.  **Logistic Regression**: Modelo linear com otimização via Stochastic Gradient Descent.
7.  **Naive Bayes**: Classificação probabilística gaussiana.

---

## 📈 Métricas de Manutenção

Diferente de sistemas genéricos, este dashboard prioriza o **Recall da Classe de Falha**:
*   **Recall**: Garante que o maior número possível de falhas potenciais seja detectado (evita falsos negativos).
*   **F1-Score**: Equilibra a precisão do alarme com a capacidade de detecção.
*   **Threshold Dinâmico**: O sistema utiliza limiares de decisão ajustados (ex: 0.35) para maximizar a segurança operacional.

---

## 🛠️ Stack Tecnológica

*   **Frontend**: React 18, Vite, Tailwind CSS.
*   **Animações**: Framer Motion.
*   **Gráficos**: Recharts / D3.
*   **Processamento ML**: 
    *   `ml-cart` (Árvores)
    *   `ml-random-forest`
    *   `ml-logistic-regression`
    *   `ml-knn`, `ml-svm`, `ml-naivebayes`
*   **Ícones**: Lucide React.

---

## 📋 Como Utilizar

1.  **Prepare seu CSV**: O sistema aceita o dataset padrão de manutenção (como o AI4I 2020) ou similares.
2.  **Upload**: Arraste o arquivo para a área de upload.
3.  **Distribuição**: Confira a aba "Data Distribution" para validar o balanceamento estratificado.
4.  **Seleção**: Escolha o modelo com o melhor **Signature Performance** (recomendamos Gradient Boosting ou Random Forest).
5.  **Simulação**: Utilize o formulário inferior para testar cenários específicos de temperatura, RPM e desgaste de ferramenta.

---

## 📝 Notas de Engenharia

O sistema foi configurado para tratar a coluna `Failure Type` como a fonte de verdade (Target Tuning). Qualquer categoria de erro (Power Failure, Tool Wear Failure, etc.) é mapeada como `Falha (1)`, enquanto "No Failure" é mapeada como `Normal (0)`. Isso garante que o modelo aprenda a assinatura física da instabilidade de processo.

---
**Desenvolvido para profissionais de Engenharia de Confiabilidade e Data Science.**
