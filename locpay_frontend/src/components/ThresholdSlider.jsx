import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { memo } from 'react';
import './ThresholdSlider.css';

const ThresholdSlider = memo(({ value, onChange }) => {
  return (
    <div className="threshold-slider">
      <label className="threshold-label">
        Ponto de Corte (Threshold): <strong>{value.toFixed(2)}</strong>
      </label>
      <div className="slider-container">
        <Slider
          min={0.1}
          max={0.9}
          step={0.01}
          value={value}
          onChange={onChange}
          railStyle={{ 
            backgroundColor: '#1a1a1a', 
            height: 12,
            borderRadius: 6
          }}
          trackStyle={{ 
            background: 'linear-gradient(90deg, #61DAFB 0%, #4ca8c3 100%)',
            height: 12,
            borderRadius: 6,
            boxShadow: '0 2px 8px rgba(97, 218, 251, 0.3)'
          }}
          handleStyle={{
            backgroundColor: '#fff',
            border: '4px solid #61DAFB',
            height: 28,
            width: 28,
            marginTop: -8,
            boxShadow: '0 0 0 4px rgba(97, 218, 251, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)',
            opacity: 1
          }}
        />
      </div>
    </div>
  );
});

ThresholdSlider.displayName = 'ThresholdSlider';

export default ThresholdSlider;
