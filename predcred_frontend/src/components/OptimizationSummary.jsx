import { memo } from 'react';
import './OptimizationSummary.css';

const OptimizationSummary = memo(({ optimization }) => {
  if (!optimization) return null;

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="optimization-summary">
      <div className="summary-header">
        <h3>🎯 Recomendação Otimizada</h3>
        <p>Threshold ideal calculado com base nos parâmetros financeiros fornecidos</p>
      </div>

      <div className="summary-content">
        <div className="optimal-value">
          <span className="label">Threshold Ótimo</span>
          <span className="value threshold">{optimization.optimal_threshold.toFixed(3)}</span>
          <span className="description">Ponto de corte que minimiza o custo total</span>
        </div>

        <div className="optimal-metrics">
          <div className="metric-item">
            <span className="metric-label">Custo Mínimo Total</span>
            <span className="metric-value cost">{formatCurrency(optimization.min_total_cost)}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">FN no Ótimo</span>
            <span className="metric-value fn">{optimization.fn_at_optimal.toLocaleString('pt-BR')}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">FP no Ótimo</span>
            <span className="metric-value fp">{optimization.fp_at_optimal.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div className="recommendation-box">
          <strong>💡 Recomendação de Negócio:</strong>
          <p>
            Com o threshold de <strong>{optimization.optimal_threshold.toFixed(3)}</strong>, 
            você minimiza o custo total para <strong>{formatCurrency(optimization.min_total_cost)}</strong>, 
            equilibrando {optimization.fn_at_optimal} clientes ruins aprovados e {optimization.fp_at_optimal} clientes bons recusados.
          </p>
        </div>
      </div>
    </div>
  );
});

OptimizationSummary.displayName = 'OptimizationSummary';

export default OptimizationSummary;
