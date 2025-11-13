import axios from 'axios';
import { useCallback, useState } from 'react';
import './App.css';
import MetricsDisplay from './components/MetricsDisplay';
import ThresholdSlider from './components/ThresholdSlider';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [threshold, setThreshold] = useState(0.5);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMetrics = useCallback(async (currentThreshold) => {
    setLoading(true);
    setError('');
    setMetrics(null);

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

  const handleSimulateClick = () => {
    fetchMetrics(threshold);
  };

  const handleSliderChange = useCallback((value) => {
    setThreshold(value);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dashboard de Simulação de Risco (LocPay)</h1>
        <p>Use o slider para definir o "ponto de corte" (threshold) de risco e veja o impacto financeiro.</p>
      </header>
      
      <div className="simulator-controls">
        <ThresholdSlider value={threshold} onChange={handleSliderChange} />
        <button 
          className="simulate-button" 
          onClick={handleSimulateClick} 
          disabled={loading}
        >
          {loading ? 'Simulando...' : 'Simular Impacto'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <MetricsDisplay metrics={metrics} />
    </div>
  );
}

export default App;