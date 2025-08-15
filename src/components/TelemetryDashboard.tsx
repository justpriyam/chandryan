import React from 'react';
import { Activity, Gauge, Fuel, Clock } from 'lucide-react';

interface TelemetryDashboardProps {
  simulationState: {
    altitude: number;
    velocity: number;
    fuel: number;
    time: number;
    acceleration: number;
    thrust: number;
  };
}

const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ simulationState }) => {
  const fuelPercentage = (simulationState.fuel / 1000) * 100; // Assuming 1000kg max fuel
  const timeMinutes = Math.floor(simulationState.time / 60);
  const timeSeconds = Math.floor(simulationState.time % 60);

  const TelemetryCard = ({ title, value, unit, icon: Icon, color, progress }: {
    title: string;
    value: number;
    unit: string;
    icon: React.ElementType;
    color: string;
    progress?: number;
  }) => (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 hover:bg-slate-800/60 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${color}-600/20`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        {progress !== undefined && (
          <div className="text-xs text-slate-400">{progress.toFixed(0)}%</div>
        )}
      </div>
      
      <div>
        <div className="text-2xl font-bold text-white mb-1">
          {value.toFixed(value < 10 ? 1 : 0)}
          <span className="text-sm text-slate-400 ml-1">{unit}</span>
        </div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">{title}</div>
      </div>
      
      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Telemetry Data</h3>
      
      <div className="grid grid-cols-1 gap-4">
        <TelemetryCard
          title="Altitude"
          value={simulationState.altitude}
          unit="m"
          icon={Activity}
          color="blue"
        />
        
        <TelemetryCard
          title="Velocity"
          value={simulationState.velocity}
          unit="m/s"
          icon={Gauge}
          color="green"
        />
        
        <TelemetryCard
          title="Fuel Remaining"
          value={simulationState.fuel}
          unit="kg"
          icon={Fuel}
          color="orange"
          progress={fuelPercentage}
        />
        
        <TelemetryCard
          title="Mission Time"
          value={timeMinutes + timeSeconds / 60}
          unit={`${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}`}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Advanced Telemetry */}
      <div className="bg-slate-800/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-4 mt-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Advanced Telemetry</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Acceleration:</span>
            <span className="text-white font-mono">{simulationState.acceleration?.toFixed(2) || 0} m/s²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Thrust:</span>
            <span className="text-white font-mono">{simulationState.thrust?.toFixed(0) || 0} N</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">G-Force:</span>
            <span className="text-white font-mono">{((simulationState.acceleration || 0) / 9.81).toFixed(2)} g</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Mass:</span>
            <span className="text-white font-mono">1,749.86 kg</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="bg-slate-800/30 backdrop-blur-md rounded-xl border border-slate-700/50 p-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-3">System Status</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Navigation</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Propulsion</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Communications</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Landing Sensors</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryDashboard;