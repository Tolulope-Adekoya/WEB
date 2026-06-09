import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, RotateCcw, X, ChevronDown } from 'lucide-react';
import { relationshipNodes, relationshipEdges, relationshipTypes } from '../data/relationshipsData';
import { simsData } from '../data/simsData';
import { getOccultAccent } from '../components/OccultFrame';

const NODE_RADIUS = 32;
const PET_R = 10;
const CANVAS_W = 2000;
const CANVAS_H = 1400;
const SPRING_K = 0.006;
const DAMPING = 0.82;
const REPULSION = 4000;
const LINK_DIST = 180;

const petEmoji = (pet) => {
  const p = pet.toLowerCase();
  if (p.includes('cat')) return '🐱';
  if (p.includes('dog')) return '🐕';
  if (p.includes('horse')) return '🐴';
  if (p.includes('bird') || p.includes('toucan') || p.includes('lovebird')) return '🐦';
  if (p.includes('iguana') || p.includes('chameleon') || p.includes('lizard')) return '🦎';
  if (p.includes('tortoise') || p.includes('turtle')) return '🐢';
  if (p.includes('sugar glider')) return '🐿️';
  if (p.includes('rabbit')) return '🐰';
  return '🐾';
};

function matchSim(nodeName) {
  return simsData.find(s => s.name.toLowerCase().includes(nodeName.toLowerCase().split(' ')[0])) || null;
}

function initPositions(nodes) {
  const placed = {};
  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI;
    const r = 350 + Math.random() * 200;
    placed[node.id] = {
      x: CANVAS_W / 2 + r * Math.cos(angle),
      y: CANVAS_H / 2 + r * Math.sin(angle),
      vx: 0,
      vy: 0,
    };
  });
  return placed;
}

export default function Relations() {
  const [positions, setPositions] = useState(() => initPositions(relationshipNodes));
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null); // { simName, pet }
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.7);
  const svgRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(positions);
  posRef.current = positions;

  // Force-directed simulation
  useEffect(() => {
    let running = true;
    const step = () => {
      if (!running) return;
      setPositions(prev => {
        const next = { ...prev };
        const nodeList = relationshipNodes;
        // Repulsion between all pairs
        for (let i = 0; i < nodeList.length; i++) {
          for (let j = i + 1; j < nodeList.length; j++) {
            const a = next[nodeList[i].id];
            const b = next[nodeList[j].id];
            if (!a || !b) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = REPULSION / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            next[nodeList[i].id] = { ...a, vx: (a.vx - fx) * DAMPING, vy: (a.vy - fy) * DAMPING };
            next[nodeList[j].id] = { ...b, vx: (b.vx + fx) * DAMPING, vy: (b.vy + fy) * DAMPING };
          }
        }
        // Spring attraction along edges
        relationshipEdges.forEach(edge => {
          const a = next[edge.source];
          const b = next[edge.target];
          if (!a || !b) return;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const displacement = dist - LINK_DIST;
          const fx = (dx / dist) * displacement * SPRING_K;
          const fy = (dy / dist) * displacement * SPRING_K;
          next[edge.source] = { ...a, vx: (a.vx + fx) * DAMPING, vy: (a.vy + fy) * DAMPING };
          next[edge.target] = { ...b, vx: (b.vx - fx) * DAMPING, vy: (b.vy - fy) * DAMPING };
        });
        // Apply velocities (skip dragged node)
        nodeList.forEach(node => {
          if (dragging === node.id) return;
          const n = next[node.id];
          if (!n) return;
          next[node.id] = {
            ...n,
            x: Math.max(NODE_RADIUS, Math.min(CANVAS_W - NODE_RADIUS, n.x + n.vx)),
            y: Math.max(NODE_RADIUS, Math.min(CANVAS_H - NODE_RADIUS, n.y + n.vy)),
          };
        });
        return next;
      });
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [dragging]);

  // Center on search result
  useEffect(() => {
    if (!search) return;
    const node = relationshipNodes.find(n => n.name.toLowerCase().includes(search.toLowerCase()));
    if (!node) return;
    const pos = posRef.current[node.id];
    if (!pos) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPan({
      x: rect.width / 2 / zoom - pos.x,
      y: rect.height / 2 / zoom - pos.y,
    });
  }, [search, zoom]);

  const filteredEdges = filterType
    ? relationshipEdges.filter(e => e.type === filterType)
    : relationshipEdges;

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(0.7);
    setSelectedNode(null);
    setSelectedEdge(null);
    setSearch('');
    setPositions(initPositions(relationshipNodes));
  };

  // Determine which nodes/edges are "active" when a node is selected
  const connectedNodeIds = selectedNode
    ? new Set([
        selectedNode,
        ...filteredEdges.filter(e => e.source === selectedNode || e.target === selectedNode)
          .flatMap(e => [e.source, e.target])
      ])
    : null;

  const onNodeMouseDown = (e, id) => {
    e.stopPropagation();
    const rect = svgRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / zoom - pan.x;
    const my = (e.clientY - rect.top) / zoom - pan.y;
    setDragging(id);
    setDragOffset({ x: mx - positions[id].x, y: my - positions[id].y });
  };

  const onNodeClick = (e, id) => {
    e.stopPropagation();
    setSelectedNode(prev => prev === id ? null : id);
    setSelectedEdge(null);
    setSelectedPet(null);
  };

  const onMouseMove = useCallback((e) => {
    if (dragging) {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = (e.clientX - rect.left) / zoom - pan.x;
      const my = (e.clientY - rect.top) / zoom - pan.y;
      setPositions(prev => ({
        ...prev,
        [dragging]: {
          ...prev[dragging],
          x: Math.max(NODE_RADIUS, Math.min(CANVAS_W - NODE_RADIUS, mx - dragOffset.x)),
          y: Math.max(NODE_RADIUS, Math.min(CANVAS_H - NODE_RADIUS, my - dragOffset.y)),
          vx: 0, vy: 0,
        }
      }));
    } else if (panning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan(prev => ({ x: prev.x + dx / zoom, y: prev.y + dy / zoom }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [dragging, dragOffset, panning, panStart, zoom]);

  const onMouseUp = () => { setDragging(null); setPanning(false); };

  const onSvgMouseDown = (e) => {
    if (e.target === svgRef.current || e.target.tagName === 'svg' || e.target.tagName === 'g') {
      setPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  };

  const onWheel = (e) => {
    e.preventDefault();
    setZoom(z => Math.max(0.2, Math.min(3, z - e.deltaY * 0.001)));
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove]);

  const edgeColor = (type) => relationshipTypes[type]?.color || '#999';

  const searchHighlight = search
    ? relationshipNodes.find(n => n.name.toLowerCase().includes(search.toLowerCase()))?.id
    : null;

  return (
    <div className="min-h-screen pt-20 pb-8 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <div className="text-center mb-6">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">Social Fabric</p>
          <h1 className="font-heading text-5xl font-bold text-foreground mb-2">Relations</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-3" />
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Drag nodes to rearrange. Click a sim to see their connections. Click an edge for lore. Scroll to zoom.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find & centre sim..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary w-52"
            />
          </div>
          <div className="relative">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="py-2 px-3 pr-8 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:border-primary appearance-none w-48"
            >
              <option value="">All Relationships</option>
              {Object.entries(relationshipTypes).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          <button onClick={resetView} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Graph */}
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden" style={{ height: '68vh', minHeight: 420 }}>
          <svg
            ref={svgRef}
            className="w-full h-full select-none"
            style={{ cursor: panning ? 'grabbing' : 'grab' }}
            onMouseDown={onSvgMouseDown}
            onWheel={onWheel}
          >
            <defs>
              {/* Clip for circular portraits */}
              {relationshipNodes.map(n => (
                <clipPath key={n.id} id={`clip-${n.id}`}>
                  <circle r={NODE_RADIUS - 2} />
                </clipPath>
              ))}
            </defs>
            <g transform={`translate(${pan.x * zoom},${pan.y * zoom}) scale(${zoom})`}>
              {/* Edges */}
              {filteredEdges.map((edge, i) => {
                const sp = positions[edge.source];
                const tp = positions[edge.target];
                if (!sp || !tp) return null;
                const color = edgeColor(edge.type);
                const isSelected = selectedEdge === i;
                const isActive = !connectedNodeIds ||
                  (connectedNodeIds.has(edge.source) && connectedNodeIds.has(edge.target));
                return (
                  <line
                    key={i}
                    x1={sp.x} y1={sp.y}
                    x2={tp.x} y2={tp.y}
                    stroke={color}
                    strokeWidth={isSelected ? 3 : 1.8}
                    strokeOpacity={isActive ? (isSelected ? 1 : 0.55) : 0.06}
                    className="cursor-pointer"
                    onClick={e => { e.stopPropagation(); setSelectedEdge(isSelected ? null : i); setSelectedNode(null); }}
                    style={{ filter: isSelected ? `drop-shadow(0 0 5px ${color})` : 'none', transition: 'stroke-opacity 0.25s' }}
                  />
                );
              })}

              {/* Nodes */}
              {relationshipNodes.map(node => {
                const pos = positions[node.id];
                if (!pos) return null;
                const sim = matchSim(node.name);
                const pets = sim?.pets ? sim.pets.split(',').map(p => p.trim()).filter(Boolean) : [];
                const accent = getOccultAccent(sim?.occult);
                const isSelected = selectedNode === node.id;
                const isHighlight = searchHighlight === node.id;
                const isFocused = !connectedNodeIds || connectedNodeIds.has(node.id);
                const opacity = isFocused ? 1 : 0.15;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x},${pos.y})`}
                    style={{ cursor: 'grab', opacity, transition: 'opacity 0.25s' }}
                    onMouseDown={e => onNodeMouseDown(e, node.id)}
                    onClick={e => onNodeClick(e, node.id)}
                  >
                    {/* Glow ring */}
                    {(isSelected || isHighlight) && (
                      <circle
                        r={NODE_RADIUS + 8}
                        fill={isHighlight ? '#A3B95A' : '#C0572A'}
                        fillOpacity="0.2"
                        style={{ filter: `blur(4px)` }}
                      />
                    )}

                    {/* Profile circle */}
                    <circle
                      r={NODE_RADIUS}
                      fill="hsl(var(--muted))"
                      stroke={isSelected ? '#C0572A' : isHighlight ? '#A3B95A' : accent}
                      strokeWidth={isSelected || isHighlight ? 2.5 : 1.2}
                    />
                    {/* Checkered placeholder fill */}
                    <circle r={NODE_RADIUS - 1} fill="#888" fillOpacity="0.18" clipPath={`url(#clip-${node.id})`} />
                    <text fontSize="20" textAnchor="middle" dominantBaseline="middle" fill="hsl(var(--muted-foreground))" style={{ pointerEvents: 'none' }}>👤</text>

                    {/* Pet stickers — small circles just outside top-right of profile */}
                    {pets.slice(0, 3).map((pet, pi) => {
                      const angle = -Math.PI / 4 + pi * (Math.PI / 8);
                      const px = (NODE_RADIUS + 2) * Math.cos(angle);
                      const py = (NODE_RADIUS + 2) * Math.sin(angle);
                      return (
                        <g
                          key={pi}
                          transform={`translate(${px},${py})`}
                          style={{ cursor: 'pointer' }}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedPet({ simName: node.name, pet, sim });
                          }}
                        >
                          <circle r={PET_R} fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
                          <text fontSize="11" textAnchor="middle" dominantBaseline="middle" style={{ pointerEvents: 'none' }}>
                            {petEmoji(pet)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Name */}
                    <text y={NODE_RADIUS + 13} fontSize="9.5" textAnchor="middle" fill="hsl(var(--foreground))" fontFamily="Inter,sans-serif" fontWeight="500" style={{ pointerEvents: 'none' }}>
                      {node.name.split(' ')[0]}
                    </text>
                    <text y={NODE_RADIUS + 24} fontSize="8" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontFamily="Inter,sans-serif" style={{ pointerEvents: 'none' }}>
                      {node.name.split(' ').slice(1).join(' ')}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Edge popup */}
          <AnimatePresence>
            {selectedEdge !== null && filteredEdges[selectedEdge] && (
              <motion.div
                className="absolute top-4 right-4 bg-card border border-border rounded-2xl p-4 max-w-xs shadow-2xl z-10"
                initial={{ opacity: 0, scale: 0.9, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -8 }}
              >
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setSelectedEdge(null)}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: edgeColor(filteredEdges[selectedEdge].type) }} />
                  <span className="text-xs font-semibold text-foreground capitalize">
                    {relationshipTypes[filteredEdges[selectedEdge].type]?.label}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground mb-1 capitalize">
                  {filteredEdges[selectedEdge].source.replace(/_/g, ' ')} ↔ {filteredEdges[selectedEdge].target.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-muted-foreground leading-5">{filteredEdges[selectedEdge].note}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pet focus popup */}
          <AnimatePresence>
            {selectedPet && (
              <motion.div
                className="absolute bottom-4 left-4 bg-card border border-border rounded-2xl p-4 w-56 shadow-2xl z-10"
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
              >
                <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted" onClick={() => setSelectedPet(null)}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full placeholder-img border border-border flex items-center justify-center text-2xl bg-muted">
                    {petEmoji(selectedPet.pet)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground capitalize">{selectedPet.pet}</p>
                    <p className="text-[10px] text-muted-foreground">owned by</p>
                    <p className="text-xs text-primary">{selectedPet.simName}</p>
                  </div>
                </div>
                {selectedPet.sim?.petNotes && (
                  <p className="text-xs text-muted-foreground mt-1">{selectedPet.sim.petNotes}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center">
          {Object.entries(relationshipTypes).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-6 h-0.5 rounded" style={{ backgroundColor: val.color }} />
              <span>{val.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}