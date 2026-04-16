# Projeto: Manutenção Preditiva de Zero-Downtime: previsão de falhas em sistemas críticos, utilizando dados de sensores e modelos analíticos para evitar paradas não planejadas.

### 1. Identificação do Grupo
* **Instituição:** Faculdade Engenheiro Salvador Arena (FESA)
* **Curso:** Engenharia de Controle e Automação - ECA10
* **Grupo:** Manutenção Preditiva de Zero-Downtime: previsão de falhas em sistemas críticos, utilizando dados de sensores e modelos analíticos para evitar paradas não planejadas.
* **Integrantes:**
    * Carlos Eduardo Gatto - RA: 062210029
    * Luiz Felipe Farias Mota - RA: 062210027
    * Raphaella Souza de Moraes - RA: 062210010
    * Vinicius Makimoto de Freitas - RA: 062210026
    * Yago Patrick Gomide Oliveira Ortolan - RA: 062210028

---

 [Link do Repositório]( https://colab.research.google.com/drive/103UgsdlRPv8nEaVcMZ7EAl5Mgn4bnZkB#scrollTo=JEqaZVXb7Max )

### 2. Área Problema Selecionada
O grupo seleciona uma das áreas norteadoras abaixo para o desenvolvimento do projeto:
* [x] Manutenção Preditiva de Zero-Downtime
* [ ] Eficiência Energética e Descarbonização via Smart Grids
* [ ] Controle de Qualidade Autônomo com Visão Computacional
* [ ] Gêmeos Digitais (Digital Twins) e Analytics em Tempo Real

---

### 3. Diagnóstico e Definição do Problema
Esta seção apresenta a fundamentação do desafio. O grupo descreve o cenário de atuação e justifica a importância da solução proposta.
* **Contexto:** O projeto está inserido no contexto da Indústria 4.0, na qual sensores instalados em máquinas coletam dados operacionais continuamente, como temperatura, rotação, torque, vibração e horas de operação. Esses dados podem ser utilizados para identificar padrões de funcionamento e prever possíveis falhas antes que ocorram paradas inesperadas. No notebook desenvolvido, foi realizado o processo de ETL (Extração, Transformação e Limpeza dos dados), incluindo padronização dos nomes das colunas, verificação de valores nulos e duplicados, além da criação de novas variáveis que auxiliam na análise do comportamento dos equipamentos, como a variável binária de falha (has_failure) e a diferença de temperatura (delta_temperature).
* **Problema:** A principal dificuldade está em identificar quais variáveis operacionais possuem relação com a ocorrência de falhas nas máquinas. Muitas vezes, as falhas não são perceptíveis visualmente e só são detectadas quando o equipamento já apresenta mau funcionamento ou parada total. Por meio da análise exploratória dos dados, foram investigadas relações entre variáveis como vibração, torque, rotação e horas de operação, buscando identificar padrões que indiquem maior probabilidade de falha. Foram utilizados gráficos como histogramas, boxplots, scatterplots e matriz de correlação para identificar tendências, possíveis anomalias (outliers) e relações estatísticas relevantes entre as variáveis do processo industrial.
* **Impacto:** A análise realizada contribui para o desenvolvimento de estratégias de manutenção preditiva, permitindo que as falhas sejam identificadas antes que causem interrupções no processo produtivo. A identificação de padrões de comportamento associados a falhas pode auxiliar engenheiros e técnicos na tomada de decisão sobre inspeções, ajustes operacionais ou substituição de componentes. Como resultado, espera-se reduzir custos com manutenção corretiva, minimizar paradas inesperadas e aumentar a confiabilidade e eficiência dos equipamentos industriais. Dessa forma, o uso de técnicas de análise de dados torna o processo de manutenção mais estratégico, alinhado aos princípios da Indústria 4.0.
---

### 4. Arquitetura de Dados (Fonte e Dataset)
O projeto utiliza dados estruturados para alimentar os modelos preditivos.
* **Origem dos Dados:** https://www.kaggle.com/datasets/nair26/predictive-maintenance-of-machines?resource=download
* **Características:** O conjunto de dados apresenta variáveis como UDI (identificador único), Product ID, Type (tipo da máquina), Air Temperature (K), Process Temperature (K), Rotational Speed (rpm), Torque (Nm), Vibration Levels, Operational Hours e Failure Type (tipo de falha). Trata-se, portanto, de uma base com variáveis numéricas e categóricas voltadas ao monitoramento operacional e à análise de falhas em máquinas.
* **Volume:** O dataset conta com 500 registros e 10 atributos técnicos.

---

### 5. Plano de Tratamento de Dados (ETL)
O pipeline de dados segue as seguintes etapas de processamento:
1. **Extração:** A ingestão ocorre por meio de arquivo CSV obtido a partir do dataset selecionado no Kaggle e importado para o ambiente Google Colab para leitura com Python.
2. **Transformação:** O grupo realiza a inspeção e limpeza dos dados, incluindo verificação de valores ausentes, identificação de registros duplicados, análise de outliers e padronização dos nomes das colunas. Também podem ser aplicadas transformações complementares, como criação de variáveis derivadas e organização dos tipos de dados para análise.
3. **Carga:** Os dados tratados são disponibilizados na pasta `/data/processed` para consumo dos modelos de Machine Learning.

---

### 6. Estrutura do Repositório
A organização das pastas facilita a manutenção e o versionamento do projeto:
* `/docs`: Contém os diagramas de fluxo de dados e a documentação técnica.
* `/data/raw`: Armazena os arquivos de dados originais (não modificados).
* `/data/processed`: Armazena os dados após a execução do script de ETL.
* `/scripts`: Contém os códigos Python responsáveis pelo tratamento dos dados.
* `requirements.txt`: Lista todas as bibliotecas necessárias para a execução do projeto.

---

### 7. Instruções para Execução
Para reproduzir o ambiente de dados e executar o pipeline de ETL:
1. Clona-se este repositório.
2. Instalam-se as dependências através do comando:
   ```bash
   pip install -r requirements.txt
   
---

### 8. Análise Exploratória de Dados

* O aluno **Yago Patrick Gomide Oliveira Ortolan** investigou estatisticamente a variável torque_nm como possível preditor de falhas. 
O teste de hipótese foi aplicado para verificar se existe diferença significativa nos valores de torque entre máquinas com falha e sem falha.
O teste de normalidade de Shapiro-Wilk indicou que os dados seguem distribuição normal **(p > 0,05)**, permitindo o uso do Teste t.
O Teste t apresentou **p-valor = 0,5099**, indicando que não há evidência estatística suficiente para rejeitar a hipótese nula.
O teste de Mann-Whitney confirmou o resultado **(p = 0,4559)**. O tamanho do efeito calculado pelo d de Cohen foi **-0,157**, indicando efeito muito pequeno.
**Assim, conclui-se que o torque não apresenta diferença estatisticamente significativa entre máquinas com falha e sem falha neste dataset.**
Para o modelo de Machine Learning futuro, a variável torque pode ser utilizada em conjunto com outras variáveis, mas isoladamente não demonstrou forte poder explicativo.

* O aluno **Carlos Gatto** investigou estatisticamente a variável operational_hours como possível preditor de falhas.
O teste de hipótese foi aplicado para verificar se existe diferença significativa nas horas operacionais entre máquinas com falha e sem falha.
O teste de normalidade de Shapiro-Wilk indicou que os dados não seguem distribuição normal **(p < 0,05)**, sendo necessário o uso de um teste não paramétrico.
O teste de Mann-Whitney apresentou **p-valor = 0,2656**, indicando que não há evidência estatística suficiente para rejeitar a hipótese nula.
O tamanho do efeito calculado foi **r = -0,0498**, indicando efeito muito pequeno.
Assim, conclui-se que as horas operacionais não apresentam diferença estatisticamente significativa entre máquinas com falha e sem falha neste dataset.
Para o modelo de Machine Learning futuro, a variável operational_hours pode ser utilizada em conjunto com outras variáveis, mas isoladamente não demonstrou forte poder explicativo.

* O aluno **Luiz Felipe Farias Mota** investigou estatisticamente se as máquinas com maior vibração apresentam mais falhas.
Foi realizado um teste de hipótese com o objetivo de verificar se máquinas que apresentam falhas possuem níveis de vibração diferentes das máquinas que operam normalmente.
Inicialmente, aplicou-se o teste de normalidade de Shapiro-Wilk, que indicou que os dados de vibração podem ser considerados aproximadamente normais (p > 0,05). Dessa forma, foi possível utilizar o Teste t para comparação entre os grupos.
O resultado do Teste t apresentou p-valor maior que 0,05, indicando que não foram encontradas evidências estatísticas suficientes para rejeitar a hipótese nula. Em outras palavras, não foi possível confirmar que existe diferença significativa nos níveis de vibração entre máquinas com falha e máquinas sem falha.
Para reforçar a análise, também foi aplicado o teste não paramétrico de Mann-Whitney, que apresentou resultado consistente (p > 0,05). O cálculo do tamanho do efeito (d de Cohen) resultou em um valor próximo de zero, caracterizando um efeito muito pequeno do ponto de vista prático.
Portanto, os resultados indicam que, neste conjunto de dados, a variável nível de vibração não apresentou diferença estatisticamente significativa entre os grupos analisados.
Do ponto de vista da modelagem preditiva, isso sugere que a vibração, quando analisada isoladamente, não se mostrou um indicador forte de falhas. Entretanto, ela ainda pode contribuir para o modelo de Machine Learning quando combinada com outras variáveis relevantes do processo, como torque, temperatura e tempo de operação.
