import { useState, useEffect, useRef, useCallback } from 'react';
import { MISSION_PARAMETERS, PHYSICS_CONSTANTS } from '../constants/missionData';

interface SimulationState {
  altitude: number;
  velocity: number;
  fuel: number;
  time: number;
  acceleration: number;
  thrust: number;
  position: { x: number; y: number; z: number };
  trajectory: Array<{ x: number; y: number; z: number; time: number }>;
}

export const useSimulation = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    altitude: MISSION_PARAMETERS.initialAltitude,
    velocity: MISSION_PARAMETERS.initialVelocity,
    fuel: MISSION_PARAMETERS.fuelCapacity,
    time: 0,
    acceleration: 0,
    thrust: 0,
    position: { x: 0, y: MISSION_PARAMETERS.initialAltitude, z: 0 },
    trajectory: []
  });

  const [isRunning, setIsRunning] = useState(false);
  const [parameters, setParameters] = useState(MISSION_PARAMETERS);
  const intervalRef = useRef<NodeJS.Timeout>();

  const getCurrentPhase = useCallback(() => {
    if (simulationState.altitude > 20000) return 'Approach';
    if (simulationState.altitude > 2000) return 'Coarse Braking';
    if (simulationState.altitude > 150) return 'Fine Braking';
    if (simulationState.altitude > 0) return 'Terminal Descent';
    return 'Landed';
  }, [simulationState.altitude]);

  const calculateThrust = useCallback((altitude: number, velocity: number, fuel: number) => {
    // Thrust profile based on descent phase
    if (altitude > 20000) {
      // Approach phase - moderate thrust
      return Math.min(15000, parameters.thrustMax * 0.6);
    } else if (altitude > 2000) {
      // Coarse braking - maximum thrust
      return parameters.thrustMax;
    } else if (altitude > 150) {
      // Fine braking - variable thrust
      const thrustRatio = Math.min(1, velocity / 100);
      return parameters.thrustMax * thrustRatio * 0.8;
    } else {
      // Terminal descent - minimal thrust for soft landing
      return Math.min(8000, parameters.mass * PHYSICS_CONSTANTS.lunarGravity * 1.2);
    }
  }, [parameters]);

  const updateSimulation = useCallback(() => {
    setSimulationState(prev => {
      if (prev.altitude <= 0 || prev.fuel <= 0) {
        return prev; // Stop simulation if landed or out of fuel
      }

      const dt = 0.1; // Time step in seconds
      const currentThrust = calculateThrust(prev.altitude, prev.velocity, prev.fuel);
      
      // Calculate acceleration using F = ma
      const thrustAcceleration = currentThrust / parameters.mass;
      const gravityAcceleration = PHYSICS_CONSTANTS.lunarGravity;
      const netAcceleration = thrustAcceleration - gravityAcceleration;

      // Update velocity and position using kinematic equations
      const newVelocity = Math.max(0, prev.velocity - netAcceleration * dt);
      const newAltitude = Math.max(0, prev.altitude - newVelocity * dt);
      
      // Calculate fuel consumption (simplified)
      const fuelConsumptionRate = currentThrust / (PHYSICS_CONSTANTS.specificImpulse * PHYSICS_CONSTANTS.lunarGravity);
      const newFuel = Math.max(0, prev.fuel - fuelConsumptionRate * dt);

      const newPosition = {
        x: prev.position.x,
        y: newAltitude,
        z: prev.position.z
      };

      // Update trajectory (keep last 100 points for performance)
      const newTrajectory = [...prev.trajectory, { ...newPosition, time: prev.time + dt }];
      if (newTrajectory.length > 100) {
        newTrajectory.shift();
      }

      return {
        altitude: newAltitude,
        velocity: newVelocity,
        fuel: newFuel,
        time: prev.time + dt,
        acceleration: netAcceleration,
        thrust: currentThrust,
        position: newPosition,
        trajectory: newTrajectory
      };
    });
  }, [calculateThrust, parameters]);

  const startSimulation = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(updateSimulation, 100);
    }
  }, [isRunning, updateSimulation]);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setSimulationState({
      altitude: parameters.initialAltitude,
      velocity: parameters.initialVelocity,
      fuel: parameters.fuelCapacity,
      time: 0,
      acceleration: 0,
      thrust: 0,
      position: { x: 0, y: parameters.initialAltitude, z: 0 },
      trajectory: []
    });
  }, [parameters]);

  const updateParameters = useCallback((newParams: typeof MISSION_PARAMETERS) => {
    setParameters(newParams);
    resetSimulation();
  }, [resetSimulation]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    simulationState,
    isRunning,
    currentPhase: getCurrentPhase(),
    startSimulation,
    pauseSimulation,
    resetSimulation,
    updateParameters
  };
};