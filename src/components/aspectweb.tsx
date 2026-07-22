import { useEffect, useRef, useState } from 'react';
import { DrawnCard, NatalUser, buildAspectWeb, AspectNode } from '../types';

interface AspectWebProps {
  drawnCards: DrawnCard[];
  user: NatalUser;
}

interface SimNode {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'card' | 'sign' | 'planet' | 'sin';
  label: string;
  glyph: string;
  color: string;
}

export default function AspectWeb({ drawnCards, user }: AspectWebProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const nodesRef = useRef<SimNode[]>([]);
  const connectionsRef = useRef<[number, number][]>([]);
  const animRef = useRef<number>(0);
  const pointerRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (drawnCards.length === 0) return;

    const aspectNodes = buildAspectWeb(drawnCards, user);
    
    // Initialize simulation nodes
    const nodes: SimNode[] = aspectNodes.map((n, i) => ({
      id: n.id,
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
      vx: 0,
      vy: 0,
      radius: n.type === 'card' ? 18 : n.type === 'sin' ? 14 : 10,
      type: n.type,
      label: n.label,
      glyph: n.glyph,
      color: n.color,
    }));

    // Build connections
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const connPairs: [number, number][] = [];
    aspectNodes.forEach(n => {
      const a = nodes.findIndex(sn => sn.id === n.id);
      n.connections.forEach(targetId => {
        const b = nodes.findIndex(sn => sn.id === targetId);
        if (a !== -1 && b !== -1 && a < b) {
          connPairs.push([a, b]);
        }
      });
    });

    nodesRef.current = nodes;
    connectionsRef.current = connPairs;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const animate = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Simulation step
      const simNodes = nodesRef.current;
      const simConns = connectionsRef.current;

      // Repulsion between nodes
      for (let i = 0; i < simNodes.length; i++) {
        for (let j = i + 1; j < simNodes.length; j++) {
          const dx = simNodes[j].x - simNodes[i].x;
          const dy = simNodes[j].y - simNodes[i].y;
          const dist = Math.max(Math.hypot(dx, dy), 1);
          const force = 250 / (dist * dist);
          const fx = dx * force;
          const fy = dy * force;
          simNodes[i].vx -= fx * 0.01;
          simNodes[i].vy -= fy * 0.01;
          simNodes[j].vx += fx * 0.01;
          simNodes[j].vy += fy * 0.01;
        }
      }

      // Attraction along connections
      for (const [a, b] of simConns) {
        const dx = simNodes[b].x - simNodes[a].x;
        const dy = simNodes[b].y - simNodes[a].y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          const force = (dist - 80) * 0.001;
          const fx = dx * force;
          const fy = dy * force;
          simNodes[a].vx += fx;
          simNodes[a].vy += fy;
          simNodes[b].vx -= fx;
          simNodes[b].vy -= fy;
        }
      }

      // Center gravity
      for (const n of simNodes) {
        n.vx -= n.x * 0.001;
        n.vy -= n.y * 0.001;
        n.vx *= 0.92;
        n.vy *= 0.92;
        n.x += n.vx;
        n.y += n.vy;
      }

      // Pointer attraction
      const px = pointerRef.current.x - cx;
      const py = pointerRef.current.y - cy;
      for (const n of simNodes) {
        const dx = px - n.x;
        const dy = py - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.08;
          n.vx += dx * force;
          n.vy += dy * force;
        }
      }

      // Draw
      ctx.clearRect(0, 0, w, h);

      // Connections
      for (const [a, b] of simConns) {
        const na = simNodes[a];
        const nb = simNodes[b];
        const ax = cx + na.x;
        const ay = cy + na.y;
        const bx = cx + nb.x;
        const by = cy + nb.y;
        
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = 'rgba(200, 164, 90, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Hover detection
      let closestNode: SimNode | null = null;
      let closestDist = Infinity;

      // Nodes
      for (const n of simNodes) {
        const nx = cx + n.x;
        const ny = cy + n.y;
        const pulse = 1 + Math.sin(time * 2 + n.x * 0.1) * 0.15;
        const r = n.radius * pulse;

        // Check hover
        const hdx = px - n.x;
        const hdy = py - n.y;
        const hdist = Math.hypot(hdx, hdy);
        if (hdist < r + 8 && hdist < closestDist) {
          closestDist = hdist;
          closestNode = n;
        }

        const isHovered = hoveredNode?.id === n.id;
        const alpha = isHovered ? 0.9 : 0.5;

        // Glow
        ctx.beginPath();
        ctx.arc(nx, ny, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 164, 90, ${alpha * 0.08})`;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(nx, ny, r, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.7)';
        ctx.fill();
        ctx.strokeStyle = isHovered ? `rgba(200, 164, 90, ${alpha})` : `rgba(255,255,255,${alpha * 0.4})`;
        ctx.lineWidth = isHovered ? 1.5 : 0.5;
        ctx.stroke();

        // Glyph
        ctx.fillStyle = isHovered ? n.color : `rgba(255,255,255,${alpha * 0.7})`;
        ctx.font = `${n.type === 'card' ? 13 : n.type === 'sin' ? 10 : 8}px "Cormorant Garamond", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.glyph, nx, ny);

        // Label if hovered
        if (isHovered) {
          ctx.fillStyle = 'rgba(200, 164, 90, 0.9)';
          ctx.font = '7px "JetBrains Mono", monospace';
          ctx.fillText(n.label.toUpperCase(), nx, ny + r + 12);
        }
      }

      setHoveredNode(closestNode);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [drawnCards, user]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
    }
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = -100;
    pointerRef.current.y = -100;
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />
      <div className="absolute top-2 left-2 text-[6px] text-white/15 font-mono tracking-[0.2em] uppercase pointer-events-none">
        ◆ ASPECT WEB — {drawnCards.length} CARDS ◆
      </div>
      {hoveredNode && (
        <div 
          className="absolute pointer-events-none text-center"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="font-mono text-[8px] text-[var(--gold)] tracking-[0.15em] uppercase">
            {hoveredNode.label}
          </div>
        </div>
      )}
    </div>
  );
}
