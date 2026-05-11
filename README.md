# 🔧 Projeto: Manutenção Preditiva de Zero-Downtime

> Uma plataforma avançada de Ciência de Dados voltada para a **Engenharia de Manutenção** e **Análise de Falhas Industriais**. O sistema utiliza algoritmos de Machine Learning para processar dados operacionais de máquinas e prever falhas antes que elas ocorram, permitindo uma transição da manutenção reativa para a **Manutenção Preditiva**.

![Status do Projeto](https://img.shields.io/badge/Status-Conclu%C3%ADdo%20-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Modelagem-orange?logo=scikit-learn)
![Google AI Studio](https://img.shields.io/badge/Google%20AI%20Studio-Dashboard-purple)

---

## 👥 1. Identificação do Grupo

- **Instituição:** Faculdade Engenheiro Salvador Arena (FESA)
- **Curso:** Engenharia de Controle e Automação
- **Disciplina:** Ciência de Dados
- **Grupo:** Manutenção Preditiva de Zero-Downtime

### Integrantes
* **Yago Patrick Gomide Oliveira Ortolan** - RA: 062210029
* **Vinícius Makimoto de Freitas** - RA: 062210026
* **Raphaella Souza de Moraes** - RA: 062210010
* **Luiz Felipe Farias Mota** - RA: 062210027
* **Carlos Eduardo Gatto** - RA: 062210028

---

## 🎯 2. Área-Problema Selecionada

O grupo selecionou a área de **Manutenção Preditiva**.

### ✅ Recorte do projeto
O sistema utiliza algoritmos de Machine Learning para processar dados operacionais de máquinas e prever falhas antes que elas ocorram.

### 📌 Justificativa e Hipótese
A manutenção preditiva é um pilar da Indústria 4.0. A hipótese central é que variáveis como torque, temperatura e vibração apresentam padrões anômalos detectáveis estatisticamente antes da falha funcional, permitindo intervenções planejadas que evitam o downtime.

---

## 🧩 3. Diagnóstico e Definição do Problema

Explicação fundamentada do cenário de atuação e do desafio técnico.

- **Problema:** A dificuldade em identificar correlações não lineares entre variáveis operacionais e falhas iminentes, que muitas vezes são imperceptíveis em inspeções visuais ou rotinas de manutenção preventiva baseadas apenas em tempo.
- **Impacto:** Redução drástica de custos com manutenção corretiva, otimização da vida útil dos componentes e aumento da confiabilidade operacional do parque fabril.

---

## 🗂️ 4. Arquitetura de Dados (Fonte e Dataset)

* **Origem:** [Predictive Maintenance Dataset - Kaggle](https://www.kaggle.com/datasets/nair26/predictive-maintenance-of-machines?resource=download)
* **Características:** O conjunto de dados apresenta 500 registros e 10 atributos técnicos.
* **Variáveis Principais:** Air Temperature, Process Temperature, Rotational Speed, Torque, Vibration e Operational Hours.
* **Variável Alvo:** `Failure Type` (Indica a ocorrência e o tipo da falha).

---

## 🔄 5. Plano de Tratamento de Dados (ETL)

O pipeline de dados segue as etapas:
1. **Extração:** Ingestão de dados brutos via arquivos CSV na pasta `/data/raw`.
2. **Transformação:** Limpeza de nulos, tratamento de duplicatas, padronização de nomenclatura e criação de variáveis derivadas como `has_failure` e `delta_temperature`.
3. **Carga:** Armazenamento dos dados tratados em `/data/processed` para consumo dos modelos de ML.

---

## 📈 6. Desenvolvimento e Otimização (M2, M3 e M4)

### M2 — Análise Exploratória (EDA)
Análise descritiva para identificar correlações, distribuições e padrões iniciais no dataset. Uso de histogramas, boxplots e matrizes de correlação.

### M3 — Modelagem de IA
Desenvolvimento dos modelos preditivos e avaliação inicial de desempenho (Acurácia, Precisão, Recall, F1-Score).

### M4 — Refinamento e Otimização Profissional
Etapa final para garantir a robustez técnica:
* **Ajuste de Hiperparâmetros:** Uso de `GridSearchCV` para encontrar a configuração ideal.
* **Validação Cruzada (Cross-Validation):** Garantia de generalização do modelo.
* **Engenharia de Atributos Final:** Identificação do *Feature Importance* para explicar as predições.

---

## 🖥️ 7. Dashboard de Monitoramento

Interface visual rica (Industrial Intelligence V4.2) desenvolvida para monitoramento e validação interativa dos modelos de Machine Learning:

* **Link do Protótipo:** [Dashboard]([https://colab.research.google.com/drive/103UgsdlRPv8nEaVcMZ7EAl5Mgn4bnZkB](https://aistudio.google.com/apps/ecd31dca-8a72-423e-8d1f-ca62b0699579?showAssistant=true&showPreview=true))
* **Visão Geral e Métricas:** Painel exibindo a distribuição dos dados de treino/teste, volume do sistema e os KPIs de performance do modelo (Acurácia, Recall, F1-Score e CV Score).
* **Avaliação de Algoritmos (Performance Signature):** Comparativo visual em gráficos de barras mostrando o desempenho de diferentes modelos (Decision Tree, Random Forest, Gradient Boosting, SVM, KNN, Naive Bayes).
* **Explicabilidade da IA (Feature Importance):** Gráfico que revela o peso de cada variável na decisão da IA, destacando fatores críticos como *Tool Wear* e *Process Temp*.
* **Motor de Inferência (Inference Engine):** Módulo prático onde o operador pode inserir parâmetros manuais da máquina (Tipo, Temperatura, RPM, Torque, Ciclo de Desgaste) para prever o estado do equipamento em tempo real.
* **Análise Detalhada:** Visualização direta da Matriz de Confusão e da telemetria recente de ativos operacionais (*Asset Telemetry Sample*).
---

## 🧱 8. Estrutura do Repositório

Organização das pastas conforme o padrão profissional exigido:

```bash
/
├── data/               # Conjuntos de   dados
│   ├── raw/            # Arquivos originais (imutáveis)
│   └── processed/      # Arquivos tratados após ETL
│
├── images/             # Identidade visual e screenshots
│
├── notebooks/          # Notebooks Jupyter
│   ├── compilado.ipynb # Arquivo final
│   └── n1_individual/  # Testes estatísticos individuais
│
├── app/                # Interface Web
│   ├── src             # Código principal
│
├── requirements.txt    # Lista de bibliotecas
└── README.md           # Documentação principal
```

## 🚀 9. Instruções para Execução

Para reproduzir o ambiente e executar o projeto, siga os passos abaixo:

1.  **Clonar o Repositório:**
   ```bash
    git clone https://github.com/yagoortolan-ops/Manuten-o-Preditiva-de-Zero-Downtime
    
   ```

2.  **Instalar Dependências:** 
    ```bash
    pip install -r requirements.txt
    ```

3.  **Executar Pipeline de Dados:**
    ```bash
    python scripts/etl.py
    ```

4.  **Executar Treinamento do Modelo Otimizado:**
    ```bash
    python scripts/train_model.py
    ```

---

## 🧪 10. N1 Individual — Aprofundamento Estatístico

Investigação estatística inferencial realizada individualmente para validar as hipóteses do projeto.

| Integrante | Variável Analisada | Teste Realizado | Link do Notebook |
| :--- | :--- | :--- | :--- |
| **Yago Patrick Ortolan** | Torque (Nm) | Shapiro-Wilk / Teste T / Mann-Whitney | `notebooks/n1_individual/yago_torque.ipynb` |
| **Carlos Eduardo Gatto** | Horas Operacionais | Shapiro-Wilk / Mann-Whitney | `notebooks/n1_individual/carlos_hours.ipynb` |
| **Luiz Felipe Mota** | Nível de Vibração | Shapiro-Wilk / Teste T / Mann-Whitney | `notebooks/n1_individual/luiz_vibracao.ipynb` |
| **Raphaella Souza de Moraes** | Process Temperature | Shapiro-Wilk / Mann-Whitney | `notebooks/n1_individual/raphaella_temp.ipynb` |
| **Vinícius Makimoto de Freitas** | Velocidade Rotacional (RPM) | Shapiro-Wilk / Mann-Whitney | `notebooks/n1_individual/vinicius_rpm.ipynb` |

--- 

## 🤖 11. Apêndice de IA

Relato sobre o suporte de ferramentas de Inteligência Artificial Generativa no desenvolvimento:

* **Ferramentas:** Gemini e ChatGPT.
* **Aplicação:** Apoio na estruturação do pipeline de ETL, sugestão de bibliotecas para testes estatísticos e revisão da documentação.
* **Validação:** Todas as conclusões estatísticas e códigos de processamento foram validados tecnicamente pelos integrantes do grupo.

---
© 2026 - Projeto de Ciência de Dados - Faculdade Engenheiro Salvador Arena
