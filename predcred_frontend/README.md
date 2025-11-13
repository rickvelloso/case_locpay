# PredCred Frontend - Risk Simulation Dashboard

Dashboard interativo para simulação de risco de crédito, permitindo ajustar o threshold (ponto de corte) e visualizar o impacto nos erros de prejuízo e atrito.

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

- ✨ Slider interativo para ajuste de threshold (0.1 a 0.9)
- 📊 Visualização em tempo real de métricas de erro
- 📱 Design responsivo (mobile, tablet e desktop)
- 🎨 Animações suaves e feedback visual
- ⚡ Performance otimizada com React.memo e useCallback

## 🔗 Integração com Backend

O frontend se conecta automaticamente com a API em `http://127.0.0.1:8000/evaluate_threshold`

Certifique-se de que o backend esteja rodando antes de usar o dashboard.

## 📝 Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter ESLint
