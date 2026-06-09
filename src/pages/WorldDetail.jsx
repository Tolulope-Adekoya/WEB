import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { worldsData, worldStatusColors } from '../data/worldsData';
import { lotsData, lotStatusColors } from '../data/lotsData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, X, Info, Badge } from 'lucide-react';
import PlaceholderImage from '../components/PlaceholderImage';

function LotCard({ lot }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showCC, setShowCC] = useState(false);
  const totalImgs = 3; // placeholder count

  const statusColor = lotStatusColors[lot.status] || '#666';

  const infoText = [
    lot.lotNewName && `"${lot.lotNewName}"`,
    lot.lotType,
    lot.lotUse,
    lot.residents && `Residents: ${lot.residents}`,
    lot.neighbourhood && `${lot.neighbourhood}`,
    lot.price && `${lot.price}`,
    lot.size && `${lot.size}`,
  ].filter(Boolean).join(' · ');

  return (
    <>
      <div
        className="relative rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:shadow-xl cursor-pointer"
        onClick={() => setShowCC(true)}
      >
        {/* Image gallery */}
        <div className="relative h-44 bg-muted">
          <PlaceholderImage className="w-full h-full" alt={lot.lotOriginalName} />
          {/* Card nav arrows */}
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
            onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + totalImgs) % totalImgs); }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
            onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % totalImgs); }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {Array.from({ length: totalImgs }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-primary' : 'bg-white/50'}`} />
            ))}
          </div>
          {/* Status badge */}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: statusColor }}
          >
            {lot.status}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-heading font-bold text-foreground text-base leading-tight">
            {lot.lotNewName || lot.lotOriginalName}
          </h3>
          {lot.lotNewName && (
            <p className="text-muted-foreground text-xs mt-0.5">was: {lot.lotOriginalName}</p>
          )}

          {/* Truncated info */}
          <div
            className={`mt-2 text-xs text-muted-foreground leading-5 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-40' : 'max-h-10'}`}
            style={{ WebkitLineClamp: expanded ? 'unset' : 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {infoText}
          </div>
          {infoText.length > 80 && (
            <button
              className="text-primary text-xs mt-1 hover:underline"
              onClick={e => { e.stopPropagation(); setExpanded(!expanded); }}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}

          {/* Bottom row */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Info className="w-3 h-3" />
              <span>Click for CC</span>
            </div>
            {lot.bed && <span className="text-[10px] text-muted-foreground">{lot.bed}bd {lot.bath}ba</span>}
          </div>
        </div>
      </div>

      {/* CC Modal */}
      <AnimatePresence>
        {showCC && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCC(false)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div
              className="relative bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl z-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors"
                onClick={() => setShowCC(false)}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <h3 className="font-heading font-bold text-foreground text-lg mb-1">
                {lot.lotNewName || lot.lotOriginalName}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Custom Content Used</p>
              {lot.lotsCC ? (
                <div className="bg-muted rounded-xl p-3 text-xs text-foreground whitespace-pre-wrap leading-6 font-mono">
                  {lot.lotsCC}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">No CC listed for this lot.</p>
              )}
              {lot.amenities && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Amenities</p>
                  <p className="text-xs text-muted-foreground">{lot.amenities}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function WorldDetail() {
  const { worldName } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(worldName);

  const world = worldsData.find(w => w.world === decoded);
  const lots = lotsData.filter(l => l.world === decoded);

  if (!world) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <p className="text-muted-foreground">World not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate('/worlds')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          All Worlds
        </button>
      </div>

      {/* World map */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden border border-border relative">
          <PlaceholderImage className="w-full h-full" alt={`${world.world} map`} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2"
              style={{ backgroundColor: worldStatusColors[world.status] || '#666' }}
            >
              {world.status}
            </div>
            <h1 className="font-heading text-4xl font-bold text-white">{world.world}</h1>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-3xl mx-auto px-4 mb-12">
        <p className="text-muted-foreground leading-8 text-base italic border-l-2 border-primary pl-4">
          {world.description}
        </p>
      </div>

      {/* Lots */}
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
          Lots in {world.world}
          <span className="ml-2 text-base font-normal text-muted-foreground">({lots.length} lots)</span>
        </h2>

        {lots.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p>No lots mapped for this world yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lots.map((lot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <LotCard lot={lot} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}