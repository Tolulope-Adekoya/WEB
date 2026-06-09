import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { simsData } from '../data/simsData';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import PlaceholderImage from '../components/PlaceholderImage';
import PetBadges from '../components/PetBadges';
import { getOccultClass, getOccultAccent, getOccultIcon } from '../components/OccultFrame';

const filterFields = [
  { key: 'ageGroup', label: 'Age Group' },
  { key: 'gender', label: 'Gender' },
  { key: 'occult', label: 'Occult' },
  { key: 'ethnicity', label: 'Ethnicity' },
  { key: 'playableSim', label: 'Playable Sim' },
  { key: 'status', label: 'Status' },
  { key: 'familyStatus', label: 'Family' },
  { key: 'individualWealthClass', label: 'Wealth Class' },
  { key: 'fameLevel', label: 'Fame Level' },
  { key: 'faith', label: 'Faith' },
  { key: 'addiction', label: 'Addiction' },
  { key: 'alignment', label: 'Alignment' },
  { key: 'orientation', label: 'Orientation' },
  { key: 'powerSource', label: 'Power Source' },
  { key: 'politicalAlignment', label: 'Political Alignment' },
  { key: 'occultGroup', label: 'Occult Group' },
  { key: 'sugar', label: 'Sugar' },
  { key: 'dos', label: 'DOS' },
];

function getUniqueValues(data, field) {
  const vals = new Set();
  data.forEach(s => {
    if (s[field]) {
      String(s[field]).split(',').forEach(v => {
        const t = v.trim();
        if (t) vals.add(t);
      });
    }
  });
  return Array.from(vals).sort();
}

function SimCard({ sim, onClick }) {
  const occultClass = getOccultClass(sim.occult);
  const accent = getOccultAccent(sim.occult);
  const icon = getOccultIcon(sim.occult);

  return (
    <motion.div
      className="relative cursor-pointer group"
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onClick(sim)}
    >
      <div
        className={`rounded-2xl border bg-card overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-0.5 ${occultClass}`}
        style={{ background: `linear-gradient(135deg, hsl(var(--card)) 0%, ${accent}08 100%)` }}
      >
        {/* Portrait */}
        <div className="relative h-36 overflow-hidden">
          <PlaceholderImage className="w-full h-full" alt={sim.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          {/* Occult icon badge */}
          <div
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm bg-background/70 border border-border"
            title={sim.occult}
          >
            {icon}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-heading font-semibold text-foreground text-sm leading-tight group-hover:text-primary transition-colors truncate">
            {sim.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-muted-foreground">{sim.ageGroup}</span>
            <span className="text-[10px] text-muted-foreground">·</span>
            <span className="text-[10px] text-muted-foreground">{sim.gender}</span>
            {sim.occult && sim.occult !== 'Human' && (
              <>
                <span className="text-[10px] text-muted-foreground">·</span>
                <span className="text-[10px] font-medium" style={{ color: accent }}>{sim.occult}</span>
              </>
            )}
          </div>
          {/* Pet badges */}
          {sim.pets && (
              <div className="mt-2">
                <PetBadges pets={sim.pets} simName={sim.name} simNotes={sim.petNotes} size="md" max={4} />
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Sims() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);

  const sorted = useMemo(() =>
    [...simsData].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const filtered = useMemo(() => {
    return sorted.filter(sim => {
      const nameMatch = !search || sim.name.toLowerCase().includes(search.toLowerCase());
      const filterMatch = Object.entries(filters).every(([key, val]) => {
        if (!val) return true;
        const simVal = String(sim[key] || '').toLowerCase();
        return simVal.includes(val.toLowerCase());
      });
      return nameMatch && filterMatch;
    });
  }, [sorted, search, filters]);

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val || undefined }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="text-center mb-8">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">The People</p>
          <h1 className="font-heading text-5xl font-bold text-foreground mb-3">Sims</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-2" />
          <p className="text-muted-foreground">{simsData.length} sims · Showing {filtered.length}</p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${filterOpen || activeFilterCount > 0 ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm">Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              className="mt-4 max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Filters</h3>
                <button
                  onClick={() => { setFilters({}); }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filterFields.map(field => {
                  const options = getUniqueValues(sorted, field.key);
                  if (options.length === 0) return null;
                  return (
                    <div key={field.key}>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">{field.label}</label>
                      <div className="relative">
                        <select
                          value={filters[field.key] || ''}
                          onChange={e => handleFilterChange(field.key, e.target.value)}
                          className="w-full text-xs py-1.5 px-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary appearance-none pr-6"
                        >
                          <option value="">All</option>
                          {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sim grid */}
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(sim => (
              <SimCard
                key={sim.name}
                sim={sim}
                onClick={() => navigate(`/sims/${encodeURIComponent(sim.name)}`)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p>No sims match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}