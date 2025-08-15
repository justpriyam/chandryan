import React from 'react';
import { X, BookOpen, Calculator, Rocket } from 'lucide-react';

interface EducationalPanelProps {
  currentPhase: string;
  simulationState: {
    altitude: number;
    velocity: number;
    fuel: number;
    time: number;
  };
  onClose: () => void;
}

const EducationalPanel: React.FC<EducationalPanelProps> = ({
  currentPhase,
  simulationState,
  onClose
}) => {
  const getPhaseContent = () => {
    if (simulationState.altitude > 20000) {
      return {
        title: "Approach Phase",
        icon: Rocket,
        description: "The lander begins its powered descent from lunar orbit",
        physics: [
          "Initial velocity: 1.68 km/s horizontal",
          "Lunar gravity: 1.62 m/s² downward",
          "Engine throttling begins to reduce velocity"
        ],
        equation: "F = ma (Newton's Second Law)",
        explanation: "The thrust force must overcome lunar gravity and reduce horizontal velocity for a controlled descent."
      };
    } else if (simulationState.altitude > 2000) {
      return {
        title: "Coarse Braking Phase",
        icon: Calculator,
        description: "Primary velocity reduction using maximum engine thrust",
        physics: [
          "Maximum thrust applied: ~25,000 N",
          "Rapid deceleration from 1,680 m/s",
          "Fuel consumption rate: ~8 kg/s"
        ],
        equation: "Δv = ve * ln(m0/mf) (Tsiolkovsky Rocket Equation)",
        explanation: "The rocket equation governs how much velocity change we can achieve with available fuel mass."
      };
    } else if (simulationState.altitude > 150) {
      return {
        title: "Fine Braking Phase",
        icon: BookOpen,
        description: "Precision velocity control and trajectory adjustment",
        physics: [
          "Variable thrust: 1,500-15,000 N",
          "Hazard avoidance system active",
          "Navigation cameras operational"
        ],
        equation: "v² = u² + 2as (Kinematic Equation)",
        explanation: "Careful velocity management ensures the lander can stop at the precise altitude for final descent."
      };
    } else {
      return {
        title: "Terminal Descent",
        icon: Rocket,
        description: "Final approach to lunar surface with precise landing",
        physics: [
          "Altitude hold at 150m for site verification",
          "Vertical descent at 2 m/s",
          "Landing legs deployment"
        ],
        equation: "P = F/A (Pressure Equation)",
        explanation: "Engine thrust is carefully controlled to ensure gentle touchdown without damaging the lander or surface."
      };
    }
  };

  const content = getPhaseContent();
  const IconComponent = content.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <IconComponent className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{content.title}</h3>
                <p className="text-sm text-slate-400">Educational Context</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Phase Description */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Phase Description</h4>
            <p className="text-slate-200">{content.description}</p>
          </div>

          {/* Physics Principles */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Physics at Work</h4>
            <div className="space-y-2">
              {content.physics.map((principle, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-200 text-sm">{principle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Equation */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Key Equation</h4>
            <div className="text-center">
              <div className="text-lg font-mono text-blue-300 mb-2">{content.equation}</div>
              <p className="text-sm text-slate-400">{content.explanation}</p>
            </div>
          </div>

          {/* Mission Facts */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Chandrayaan-3 Mission Facts</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-xs text-slate-400">Launch Date</div>
                <div className="text-sm font-medium text-white">July 14, 2023</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-xs text-slate-400">Landing Date</div>
                <div className="text-sm font-medium text-white">August 23, 2023</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-xs text-slate-400">Landing Site</div>
                <div className="text-sm font-medium text-white">Lunar South Pole</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-xs text-slate-400">Mission Duration</div>
                <div className="text-sm font-medium text-white">1 Lunar Day (14 Earth days)</div>
              </div>
            </div>
          </div>

          {/* Current Telemetry Context */}
          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Current Simulation Data</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400">Altitude</div>
                <div className="text-lg font-mono text-white">{simulationState.altitude.toFixed(0)} m</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Velocity</div>
                <div className="text-lg font-mono text-white">{simulationState.velocity.toFixed(1)} m/s</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Mission Time</div>
                <div className="text-lg font-mono text-white">
                  {Math.floor(simulationState.time / 60)}:{Math.floor(simulationState.time % 60).toString().padStart(2, '0')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Fuel Remaining</div>
                <div className="text-lg font-mono text-white">{simulationState.fuel.toFixed(0)} kg</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalPanel;