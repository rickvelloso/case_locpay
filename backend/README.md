# LocPay - API Preditiva de Risco Imobiliário

**Versão:** 0.2.0

## 📜 Descrição

Este projeto consiste em um microserviço de Machine Learning construído com FastAPI. A API tem como objetivo principal realizar a análise preditiva do risco de inadimplência para contratos de aluguel, fornecendo um score e uma recomendação de negócio.

A API serve um modelo de classificação treinado para avaliar um conjunto de características do proponente e do contrato, e com base nisso, classificar o risco como "Baixo Risco" ou "Alto Risco".

## ✨ Funcionalidades Principais

*   **Scoring Individual:** Endpoint para avaliar um único proponente em tempo real.
*   **Avaliação de Threshold:** Endpoint para simular o impacto de diferentes limiares de decisão (thresholds) sobre um conjunto de dados de teste, permitindo analisar as métricas de negócio (ex: perda de clientes vs. prejuízo evitado).
*   **Documentação Automática:** A API utiliza os recursos do FastAPI para gerar documentação interativa (Swagger UI e ReDoc).

## 🛠️ Tecnologias Utilizadas

*   **Framework da API:** [FastAPI](https://fastapi.tiangolo.com/)
*   **Servidor ASGI:** [Uvicorn](https://www.uvicorn.org/)
*   **Machine Learning:** [Scikit-learn](https://scikit-learn.org/stable/)
*   **Manipulação de Dados:** [Pandas](https://pandas.pydata.org/) e [NumPy](https://numpy.org/)
*   **Validação de Dados:** [Pydantic](https://docs.pydantic.dev/latest/)
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
cd locpay_risk_api
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

### 1. Treinamento do Modelo (Opcional)

O artefato do modelo treinado (`risk_model_pipeline.joblib`) já está incluído no diretório `/artifacts`. No entanto, se você realizou alterações nos dados ou no script de treinamento, pode gerar um novo modelo executando:

```bash
python train.py
```

Este comando irá salvar o pipeline de modelo treinado e os dados de teste no diretório `/artifacts`.

### 2. Inicie a API

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

#### `POST /score`

*   **Descrição:** Recebe as características de um proponente e retorna a predição de risco, as probabilidades e uma recomendação de negócio.
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
      "probability_high_risk": 0.15,
      "probability_low_risk": 0.85,
      "business_recommendation": "Aprovação automática"
    }
    ```

#### `GET /evaluate_threshold`

*   **Descrição:** Simula a performance do modelo no conjunto de teste usando um limiar de probabilidade customizado.
*   **Parâmetros da Query:**
    *   `threshold` (float, opcional, default=0.5): Limiar para classificar um cliente como "Alto Risco".
*   **Resposta de Sucesso (200):** Retorna a matriz de confusão, métricas de negócio e o relatório de classificação para o threshold informado.
