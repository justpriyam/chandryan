import React, { useEffect, useRef } from 'react';

interface TrajectoryVisualizerProps {
  simulationState: {
    altitude: number;
    velocity: number;
    fuel: number;
    time: number;
    position: { x: number; y: number; z: number };
    trajectory: Array<{ x: number; y: number; z: number; time: number }>;
  };
}

const TrajectoryVisualizer: React.FC<TrajectoryVisualizerProps> = ({ simulationState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Set up the view
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) * 0.4;

      // Draw lunar surface
      const surfaceY = centerY + scale * 0.4;
      const gradient = ctx.createLinearGradient(0, surfaceY - 50, 0, surfaceY + 50);
      gradient.addColorStop(0, '#4a5568');
      gradient.addColorStop(1, '#2d3748');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, surfaceY, width, height - surfaceY);

      // Draw surface texture
      ctx.fillStyle = '#1a202c';
      for (let i = 0; i < width; i += 20) {
        const craterSize = Math.random() * 10 + 5;
        ctx.beginPath();
        ctx.arc(i + Math.random() * 20, surfaceY + Math.random() * 30, craterSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw trajectory path
      if (simulationState.trajectory.length > 1) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        simulationState.trajectory.forEach((point, index) => {
          const x = centerX + point.x * scale * 0.5;
          const y = surfaceY - point.y * scale * 0.002; // Scale altitude
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();

        // Draw trajectory points
        ctx.fillStyle = '#f59e0b';
        simulationState.trajectory.forEach((point) => {
          const x = centerX + point.x * scale * 0.5;
          const y = surfaceY - point.y * scale * 0.002;
          
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Draw current lander position
      const landerX = centerX + simulationState.position.x * scale * 0.5;
      const landerY = surfaceY - simulationState.altitude * scale * 0.002;

      // Lander body
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(landerX - 15, landerY - 15, 30, 20);
      
      // Lander legs
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(landerX - 15, landerY + 5);
      ctx.lineTo(landerX - 25, landerY + 25);
      ctx.moveTo(landerX + 15, landerY + 5);
      ctx.lineTo(landerX + 25, landerY + 25);
      ctx.moveTo(landerX - 5, landerY + 5);
      ctx.lineTo(landerX - 5, landerY + 25);
      ctx.moveTo(landerX + 5, landerY + 5);
      ctx.lineTo(landerX + 5, landerY + 25);
      ctx.stroke();

      // Engine thrust visualization
      if (simulationState.velocity > 0) {
        const thrustIntensity = Math.min(simulationState.velocity / 100, 1);
        ctx.fillStyle = `rgba(255, 69, 0, ${thrustIntensity})`;
        ctx.beginPath();
        ctx.arc(landerX, landerY + 25, 8 * thrustIntensity, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = `rgba(255, 255, 0, ${thrustIntensity * 0.7})`;
        ctx.beginPath();
        ctx.arc(landerX, landerY + 25, 4 * thrustIntensity, 0, Math.PI * 2);
        ctx.fill();
      }

      // Altitude indicator
      ctx.fillStyle = '#60a5fa';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`Altitude: ${simulationState.altitude.toFixed(0)}m`, 20, 30);
      
      // Velocity indicator
      ctx.fillStyle = '#34d399';
      ctx.fillText(`Velocity: ${simulationState.velocity.toFixed(1)}m/s`, 20, 50);

      // Landing site marker
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(centerX, surfaceY - 5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Landing Site', centerX, surfaceY + 25);
      ctx.textAlign = 'left';

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [simulationState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 400;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden border border-slate-700/50">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
      
      {/* Phase indicator */}
      <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2">
        <div className="text-xs text-slate-400">Current Phase</div>
        <div className="text-sm font-semibold text-orange-400">
          {simulationState.altitude > 20000 ? 'Approach' :
           simulationState.altitude > 2000 ? 'Coarse Braking' :
           simulationState.altitude > 150 ? 'Fine Braking' :
           simulationState.altitude > 0 ? 'Terminal Descent' : 'Landed'}
        </div>
      </div>
    </div>
  );
};

export default TrajectoryVisualizer;