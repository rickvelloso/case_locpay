import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import MetricsDisplay from './components/MetricsDisplay';
import ThresholdSlider from './components/ThresholdSlider';
// Local hosted backend para testes internos
const API_URL = 'http://127.0.0.1:8000';
//const API_URL = 'https://predcred-api.onrender.com'; 

function App() {
  const [threshold, setThreshold] = useState(0.5);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showColdStartWarning, setShowColdStartWarning] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [modelVersion, setModelVersion] = useState('v2'); // v1 ou v2
  const debounceTimerRef = useRef(null);

  const fetchMetrics = useCallback(async (currentThreshold, version) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/evaluate_threshold`, {
        params: { 
          threshold: currentThreshold,
          model_version: version || modelVersion
        },
        timeout: 90000 
      });
      setMetrics(response.data.metricas_de_negocio);
      
      // Remove o aviso após o primeiro carregamento bem-sucedido
      if (isFirstLoad) {
        setIsFirstLoad(false);
        setTimeout(() => setShowColdStartWarning(false), 3000);
      }

    } catch (err) {
      console.error("Erro ao buscar dados da API:", err);

      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('O servidor demorou muito para responder (cold start). Por favor, atualize a página em 30 segundos.');
      } else {
        setError('Falha ao conectar na API. O servidor backend está rodando?');
      }

    } finally {
      setLoading(false);
    }
  }, [modelVersion]);

  const handleSliderChange = useCallback((value) => {
    setThreshold(value);
    
    // Cancela o timer anterior se existir
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Cria um novo timer para chamar a API após 500ms
    debounceTimerRef.current = setTimeout(() => {
      fetchMetrics(value, modelVersion);
    }, 500);
  }, [fetchMetrics, modelVersion]);

  const handleModelChange = (version) => {
    setModelVersion(version);
    fetchMetrics(threshold, version);
  };

  // Carrega os dados iniciais ao montar o componente
  useEffect(() => {
    fetchMetrics(threshold, modelVersion);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dashboard de Comparação A/B (PredCred)</h1>
        <p>Compare o desempenho dos modelos V1 (base) e V2 (enriquecido) em tempo real.</p>
        <a 
          href="https://github.com/rickvelloso/pred_cred" 
          target="_blank" 
          rel="noopener noreferrer"
          className="github-link"
        >
          <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          Ver no GitHub
        </a>
      </header>

      {showColdStartWarning && (
        <div className="cold-start-banner">
          <div className="cold-start-content">
            <svg className="info-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <div className="cold-start-text">
              <strong>⚡ Free Tier Hosting Notice:</strong> The backend is hosted on Render's free tier. 
              Initial load may take 30-60 seconds due to cold start. This is a hosting limitation, not a software issue.
            </div>
            <button 
              className="cold-start-close"
              onClick={() => setShowColdStartWarning(false)}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="model-selector">
        <h3>Selecione o Modelo</h3>
        <div className="model-buttons">
          <button 
            className={`model-button ${modelVersion === 'v1' ? 'active' : ''}`}
            onClick={() => handleModelChange('v1')}
          >
            <div className="model-badge">V1</div>
            <div className="model-name">Modelo Base</div>
            <div className="model-description">Features básicas</div>
          </button>
          <button 
            className={`model-button ${modelVersion === 'v2' ? 'active' : ''}`}
            onClick={() => handleModelChange('v2')}
          >
            <div className="model-badge">V2</div>
            <div className="model-name">Modelo Enriquecido</div>
            <div className="model-description">Features + Bureau Score</div>
          </button>
        </div>
      </div>
      
      <div className="simulator-controls">
        <ThresholdSlider value={threshold} onChange={handleSliderChange} />
        {loading && <div className="loading-indicator">Calculando...</div>}
      </div>

      {error && <div className="error-message">{error}</div>}

      <MetricsDisplay metrics={metrics} />
    </div>
  );
}

export default App;