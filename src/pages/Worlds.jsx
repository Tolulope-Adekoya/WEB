import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { worldsData, worldStatusColors } from '../data/worldsData';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PlaceholderImage from '../components/PlaceholderImage';

export default function Worlds() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = worldsData.filter(w =>
    w.world.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">The OCJ Universe</p>
        <h1 className="font-heading text-5xl font-bold text-foreground mb-3">Worlds</h1>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4" />
        <p className="text-muted-foreground max-w-xl mx-auto">{worldsData.length} worlds, each with its own lore, lots, and inhabitants.</p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search worlds..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* World grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filtered.map((world, i) => (
          <motion.button
            key={world.sn}
            className="flex flex-col items-center gap-3 group cursor-pointer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => navigate(`/worlds/${encodeURIComponent(world.world)}`)}
          >
            {/* Circular image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                style={{ borderColor: worldStatusColors[world.status] || '#A3B95A',
                  boxShadow: `0 0 0 0 ${worldStatusColors[world.status]}` }}
              >
                <PlaceholderImage className="w-full h-full" alt={world.world} />
              </div>
              {/* Status dot */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background"
                style={{ backgroundColor: worldStatusColors[world.status] || '#666' }}
                title={world.status}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight text-center">
                {world.world}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5" style={{ color: worldStatusColors[world.status] }}>
                {world.status}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
        {Object.entries(worldStatusColors).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}