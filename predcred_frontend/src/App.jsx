import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import MetricsDisplay from './components/MetricsDisplay';
import ThresholdSlider from './components/ThresholdSlider';
// Local hosted backend para testes internos
// const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'https://predcred-api.onrender.com'; 

function App() {
  const [threshold, setThreshold] = useState(0.5);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceTimerRef = useRef(null);

  const fetchMetrics = useCallback(async (currentThreshold) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/evaluate_threshold`, {
        params: { threshold: currentThreshold },
        
        // <<< ADICIONE ESTA LINHA DE VOLTA ---
        // Dá 90 segundos para a API "acordar" do cold start
        timeout: 90000 
        
      });
      setMetrics(response.data.metricas_de_negocio);

    } catch (err) {
      console.error("Erro ao buscar dados da API:", err);

      // <<< (Opcional) Melhore a mensagem de erro ---
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('O servidor demorou muito para responder (cold start). Por favor, atualize a página em 30 segundos.');
      } else {
        setError('Falha ao conectar na API. O servidor backend está rodando?');
      }

    } finally {
      setLoading(false);
    }
  }, []);

  const handleSliderChange = useCallback((value) => {
    setThreshold(value);
    
    // Cancela o timer anterior se existir
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Cria um novo timer para chamar a API após 500ms
    debounceTimerRef.current = setTimeout(() => {
      fetchMetrics(value);
    }, 500);
  }, [fetchMetrics]);

  // Carrega os dados iniciais ao montar o componente
  useEffect(() => {
    fetchMetrics(threshold);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dashboard de Simulação de Risco (PredCred)</h1>
        <p>Ajuste o slider para ver o impacto do ponto de corte em tempo real.</p>
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