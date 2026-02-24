import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

/**
 * Visualisation constellation : simulation de réseau de connexions
 * Utilise Canvas 2D avec simulation de force simplifiée
 */

const ARCHETYPES_COLORS = {
  'Spirituel engagé': '#8b5cf6',
  'Économiste alternatif': '#10b981',
  'Écolo pratique': '#84cc16',
  'Créateur de lien social': '#f59e0b',
  'Explorateur holistique': '#6366f1',
};

function generateSimulatedNetwork(count = 40) {
  const archetypes = Object.keys(ARCHETYPES_COLORS);
  const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Nantes', 'Rennes', 'Grenoble'];

  const nodes = Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Étoile ${i + 1}`,
    archetype: archetypes[Math.floor(Math.random() * archetypes.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    x: Math.random() * 700 + 50,
    y: Math.random() * 500 + 50,
    vx: 0,
    vy: 0,
    values: Array.from({ length: 3 + Math.floor(Math.random() * 5) }, () => Math.floor(Math.random() * 20) + 1),
  }));

  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const shared = nodes[i].values.filter(v => nodes[j].values.includes(v)).length;
      if (shared >= 2) {
        edges.push({ source: i, target: j, strength: shared });
      }
    }
  }

  return { nodes, edges };
}

export default function NetworkMap() {
  const canvasRef = useRef(null);
  const [network, setNetwork] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [hovered, setHovered] = useState(null);
  const animRef = useRef(null);
  const networkRef = useRef(null);

  const init = () => {
    const net = generateSimulatedNetwork(50);
    networkRef.current = net;
    setNetwork(net);
  };

  useEffect(() => { init(); }, []);

  useEffect(() => {
    if (!network || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const nodes = networkRef.current.nodes;
    const edges = networkRef.current.edges;

    // Simulation de force simplifiée
    function tick() {
      // Répulsion entre noeuds
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 800 / (dist * dist);
          nodes[i].vx -= (dx / dist) * force;
          nodes[i].vy -= (dy / dist) * force;
          nodes[j].vx += (dx / dist) * force;
          nodes[j].vy += (dy / dist) * force;
        }
      }

      // Attraction sur les arêtes
      for (const edge of edges) {
        const a = nodes[edge.source];
        const b = nodes[edge.target];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 120) * 0.002 * edge.strength;
        a.vx += (dx / dist) * force;
        a.vy += (dy / dist) * force;
        b.vx -= (dx / dist) * force;
        b.vy -= (dy / dist) * force;
      }

      // Centrage + amortissement + limites
      for (const n of nodes) {
        n.vx += (W / 2 - n.x) * 0.001;
        n.vy += (H / 2 - n.y) * 0.001;
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x = Math.max(20, Math.min(W - 20, n.x + n.vx));
        n.y = Math.max(20, Math.min(H - 20, n.y + n.vy));
      }

      // Dessin
      ctx.clearRect(0, 0, W, H);

      // Fond étoilé
      ctx.fillStyle = '#f5f3ff';
      ctx.fillRect(0, 0, W, H);

      // Arêtes
      for (const edge of edges) {
        const a = nodes[edge.source];
        const b = nodes[edge.target];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${Math.min(0.4, edge.strength * 0.1)})`;
        ctx.lineWidth = edge.strength * 0.3;
        ctx.stroke();
      }

      // Noeuds
      for (const node of nodes) {
        const color = ARCHETYPES_COLORS[node.archetype] || '#8b5cf6';
        const r = 6 + node.values.length * 0.8;

        // Halo
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2.5);
        grad.addColorStop(0, color + '40');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Point
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [network]);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Map className="text-dream-500" size={24} />
          <div>
            <h1 className="section-title mb-0">Constellation</h1>
            <p className="text-dream-500 text-sm">Visualisation du réseau de résonances (simulation)</p>
          </div>
        </div>
        <button onClick={init} className="btn-ghost flex items-center gap-2 text-sm">
          <RefreshCw size={16} /> Régénérer
        </button>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(ARCHETYPES_COLORS).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5 text-xs text-dream-600">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card overflow-hidden"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={550}
          className="w-full"
        />
      </motion.div>

      <p className="text-dream-400 text-xs text-center mt-3">
        Chaque étoile est un bâtisseur. Les connexions représentent les valeurs partagées.
        La taille reflète le nombre de valeurs de chaque membre.
      </p>
    </div>
  );
}
