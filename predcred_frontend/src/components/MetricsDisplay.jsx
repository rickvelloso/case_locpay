import { memo } from 'react';
import './MetricsDisplay.css';

const MetricsDisplay = memo(({ metrics }) => {
  if (!metrics) return null;

  const prejuizoPercent = ((metrics.erro_de_prejuizo_count / metrics.total_test_samples) * 100).toFixed(2);
  const atritoPercent = ((metrics.erro_de_atrito_count / metrics.total_test_samples) * 100).toFixed(2);

  return (
    <div className="metrics-display">
      <h2 className="metrics-title">
        Resultados da Simulação (com {metrics.total_test_samples.toLocaleString('pt-BR')} clientes)
      </h2>
      
      <div className="metrics-grid">
        <div className="metric-card error-prejuizo">
          <h3>🔴 Erro de Prejuízo (FN)</h3>
          <p>Clientes "Ruins" que foram APROVADOS</p>
          <div className="metric-value">
            {metrics.erro_de_prejuizo_count.toLocaleString('pt-BR')}
          </div>
          <span>({prejuizoPercent}% do total - Prejuízo Direto)</span>
        </div>

        <div className="metric-card error-atrito">
          <h3>🟡 Erro de Atrito (FP)</h3>
          <p>Clientes "Bons" que foram RECUSADOS</p>
          <div className="metric-value">
            {metrics.erro_de_atrito_count.toLocaleString('pt-BR')}
          </div>
          <span>({atritoPercent}% do total - Perda de Receita)</span>
        </div>
      </div>
    </div>
  );
});

MetricsDisplay.displayName = 'MetricsDisplay';

export default MetricsDisplay;
