# PredCred - API Preditiva de Risco Imobiliário

**Versão:** 0.3.0 (Multi-Modelo)

## 📜 Descrição

Este projeto consiste em um microserviço de Machine Learning construído com FastAPI. A API tem como objetivo principal realizar a análise preditiva do risco de inadimplência para contratos de aluguel, fornecendo um score e uma recomendação de negócio.

A API serve **dois modelos de classificação** em paralelo:
- **V1 (Base)**: Modelo com features originais (recall ~69%)
- **V2 (Enriquecido)**: Modelo com integração simulada de bureau de crédito (recall ~93%)

Ambos os modelos podem ser consultados individualmente através de endpoints especializados, permitindo comparação A/B e demonstração do impacto do enriquecimento de dados.

## ✨ Funcionalidades Principais

*   **Scoring Multi-Modelo:** Endpoints separados (`/score/v1` e `/score/v2`) para avaliar proponentes em tempo real com diferentes níveis de enriquecimento de dados.
*   **Avaliação de Threshold Comparativa:** Endpoint `/evaluate_threshold` com parâmetro `model_version` para simular o impacto de diferentes limiares de decisão em ambos os modelos, permitindo comparação A/B.
*   **Arquitetura DRY:** Motor de treinamento reutilizável (`model_trainer.py`) eliminando duplicação de código.
*   **Schemas com Herança:** Sistema de validação baseado em `ContractFeaturesBase`, `ContractFeaturesV1` e `ContractFeaturesV2` usando Pydantic.
*   **Documentação Automática:** A API utiliza os recursos do FastAPI para gerar documentação interativa (Swagger UI e ReDoc).

## 🛠️ Tecnologias Utilizadas

*   **Framework da API:** [FastAPI](https://fastapi.tiangolo.com/)
*   **Servidor ASGI:** [Uvicorn](https://www.uvicorn.org/)
*   **Machine Learning:** [Scikit-learn](https://scikit-learn.org/stable/)
*   **Balanceamento de Classes:** [Imbalanced-learn (SMOTE)](https://imbalanced-learn.org/)
*   **Manipulação de Dados:** [Pandas](https://pandas.pydata.org/) e [NumPy](https://numpy.org/)
*   **Validação de Dados:** [Pydantic](https://docs.pydantic.dev/latest/) com hierarquia de schemas
*   **Persistência de Modelos:** [Joblib](https://joblib.readthedocs.io/)
*   **Gerenciamento de Dependências:** Pip com `requirements.txt`

---

## 🚀 Configuração e Instalação

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### 1. Pré-requisitos

*   [Python 3.9+](https://www.python.org/downloads/)
*   `pip` (gerenciador de pacotes do Python)
*   `venv` (módulo para criação de ambientes virtuais)

### 2. Clone o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd backend
```

### 3. Crie e Ative um Ambiente Virtual

É uma boa prática isolar as dependências do projeto.

```bash
# Crie o ambiente virtual
python3 -m venv venv

# Ative o ambiente (Linux/macOS)
source venv/bin/activate

# Ative o ambiente (Windows)
# .\venv\Scripts\activate
```

### 4. Instale as Dependências

Com o ambiente virtual ativo, instale todas as bibliotecas necessárias:

```bash
pip install -r requirements.txt
```

## 🏃‍♀️ Executando o Projeto

### 1. Geração de Dados Enriquecidos (Opcional)

O dataset enriquecido com score de bureau já está gerado (`Loan_default_ENRICHED.csv`). Para regenerar com nova simulação:

```bash
python enrich_data.py
```

Este script adiciona a coluna `score_bureau` ao dataset original usando distribuições normais realistas.

### 2. Treinamento dos Modelos (Opcional)

Os artefatos dos modelos já estão incluídos no diretório `/artifacts`. Para retreinar:

**Modelo V1 (Base - features originais):**
```bash
python train_v1.py
```

**Modelo V2 (Enriquecido - + score_bureau):**
```bash
python train_v2.py
```

Ambos os scripts utilizam o motor unificado em `model_trainer.py`, seguindo o padrão DRY.

### 3. Inicie a API

Para iniciar o servidor, execute o seguinte comando na raiz do projeto:

```bash
uvicorn main:app --reload
```

O servidor estará disponível em `http://127.0.0.1:8000`. O argumento `--reload` faz com que o servidor reinicie automaticamente após qualquer alteração no código.

## 📚 Documentação da API

Após iniciar o servidor, você pode acessar a documentação interativa gerada automaticamente pelo FastAPI nos seguintes endereços:

*   **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
*   **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### Endpoints Principais

#### `GET /`

*   **Descrição:** Endpoint de "Health Check". Retorna uma mensagem de status se a API estiver online.
*   **Resposta de Sucesso (200):**
    ```json
    {
      "status": "API de Risco Imobiliário está online e operacional."
    }
    ```

#### `POST /score/v1`

*   **Descrição:** Recebe as características de um proponente e retorna a predição usando o **Modelo V1 (Base)**.
*   **Schema:** `ContractFeaturesV1` (16 features - sem score_bureau)
*   **Corpo da Requisição (Exemplo):**
    ```json
    {
      "Age": 32,
      "Income": 65000.0,
      "LoanAmount": 200000.0,
      "CreditScore": 710,
      "MonthsEmployed": 48,
      "NumCreditLines": 3,
      "InterestRate": 12.5,
      "LoanTerm": 36,
      "DTIRatio": 0.25,
      "Education": "Bachelor's",
      "EmploymentType": "Full-time",
      "MaritalStatus": "Married",
      "HasMortgage": "Yes",
      "HasDependents": "No",
      "LoanPurpose": "Home",
      "HasCoSigner": "No"
    }
    ```
*   **Resposta de Sucesso (200):**
    ```json
    {
      "prediction_label": 0,
      "probability_high_risk": 0.35,
      "probability_low_risk": 0.65,
      "business_recommendation": "Aprovação com análise manual"
    }
    ```

#### `POST /score/v2`

*   **Descrição:** Recebe as características de um proponente e retorna a predição usando o **Modelo V2 (Enriquecido)**.
*   **Schema:** `ContractFeaturesV2` (17 features - **inclui score_bureau**)
*   **Corpo da Requisição (Exemplo):**
    ```json
    {
      "Age": 32,
      "Income": 65000.0,
      "LoanAmount": 200000.0,
      "CreditScore": 710,
      "MonthsEmployed": 48,
      "NumCreditLines": 3,
      "InterestRate": 12.5,
      "LoanTerm": 36,
      "DTIRatio": 0.25,
      "Education": "Bachelor's",
      "EmploymentType": "Full-time",
      "MaritalStatus": "Married",
      "HasMortgage": "Yes",
      "HasDependents": "No",
      "LoanPurpose": "Home",
      "HasCoSigner": "No",
      "score_bureau": 720
    }
    ```
*   **Resposta de Sucesso (200):**
    ```json
    {
      "prediction_label": 0,
      "probability_high_risk": 0.08,
      "probability_low_risk": 0.92,
      "business_recommendation": "Aprovação automática"
    }
    ```

#### `GET /evaluate_threshold`

*   **Descrição:** Simula a performance do modelo no conjunto de teste usando um limiar de probabilidade customizado. Suporta comparação entre V1 e V2.
*   **Parâmetros da Query:**
    *   `threshold` (float, opcional, default=0.5): Limiar para classificar um cliente como "Alto Risco".
    *   `model_version` (str, opcional, default="v2"): Versão do modelo ("v1" ou "v2").
*   **Exemplo de Uso:**
    ```
    GET /evaluate_threshold?threshold=0.5&model_version=v2
    GET /evaluate_threshold?threshold=0.3&model_version=v1
    ```
*   **Resposta de Sucesso (200):** Retorna a matriz de confusão, métricas de negócio e o relatório de classificação para o threshold e modelo selecionados.

## 📊 Comparação de Desempenho

### Modelo V1 (Base) - threshold=0.5
- **Recall**: 69%
- **Precision**: 22%
- **Falsos Negativos (FN)**: 2.761 (clientes ruins aprovados)
- **Falsos Positivos (FP)**: 21.374 (clientes bons recusados)

### Modelo V2 (Enriquecido) - threshold=0.5
- **Recall**: 93% (+24 pontos percentuais)
- **Precision**: 71% (+49 pontos percentuais)
- **Falsos Negativos (FN)**: 583 (**-79% de redução**)
- **Falsos Positivos (FP)**: 3.389 (**-84% de redução**)

**Impacto do Enriquecimento:** Com apenas UMA feature adicional (score_bureau), o modelo V2 reduz erros críticos em ~80%.
