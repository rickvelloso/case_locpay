import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import MetricsDisplay from './components/MetricsDisplay';
import ThresholdSlider from './components/ThresholdSlider';

const API_URL = 'http://127.0.0.1:8000';

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
        params: { threshold: currentThreshold }
      });
      setMetrics(response.data.metricas_de_negocio);
    } catch (err) {
      console.error("Erro ao buscar dados da API:", err);
      setError('Falha ao conectar na API. O servidor backend está rodando?');
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