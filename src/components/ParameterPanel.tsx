import React, { useState } from 'react';
import { X, Save, RotateCcw } from 'lucide-react';

interface ParameterPanelProps {
  parameters: {
    mass: number;
    initialAltitude: number;
    initialVelocity: number;
    fuelCapacity: number;
    thrustMax: number;
  };
  onClose: () => void;
  onUpdateParameters: (params: any) => void;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({
  parameters,
  onClose,
  onUpdateParameters
}) => {
  const [localParams, setLocalParams] = useState(parameters);

  const handleSave = () => {
    onUpdateParameters(localParams);
    onClose();
  };

  const handleReset = () => {
    setLocalParams(parameters);
  };

  const ParameterInput = ({ 
    label, 
    value, 
    unit, 
    min, 
    max, 
    step, 
    onChange,
    description 
  }: {
    label: string;
    value: number;
    unit: string;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    description: string;
  }) => (
    <div className="bg-slate-700/30 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <label className="text-sm font-medium text-white">{label}</label>
        <span className="text-xs text-slate-400">{unit}</span>
      </div>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Mission Parameters</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Adjust the physical parameters of the Chandrayaan-3 mission
          </p>
        </div>

        <div className="p-6 space-y-4">
          <ParameterInput
            label="Lander Mass"
            value={localParams.mass}
            unit="kg"
            min={1000}
            max={3000}
            step={1}
            onChange={(value) => setLocalParams({...localParams, mass: value})}
            description="Total mass including Pragyan rover (actual: 1,749.86 kg)"
          />

          <ParameterInput
            label="Initial Altitude"
            value={localParams.initialAltitude}
            unit="m"
            min={10000}
            max={50000}
            step={1000}
            onChange={(value) => setLocalParams({...localParams, initialAltitude: value})}
            description="Starting altitude above lunar surface (actual: 25,000 m)"
          />

          <ParameterInput
            label="Initial Velocity"
            value={localParams.initialVelocity}
            unit="m/s"
            min={500}
            max={3000}
            step={10}
            onChange={(value) => setLocalParams({...localParams, initialVelocity: value})}
            description="Initial descent velocity (actual: 1,680 m/s)"
          />

          <ParameterInput
            label="Fuel Capacity"
            value={localParams.fuelCapacity}
            unit="kg"
            min={500}
            max={2000}
            step={10}
            onChange={(value) => setLocalParams({...localParams, fuelCapacity: value})}
            description="Maximum fuel available for descent"
          />

          <ParameterInput
            label="Maximum Thrust"
            value={localParams.thrustMax}
            unit="N"
            min={10000}
            max={50000}
            step={1000}
            onChange={(value) => setLocalParams({...localParams, thrustMax: value})}
            description="Maximum engine thrust capability"
          />
        </div>

        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex-1"
          >
            <Save className="w-4 h-4" />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParameterPanel;