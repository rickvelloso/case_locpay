# 🏠 API Preditiva de Risco Imobiliário - PredCred

> [!NOTE]
> **Nota de Contexto:** Este é um projeto de portfólio pessoal. A inspiração para o problema de negócio surgiu de um case técnico real da fintech **LocPay**, focado no desafio de prever o risco de inadimplência em operações de antecipação de aluguel. O projeto **PredCred** é uma implementação fictícia e um exercício de diagnóstico estratégico baseado nesse desafio.

## 📊 O Problema de Negócio

A **PredCred** é uma fintech (fictícia) que oferece soluções de crédito imobiliário. Como qualquer instituição financeira, ela enfrenta um dilema crítico:

- **Aprovar clientes ruins** → Gera prejuízo direto (inadimplência, default)
- **Recusar clientes bons** → Gera perda de receita (atrito, oportunidade perdida)

O desafio é encontrar o equilíbrio ideal entre esses dois tipos de erro para maximizar o retorno do negócio.

## 🎯 A Tese do Projeto (Diagnóstico)

> **O objetivo deste projeto não era atingir 99% de acurácia.**

O propósito central foi **diagnosticar a fraqueza dos dados de entrada** e demonstrar que, com as features disponíveis no CSV fornecido, **o recall de ~69% representa um teto técnico**.

### Por que o modelo não pode melhorar significativamente?

O dataset original possui **limitações estruturais**:
- Poucos atributos discriminantes de risco
- Ausência de histórico de crédito detalhado
- Falta de variáveis comportamentais
- Dados desbalanceados

### A Solução de Negócio

**Não é otimizar o modelo. É enriquecer os dados.**

Para superar o limite atual, a PredCred deveria:
- Integrar bureaus de crédito (Serasa, Boa Vista, etc.)
- Adicionar variáveis comportamentais (tempo de conta, movimentação bancária)
- Incluir dados de relacionamento (tempo como cliente, produtos contratados)
- Coletar informações de redes sociais e digital footprint

Com dados mais ricos, um modelo simples superaria facilmente o desempenho atual.

## 🛠️ A Solução Técnica

Este projeto implementa três componentes principais:

### 1. **`train.py`** - Prova da Tese
Script de treinamento que:
- Testa múltiplos modelos (Logistic Regression, Random Forest, XGBoost, LightGBM)
- Demonstra que todos convergem para resultados similares (~69% recall)
- Comprova que o problema está nos dados, não no algoritmo
- Salva o melhor pipeline para produção

### 2. **API `/score`** - Análise Individual
Endpoint para scoring de crédito individual:
```python
POST /score
{
  "income": 50000,
  "age": 35,
  "loan": 200000,
  ...
}
```
Retorna a probabilidade de default e a decisão de aprovação.

### 3. **API `/evaluate_threshold`** - Simulador de Trade-off
Endpoint que permite simular diferentes thresholds (pontos de corte):
```python
GET /evaluate_threshold?threshold=0.5
```
Retorna:
- **Erro de Prejuízo (FN)**: Quantos clientes ruins foram aprovados
- **Erro de Atrito (FP)**: Quantos clientes bons foram recusados

Este simulador permite que o time de negócios **escolha o ponto de equilíbrio ideal** entre prejuízo e atrito, baseado na estratégia da empresa.

## 🚀 Como Executar o Backend

### Pré-requisitos
- Python 3.8+
- pip

### Passo a passo

1. **Navegue até o diretório do backend**
```bash
cd backend
```

2. **Crie um ambiente virtual**
```bash
python -m venv venv
```

3. **Ative o ambiente virtual**
```bash
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

4. **Instale as dependências**
```bash
pip install -r requirements.txt
```

5. **Treine o modelo (opcional - o modelo já está treinado)**
```bash
python train.py
```

6. **Inicie a API**
```bash
uvicorn main:app --reload
```

A API estará disponível em `http://127.0.0.1:8000`

### Documentação da API
Acesse `http://127.0.0.1:8000/docs` para ver a documentação interativa (Swagger UI)

## 🎨 Frontend - Dashboard de Simulação

Este projeto inclui um **dashboard interativo** desenvolvido em React que permite:
- Ajustar o threshold em tempo real com um slider
- Visualizar imediatamente o impacto nos erros de prejuízo e atrito
- Tomar decisões de negócio baseadas em dados

### Como executar o frontend

```bash
cd predcred_frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`

📖 [Documentação completa do frontend](./predcred_frontend/README.md)

## 📁 Estrutura do Projeto

```
case_locpay/
├── backend/
│   ├── main.py              # API FastAPI
│   ├── train.py             # Script de treinamento
│   ├── schema.py            # Schemas Pydantic
│   ├── requirements.txt     # Dependências Python
│   ├── data/
│   │   └── Loan_default.csv # Dataset original
│   └── artifacts/
│       ├── risk_model_pipeline.joblib  # Modelo treinado
│       ├── X_test_data.csv
│       └── y_test_data.csv
│
└── predcred_frontend/       # Dashboard React
    ├── src/
    ├── package.json
    └── README.md
```

## 🔬 Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework web moderno e rápido
- **Scikit-learn** - Machine Learning
- **XGBoost / LightGBM** - Modelos de gradient boosting
- **Pandas** - Manipulação de dados
- **Pydantic** - Validação de dados

### Frontend
- **React 19** - Biblioteca UI
- **Vite** - Build tool
- **Axios** - Cliente HTTP
- **rc-slider** - Componente de slider interativo

## 📊 Resultados e Insights

### Métricas do Modelo (Test Set)
- **Recall**: ~69% (teto técnico com os dados atuais)
- **Precision**: Variável conforme threshold escolhido
- **Interpretação**: O modelo identifica 69% dos casos de default, mas esse é o limite com as features disponíveis

### Insight de Negócio
O dashboard `/evaluate_threshold` permite que o time de negócios:
1. Escolha um threshold mais conservador (ex: 0.3) → Aprova menos, mas reduz prejuízo
2. Escolha um threshold mais agressivo (ex: 0.7) → Aprova mais, mas aumenta receita

**Não existe "melhor threshold"** - existe o threshold alinhado com a estratégia da empresa no momento.

## 🎓 Conclusões

1. **O problema não é o modelo** - É a qualidade e riqueza dos dados
2. **A solução técnica funciona** - API pronta para produção
3. **A decisão é de negócio** - O threshold deve ser escolhido estrategicamente
4. **O próximo passo é enriquecer dados** - Bureaus de crédito, dados comportamentais, etc.

---

**Desenvolvido como case técnico para demonstrar capacidade de:**
- Diagnóstico de problemas de ML
- Desenvolvimento de APIs de produção
- Criação de ferramentas de decisão para negócio
- Comunicação clara de limitações técnicas e soluções práticas
