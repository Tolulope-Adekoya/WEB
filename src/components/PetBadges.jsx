import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const petEmoji = (pet) => {
  const p = pet.toLowerCase().trim();
  if (p.includes('cat')) return '🐱';
  if (p.includes('dog')) return '🐕';
  if (p.includes('horse')) return '🐴';
  if (p.includes('bird') || p.includes('toucan') || p.includes('lovebird')) return '🐦';
  if (p.includes('iguana') || p.includes('chameleon') || p.includes('lizard')) return '🦎';
  if (p.includes('tortoise') || p.includes('turtle')) return '🐢';
  if (p.includes('sugar glider')) return '🐿️';
  if (p.includes('rabbit')) return '🐰';
  if (p.includes('fish')) return '🐟';
  return '🐾';
};

// Individual pet sticker with focus modal on click
function PetSticker({ pet, simName, simNotes, size = 'md', style = {} }) {
  const [open, setOpen] = useState(false);
  const sizes = { sm: 'w-7 h-7 text-base', md: 'w-9 h-9 text-xl', lg: 'w-12 h-12 text-2xl' };

  return (
    <>
      <button
        className={`relative ${sizes[size]} rounded-full bg-card border border-border shadow-md flex items-center justify-center transition-transform hover:scale-110 hover:z-10 hover:shadow-lg focus:outline-none`}
        style={style}
        title={pet}
        onClick={e => { e.stopPropagation(); setOpen(true); }}
      >
        {petEmoji(pet)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
            <motion.div
              className="relative bg-card border border-border rounded-2xl p-6 w-64 shadow-2xl z-10 flex flex-col items-center gap-3"
              initial={{ scale: 0.85, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 16 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted" onClick={() => setOpen(false)}>
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {/* Pet portrait */}
              <div className="w-20 h-20 rounded-full placeholder-img border-2 border-primary/30 flex items-center justify-center text-4xl bg-muted shadow-inner">
                {petEmoji(pet)}
              </div>
              <div className="text-center">
                <p className="font-heading font-semibold text-foreground capitalize text-lg">{pet}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Owned by <span className="text-primary">{simName}</span>
                </p>
                {simNotes && <p className="text-xs text-muted-foreground mt-2 leading-4">{simNotes}</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Clustered sticker row — pets overlap slightly like stickers placed on a profile
export default function PetBadges({ pets, simName = '', simNotes = '', size = 'md', max = 5 }) {
  if (!pets) return null;
  const petList = pets.split(',').map(p => p.trim()).filter(Boolean);
  if (petList.length === 0) return null;

  const shown = petList.slice(0, max);
  const extra = petList.length - max;

  return (
    <div className="flex items-center">
      {shown.map((pet, i) => (
        <PetSticker
          key={i}
          pet={pet}
          simName={simName}
          simNotes={simNotes}
          size={size}
          style={{ marginLeft: i > 0 ? '-8px' : '0', zIndex: i + 1 }}
        />
      ))}
      {extra > 0 && (
        <div
          className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-md"
          style={{ marginLeft: '-8px', zIndex: shown.length + 1 }}
          title={`+${extra} more pets`}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

export { PetSticker };