import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, BookOpen } from 'lucide-react';
import TrajectoryVisualizer from './components/TrajectoryVisualizer';
import TelemetryDashboard from './components/TelemetryDashboard';
import ControlPanel from './components/ControlPanel';
import ParameterPanel from './components/ParameterPanel';
import EducationalPanel from './components/EducationalPanel';
import { useSimulation } from './hooks/useSimulation';
import { MISSION_PARAMETERS } from './constants/missionData';

function App() {
  const [showParameters, setShowParameters] = useState(false);
  const [showEducational, setShowEducational] = useState(false);
  
  const {
    simulationState,
    isRunning,
    currentPhase,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    updateParameters
  } = useSimulation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Chandrayaan-3 Visualizer
                </h1>
                <p className="text-slate-400 text-sm">Vikram Lander Descent Simulation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEducational(!showEducational)}
                className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 transition-all duration-200"
              >
                <BookOpen className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowParameters(!showParameters)}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 transition-all duration-200"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Main Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/30 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Descent Trajectory</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Landing Site: 69.37°S, 32.35°E | Current Phase: {currentPhase}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={isRunning ? pauseSimulation : startSimulation}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      isRunning 
                        ? 'bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30' 
                        : 'bg-green-600/20 hover:bg-green-600/30 border border-green-500/30'
                    }`}
                  >
                    {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="p-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 transition-all duration-200"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <TrajectoryVisualizer simulationState={simulationState} />
            </div>

            <ControlPanel
              simulationState={simulationState}
              isRunning={isRunning}
              onStart={startSimulation}
              onPause={pauseSimulation}
              onReset={resetSimulation}
            />
          </div>

          {/* Telemetry Panel */}
          <div className="space-y-6">
            <TelemetryDashboard simulationState={simulationState} />
          </div>
        </div>
      </div>

      {/* Parameter Panel */}
      {showParameters && (
        <ParameterPanel
          parameters={MISSION_PARAMETERS}
          onClose={() => setShowParameters(false)}
          onUpdateParameters={updateParameters}
        />
      )}

      {/* Educational Panel */}
      {showEducational && (
        <EducationalPanel
          currentPhase={currentPhase}
          simulationState={simulationState}
          onClose={() => setShowEducational(false)}
        />
      )}
    </div>
  );
}

export default App;