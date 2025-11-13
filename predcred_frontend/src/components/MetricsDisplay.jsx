import { memo } from 'react';
import './MetricsDisplay.css';

const MetricsDisplay = memo(({ financials }) => {
  if (!financials) return null;

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const prejuizoPercent = ((financials.prejuizoCount / financials.totalSamples) * 100).toFixed(2);
  const atritoPercent = ((financials.atritoCount / financials.totalSamples) * 100).toFixed(2);

  return (
    <div className="metrics-display">
      <h2 className="metrics-title">
        💵 Impacto Financeiro no Threshold Ótimo
      </h2>
      
      <div className="metrics-grid">
        <div className="metric-card error-prejuizo">
          <h3>🔴 Erro de Prejuízo (FN)</h3>
          <p>Clientes "Ruins" que foram APROVADOS</p>
          <div className="metric-value financial">
            {formatCurrency(financials.totalLoss)}
          </div>
          <div className="metric-details">
            <span className="count-badge">
              {financials.prejuizoCount.toLocaleString('pt-BR')} clientes
            </span>
            <span className="percent-badge">
              {prejuizoPercent}% do total
            </span>
          </div>
          <span className="metric-description">Prejuízo Direto (Default + Inadimplência)</span>
        </div>

        <div className="metric-card error-atrito">
          <h3>🟡 Erro de Atrito (FP)</h3>
          <p>Clientes "Bons" que foram RECUSADOS</p>
          <div className="metric-value financial">
            {formatCurrency(financials.totalOpportunityCost)}
          </div>
          <div className="metric-details">
            <span className="count-badge">
              {financials.atritoCount.toLocaleString('pt-BR')} clientes
            </span>
            <span className="percent-badge">
              {atritoPercent}% do total
            </span>
          </div>
          <span className="metric-description">Perda de Receita (Custo de Oportunidade)</span>
        </div>

        <div className="metric-card total-cost">
          <h3>💰 Custo Total do Erro</h3>
          <p>Soma dos dois tipos de erro</p>
          <div className="metric-value financial total">
            {formatCurrency(financials.totalErrorCost)}
          </div>
          <div className="metric-details">
            <span className="formula-badge">
              FN × Prejuízo + FP × Lucro Perdido
            </span>
          </div>
          <span className="metric-description">Custo Total Minimizado no Threshold Ótimo</span>
        </div>
      </div>
    </div>
  );
});

MetricsDisplay.displayName = 'MetricsDisplay';

export default MetricsDisplay;
