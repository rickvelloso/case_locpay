# PredCred Frontend - Dashboard de Comparação A/B

Dashboard interativo para comparação de modelos de risco de crédito (V1 vs V2), permitindo:
- Alternar entre modelo base (V1) e modelo enriquecido (V2) em tempo real
- Ajustar o threshold (ponto de corte) e visualizar o impacto
- Comparar erros de prejuízo e atrito entre os modelos
- Demonstrar o valor do enriquecimento de dados

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend da API rodando em `http://127.0.0.1:8000`

## 🚀 Como executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

### 3. Build para produção (opcional)

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `dist/`

### 4. Preview do build de produção (opcional)

```bash
npm run preview
```

## 🛠️ Tecnologias utilizadas

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Ferramenta de build rápida e moderna
- **Axios** - Cliente HTTP para comunicação com a API
- **rc-slider** - Componente de slider interativo e customizável
- **CSS3** - Estilização com animações e responsividade

## 📁 Estrutura do projeto

```
predcred_frontend/
├── src/
│   ├── components/
│   │   ├── ThresholdSlider.jsx    # Componente do slider de threshold
│   │   ├── ThresholdSlider.css
│   │   ├── MetricsDisplay.jsx     # Componente de exibição de métricas
│   │   └── MetricsDisplay.css
│   ├── App.jsx                    # Componente principal
│   ├── App.css
│   ├── main.jsx                   # Ponto de entrada
│   └── index.css                  # Estilos globais
├── public/                        # Arquivos estáticos
├── package.json
└── vite.config.js
```

## 🎯 Funcionalidades

- ✨ **Seletor de Modelo**: Toggle entre V1 (Base) e V2 (Enriquecido)
- 📊 **Comparação A/B**: Visualize as diferenças de performance em tempo real
- 🎚️ **Slider de Threshold**: Ajuste de 0.1 a 0.9 para otimizar trade-offs
- 📉 **Métricas em Tempo Real**: Erros de prejuízo (FN) e atrito (FP) atualizados instantaneamente
- ⚠️ **Banner de Cold Start**: Aviso sobre delay inicial do Render (free tier)
- 🔗 **Link do GitHub**: Acesso direto ao repositório do projeto
- 📱 **Design Responsivo**: Interface adaptada para mobile, tablet e desktop
- 🎨 **Animações Suaves**: Feedback visual e transições polidas
- ⚡ **Performance Otimizada**: React.memo e useCallback para renderizações eficientes

## 📊 Comparação de Modelos

### Modelo V1 (Base)
- 16 features (sem dados externos)
- Recall: ~69%
- FN: 2.761 | FP: 21.374

### Modelo V2 (Enriquecido)
- 17 features (+ score_bureau)
- Recall: ~93% (+24 pp)
- FN: 583 (-79%) | FP: 3.389 (-84%)

**Demonstração visual:** O dashboard permite alternar entre V1 e V2 no mesmo threshold para demonstrar o ROI do enriquecimento de dados.

## 🔗 Integração com Backend

O frontend se conecta automaticamente com a API multi-modelo em:
- **Avaliação de threshold**: `http://127.0.0.1:8000/evaluate_threshold?threshold={value}&model_version={v1|v2}`
- **Parâmetros dinâmicos**: Threshold e versão do modelo enviados a cada alteração

Certifique-se de que o backend esteja rodando antes de usar o dashboard.

## 📝 Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter ESLint
