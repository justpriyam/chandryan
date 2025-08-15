import React, { useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind } from 'lucide-react';

interface ControlPanelProps {
  simulationState: {
    altitude: number;
    velocity: number;
    fuel: number;
    time: number;
  };
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  simulationState,
  isRunning,
  onStart,
  onPause,
  onReset
}) => {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  return (
    <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Simulation Controls</h3>
      
      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={isRunning ? onPause : onStart}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            isRunning
              ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/25'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? 'Pause' : 'Start'} Simulation
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Speed Controls */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Simulation Speed: {speedMultiplier}x
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSpeedMultiplier(Math.max(0.25, speedMultiplier - 0.25))}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200"
          >
            <Rewind className="w-4 h-4" />
          </button>
          
          <input
            type="range"
            min="0.25"
            max="4"
            step="0.25"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          
          <button
            onClick={() => setSpeedMultiplier(Math.min(4, speedMultiplier + 0.25))}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>0.25x</span>
          <span>4x</span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          <span>Mission Progress</span>
          <span>{Math.floor(simulationState.time / 60)}:{String(Math.floor(simulationState.time % 60)).padStart(2, '0')}</span>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-3 relative">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 relative"
            style={{ width: `${Math.min(100, (simulationState.time / 720) * 100)}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-purple-500"></div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>T-0</span>
          <span>T+12:00</span>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { name: 'Approach', range: [25000, 20000] },
          { name: 'Coarse', range: [20000, 2000] },
          { name: 'Fine', range: [2000, 150] },
          { name: 'Terminal', range: [150, 0] }
        ].map((phase, index) => {
          const isActive = simulationState.altitude <= phase.range[0] && simulationState.altitude > phase.range[1];
          const isComplete = simulationState.altitude <= phase.range[1];
          
          return (
            <div
              key={phase.name}
              className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                  : isComplete
                  ? 'bg-green-600/20 border-green-500/50 text-green-300'
                  : 'bg-slate-800/40 border-slate-600/50 text-slate-400'
              }`}
            >
              <div className="text-xs font-medium">{phase.name}</div>
              <div className="text-xs opacity-75">
                {phase.range[1] > 0 ? `${phase.range[1]}m+` : 'Landing'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ControlPanel;