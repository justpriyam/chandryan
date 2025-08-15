export const MISSION_PARAMETERS = {
  // Lander specifications
  mass: 1749.86, // kg (including Pragyan rover)
  dimensions: {
    length: 2.0, // m
    width: 2.0, // m
    height: 1.166 // m
  },
  powerCapability: 738, // W

  // Landing site coordinates
  landingSite: {
    latitude: -69.367621, // degrees South
    longitude: 32.348126 // degrees East
  },

  // Descent profile
  initialAltitude: 25000, // m
  initialVelocity: 1680, // m/s
  descentDuration: 720, // seconds (12 minutes)
  finalHoverAltitude: 150, // m

  // Propulsion system
  thrustMax: 25000, // N (estimated maximum thrust)
  fuelCapacity: 1000, // kg (estimated fuel capacity)
  
  // Mission timeline
  missionPhases: [
    { name: 'Approach', altitudeRange: [25000, 20000] },
    { name: 'Coarse Braking', altitudeRange: [20000, 2000] },
    { name: 'Fine Braking', altitudeRange: [2000, 150] },
    { name: 'Terminal Descent', altitudeRange: [150, 0] }
  ]
};

export const PHYSICS_CONSTANTS = {
  lunarGravity: 1.62, // m/s² (Moon's surface gravity)
  earthGravity: 9.81, // m/s² (for comparison)
  specificImpulse: 300, // s (estimated for hypergolic propellants)
  
  // Atmospheric conditions (Moon has no atmosphere)
  atmosphericDensity: 0, // kg/m³
  dragCoefficient: 0 // No atmospheric drag
};

export const SENSOR_SPECIFICATIONS = {
  altimeter: {
    accuracy: 1, // m
    updateRate: 10, // Hz
    range: [0, 30000] // m
  },
  velocimeter: {
    accuracy: 0.1, // m/s
    updateRate: 10, // Hz
    range: [0, 2000] // m/s
  },
  accelerometer: {
    accuracy: 0.01, // m/s²
    updateRate: 100, // Hz
    range: [-50, 50] // m/s²
  }
};

export const EDUCATIONAL_CONTENT = {
  phases: {
    approach: {
      title: "Approach Phase",
      description: "Initial powered descent from lunar orbit",
      keyPhysics: [
        "Orbital mechanics transition to powered flight",
        "Gravity turn maneuver initiation",
        "Initial velocity vector adjustment"
      ],
      equations: [
        "v² = v₀² + 2aΔh (kinematic equation for constant acceleration)",
        "F = GMm/r² (gravitational force)"
      ]
    },
    coarseBraking: {
      title: "Coarse Braking Phase",
      description: "Primary velocity reduction using maximum thrust",
      keyPhysics: [
        "Maximum thrust application",
        "Rapid deceleration management",
        "Fuel consumption optimization"
      ],
      equations: [
        "Δv = vₑ ln(m₀/mf) (Tsiolkovsky rocket equation)",
        "F = ma (Newton's second law)"
      ]
    },
    fineBraking: {
      title: "Fine Braking Phase", 
      description: "Precision control and hazard avoidance",
      keyPhysics: [
        "Variable thrust control",
        "Navigation and guidance systems",
        "Hazard detection and avoidance"
      ],
      equations: [
        "a = (F_thrust - mg)/m (net acceleration)",
        "Δx = v₀t + ½at² (displacement with acceleration)"
      ]
    },
    terminalDescent: {
      title: "Terminal Descent",
      description: "Final approach and soft landing",
      keyPhysics: [
        "Constant velocity descent",
        "Landing leg deployment",
        "Surface interaction dynamics"
      ],
      equations: [
        "v = constant (terminal velocity)",
        "F_thrust = mg (hovering condition)"
      ]
    }
  }
};