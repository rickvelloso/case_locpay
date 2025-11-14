import { memo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './CostChart.css';

const CostChart = memo(({ data, optimalThreshold, lossPerFN, profitPerFP }) => {
  if (!data || data.length === 0) return null;

  // Formatar dados para o gráfico usando os valores reais dos inputs
  const chartData = data.map(point => ({
    threshold: point.threshold,
    'Custo Total': point.total_cost,
    'Custo FN (Prejuízo)': point.fn_count * lossPerFN,
    'Custo FP (Atrito)': point.fp_count * profitPerFP
  }));

  const formatCurrency = (value) => {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  };

  const formatThreshold = (value) => {
    return value.toFixed(2);
  };

  return (
    <div className="cost-chart-container">
      <h3 className="chart-title">📊 Curva de Custo por Threshold</h3>
      <p className="chart-subtitle">
        Visualize como o custo total varia conforme o threshold. 
        O ponto ótimo ({optimalThreshold?.toFixed(3)}) minimiza o custo total.
      </p>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="threshold" 
            stroke="#aaa"
            label={{ value: 'Threshold', position: 'insideBottom', offset: -5, fill: '#aaa' }}
            tickFormatter={formatThreshold}
          />
          <YAxis 
            stroke="#aaa"
            label={{ value: 'Custo (R$)', angle: -90, position: 'insideLeft', fill: '#aaa' }}
            tickFormatter={formatCurrency}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #555', borderRadius: '8px' }}
            labelStyle={{ color: '#61DAFB' }}
            formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            labelFormatter={(label) => `Threshold: ${label.toFixed(3)}`}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="Custo Total" 
            stroke="#61DAFB" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Custo FN (Prejuízo)" 
            stroke="#ff6b6b" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Custo FP (Atrito)" 
            stroke="#feca57" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="chart-legend-custom">
        <div className="legend-item">
          <span className="legend-line total"></span>
          <span>Custo Total (soma FN + FP)</span>
        </div>
        <div className="legend-item">
          <span className="legend-line fn"></span>
          <span>Custo de Prejuízo (clientes ruins aprovados)</span>
        </div>
        <div className="legend-item">
          <span className="legend-line fp"></span>
          <span>Custo de Atrito (clientes bons recusados)</span>
        </div>
      </div>
    </div>
  );
});

CostChart.displayName = 'CostChart';

export default CostChart;
