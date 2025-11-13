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

O propósito central foi **diagnosticar a fraqueza dos dados de entrada** e demonstrar que, com as features disponíveis no CSV fornecido, **o modelo base (V1) representa um teto técnico com recall de ~69%**.

### Por que o modelo V1 não pode melhorar significativamente?

O dataset original possui **limitações estruturais**:
- Poucos atributos discriminantes de risco
- Ausência de histórico de crédito detalhado
- Falta de variáveis comportamentais
- Dados desbalanceados

### A Solução de Negócio - Evolução para V2

**Não é otimizar o modelo. É enriquecer os dados.**

Este projeto demonstra o impacto do enriquecimento de dados através de **dois modelos**:

#### **Modelo V1 (Base)** - Teto Técnico com Dados Limitados
- **Recall**: ~69% (limite com features disponíveis)
- **Erro de Prejuízo (FN)**: 2.761 aprovações ruins
- **Erro de Atrito (FP)**: 21.374 recusas de bons clientes

#### **Modelo V2 (Enriquecido)** - Impacto de Dados Externos
- **Recall**: ~93% (+24 pontos percentuais)
- **Erro de Prejuízo (FN)**: 583 (-79% de redução!)
- **Erro de Atrito (FP)**: 3.389 (-84% de redução!)
- **Feature adicional**: `score_bureau` (simulação de bureau de crédito)

### O Valor da Integração de Dados Externos

Para superar o limite do V1, a PredCred deveria:
- ✅ **Integrar bureaus de crédito** (Serasa, Boa Vista) - **Implementado no V2**
- Adicionar variáveis comportamentais (tempo de conta, movimentação)
- Incluir dados de relacionamento (tempo como cliente, produtos)
- Coletar digital footprint e dados de redes sociais

**Resultado comprovado:** Com apenas UMA feature externa simulada (score de bureau), o modelo V2 reduziu erros críticos em ~80%.

## 🛠️ A Solução Técnica

Este projeto implementa uma arquitetura moderna com múltiplos modelos:

### 1. **Motor de Treinamento DRY** - Arquitetura Escalável
- **`model_trainer.py`**: Motor reutilizável para treinar qualquer versão
- **`train_v1.py`**: Gatilho para modelo base (features originais)
- **`train_v2.py`**: Gatilho para modelo enriquecido (+ score_bureau)
- **`schema.py`**: Hierarquia de classes (V1, V2) com herança
- Eliminação de 95% de código duplicado
- Fácil adição de V3, V4, etc.

### 2. **API Multi-Modelo** - Endpoints Especializados

#### `/score/v1` - Scoring com Modelo Base
```python
POST /score/v1
{
  "income": 50000,
  "age": 35,
  "loan_amount": 200000,
  ...  # Apenas features básicas
}
```

#### `/score/v2` - Scoring com Modelo Enriquecido
```python
POST /score/v2
{
  "income": 50000,
  "age": 35,
  "loan_amount": 200000,
  "score_bureau": 720,  # Feature adicional!
  ...
}
```

#### `/evaluate_threshold` - Simulador de Trade-off A/B
```python
GET /evaluate_threshold?threshold=0.5&model_version=v2
```
Retorna:
- **Erro de Prejuízo (FN)**: Quantos clientes ruins foram aprovados
- **Erro de Atrito (FP)**: Quantos clientes bons foram recusados
- **Comparação**: Alterne entre `v1` e `v2` em tempo real

### 3. **Dashboard de Comparação A/B** - Visualização Interativa
- Toggle entre Modelo V1 e V2
- Ajuste de threshold em tempo real (slider)
- Visualização imediata do impacto nos erros
- Design responsivo e profissional

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

5. **Gere dados enriquecidos (opcional - já gerado)**
```bash
python enrich_data.py
```

6. **Treine os modelos (opcional - já treinados)**
```bash
python train_v1.py  # Modelo base
python train_v2.py  # Modelo enriquecido
```

7. **Inicie a API**
```bash
uvicorn main:app --reload
```

A API estará disponível em `http://127.0.0.1:8000`

### Documentação da API
Acesse `http://127.0.0.1:8000/docs` para ver a documentação interativa (Swagger UI)

## 🎨 Frontend - Dashboard de Comparação A/B

Este projeto inclui um **dashboard interativo** desenvolvido em React que permite:
- **Comparar V1 vs V2**: Toggle entre modelos em tempo real
- **Ajustar threshold**: Slider de 0.1 a 0.9
- **Visualizar impacto**: Erros de prejuízo e atrito atualizados instantaneamente
- **Tomar decisões**: Baseadas em dados e no modelo escolhido

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
pred_cred/
├── backend/
│   ├── main.py                    # API FastAPI multi-modelo
│   ├── model_trainer.py           # Motor de treinamento DRY
│   ├── train_v1.py                # Gatilho modelo V1
│   ├── train_v2.py                # Gatilho modelo V2
│   ├── enrich_data.py             # Gerador de score de bureau
│   ├── schema.py                  # Schemas V1 e V2 (herança)
│   ├── requirements.txt           # Dependências Python
│   ├── data/
│   │   ├── Loan_default.csv                # Dataset original
│   │   └── Loan_default_ENRICHED.csv       # Dataset + bureau score
│   └── artifacts/
│       ├── risk_model_pipeline_v1.joblib   # Modelo V1
│       ├── risk_model_pipeline_v2.joblib   # Modelo V2
│       ├── X_test_v1.csv / y_test_v1.csv
│       └── X_test_v2.csv / y_test_v2.csv
│
└── predcred_frontend/             # Dashboard React A/B
    ├── src/
    │   ├── components/
    │   │   ├── ThresholdSlider.jsx
    │   │   └── MetricsDisplay.jsx
    │   └── App.jsx                # Comparador A/B
    ├── package.json
    └── README.md
```

## 🔬 Tecnologias Utilizadas

### Backend
- **FastAPI** - Framework web moderno e rápido
- **Scikit-learn** - Machine Learning
- **Imbalanced-learn (SMOTE)** - Balanceamento de classes
- **Pandas / NumPy** - Manipulação de dados
- **Pydantic** - Validação de schemas V1/V2

### Frontend
- **React 19** - Biblioteca UI
- **Vite** - Build tool
- **Axios** - Cliente HTTP
- **rc-slider** - Componente de slider interativo

## 📊 Resultados e Insights

### Comparação de Modelos (Test Set - 76.605 amostras)

| Métrica | V1 (Base) | V2 (Enriquecido) | Melhoria |
|---------|-----------|------------------|----------|
| **Recall** | 69% | **93%** | +24 pp |
| **Precision** | 22% | **71%** | +49 pp |
| **F1-Score** | 0.34 | **0.81** | +138% |
| **Accuracy** | 68% | **95%** | +27 pp |
| **FN (Prejuízo)** | 2.761 | **583** | **-79%** |
| **FP (Atrito)** | 21.374 | **3.389** | **-84%** |

### Insight de Negócio
O dashboard `/evaluate_threshold` com seletor de modelo permite:
1. **Comparar impacto**: V1 vs V2 no mesmo threshold
2. **Otimizar threshold V1**: Threshold conservador para reduzir prejuízo
3. **Otimizar threshold V2**: Threshold agressivo com segurança adicional do bureau
4. **Demonstrar ROI**: Justificar investimento em integração de bureaus

**Não existe "melhor threshold"** - existe o threshold alinhado com a estratégia da empresa e com o modelo disponível.

## 🎓 Conclusões

1. **O problema foi diagnosticado** - V1 limitado pelos dados (69% recall)
2. **A solução foi demonstrada** - V2 com bureau score (+24 pp recall)
3. **A arquitetura é escalável** - Fácil adicionar V3, V4 com novos dados
4. **O ROI é comprovado** - 79% menos prejuízo, 84% menos atrito
5. **A decisão é híbrida** - Modelo + threshold = estratégia de negócio

### Próximos Passos Sugeridos
- **V3**: Adicionar dados comportamentais (movimentação bancária)
- **V4**: Incluir variáveis de relacionamento (tempo como cliente)
- **V5**: Digital footprint e análise de redes sociais
- **Monitoramento**: MLOps para detectar data drift entre V1 e V2

---

**Desenvolvido como case técnico para demonstrar capacidade de:**
- ✅ Diagnóstico de problemas de ML e limitações de dados
- ✅ Arquitetura multi-modelo escalável (DRY pattern)
- ✅ APIs de produção com FastAPI
- ✅ Comparação A/B e ferramentas de decisão
- ✅ Comunicação clara de trade-offs técnicos e de negócio
- ✅ Demonstração quantitativa de ROI em enriquecimento de dados
