# Apêndice de Inteligência Artificial

## Metodologia de Modelagem
O projeto utiliza um pipeline de classificação supervisionada para dados desbalanceados.

### 1. Pré-processamento
- **Normalização**: Aplicamos Z-Score para evitar que variáveis com escalas maiores (RPM) dominem as correlações térmicas.
- **Tratamento de Desbalanceamento**: Utilizamos a técnica de **Bootstrap Oversampling** para igualar a classe de falha (minoritária) à classe normal, garantindo que o modelo não ignore os eventos críticos.

### 2. Algoritmos Avaliados
- **Gradient Boosting (Custom)**: Focado em minimizar o erro residual das árvores anteriores. É o modelo mais sensível a sinais fracos de falha.
- **Random Forest**: Utilizado para estabilidade e extração de importância de variáveis.
- **Support Vector Machine (SVM)**: Testado para separação não-linear de falhas térmicas.

### 3. Métricas de Avaliação
Priorizamos o **Recall** e o **F1-Score** da classe de falha (1). 
- **Recall**: Crucial para manutenção, pois um falso negativo (falha não detectada) resulta em parada de linha custosa.

### 4. Otimização (Grid Search & CV)
Realizamos buscas de hiperparâmetros para profundidade de árvores e taxas de aprendizado, validados via K-Fold Cross Validation para garantir a generalização do modelo em novos ativos.
