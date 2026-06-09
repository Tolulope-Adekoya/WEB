import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { simsData } from '../data/simsData';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import PlaceholderImage from '../components/PlaceholderImage';
import PetBadges from '../components/PetBadges';
import { getOccultAccent, getOccultClass, getOccultIcon } from '../components/OccultFrame';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 py-2 border-b border-border/50 last:border-0">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground sm:w-36 shrink-0">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}

const simAttributes = [
  { key: 'world', label: 'World' },
  { key: 'ageGroup', label: 'Age Group' },
  { key: 'gender', label: 'Gender' },
  { key: 'occult', label: 'Occult' },
  { key: 'ethnicity', label: 'Ethnicity' },
  { key: 'job', label: 'Job' },
  { key: 'jobDetail', label: 'Job Detail' },
  { key: 'playableSim', label: 'Playable' },
  { key: 'status', label: 'Status' },
  { key: 'familyStatus', label: 'Family' },
  { key: 'wealthClass', label: 'Household Wealth' },
  { key: 'individualWealthClass', label: 'Individual Wealth' },
  { key: 'total', label: 'Total Wealth' },
  { key: 'club', label: 'Club(s)' },
  { key: 'fameLevel', label: 'Fame Level' },
  { key: 'prestigeRank', label: 'Prestige Rank' },
  { key: 'orientation', label: 'Orientation' },
  { key: 'faith', label: 'Faith' },
  { key: 'addiction', label: 'Addiction' },
  { key: 'alignment', label: 'Alignment' },
  { key: 'powerSource', label: 'Power Source' },
  { key: 'formLevel', label: 'Form Level' },
  { key: 'magicalAbilities', label: 'Magical Abilities' },
  { key: 'spells', label: 'Spells' },
  { key: 'alchemyPotions', label: 'Alchemy Potions' },
  { key: 'altarConfigurations', label: 'Altar Config' },
  { key: 'occultGroup', label: 'Occult Group' },
  { key: 'languageSpoken', label: 'Languages' },
  { key: 'politicalAlignment', label: 'Political Alignment' },
  { key: 'sugar', label: 'Sugar' },
  { key: 'dos', label: 'DOS' },
  { key: 'owesKasonMoney', label: 'Owes Kason $' },
  { key: 'owesKasonTime', label: 'Owes Kason Time' },
  { key: 'notes', label: 'Notes' },
];

export default function SimDetail() {
  const { simName } = useParams();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(simName);
  const sim = simsData.find(s => s.name === decoded);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const totalPhotos = 3;

  if (!sim) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <p className="text-muted-foreground">Sim not found.</p>
    </div>
  );

  const accent = getOccultAccent(sim.occult);
  const occultClass = getOccultClass(sim.occult);
  const icon = getOccultIcon(sim.occult);

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate('/sims')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          All Sims
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main photo */}
            <div
              className={`relative rounded-2xl overflow-hidden border ${occultClass} aspect-[3/4]`}
              style={{ background: `linear-gradient(180deg, ${accent}11 0%, hsl(var(--card)) 100%)` }}
            >
              <PlaceholderImage className="w-full h-full" alt={sim.name} />
              {/* Gallery arrows */}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                onClick={() => setGalleryIdx(i => (i - 1 + totalPhotos) % totalPhotos)}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 flex items-center justify-center hover:bg-background transition-colors shadow-lg"
                onClick={() => setGalleryIdx(i => (i + 1) % totalPhotos)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {Array.from({ length: totalPhotos }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === galleryIdx ? 'w-4' : ''}`}
                    style={{ backgroundColor: i === galleryIdx ? accent : 'rgba(255,255,255,0.4)' }}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-3">
              {Array.from({ length: totalPhotos }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  className={`flex-1 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === galleryIdx ? 'border-primary' : 'border-border'}`}
                >
                  <PlaceholderImage className="w-full h-full" alt="" />
                </button>
              ))}
            </div>

            {/* Pets */}
            {sim.pets && (
              <div className="mt-4 p-4 rounded-xl border border-border bg-card">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Pets</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {sim.pets.split(',').map((pet, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full placeholder-img border-2 border-border flex items-center justify-center text-xl">
                        {pet.trim().toLowerCase().includes('cat') ? '🐱' :
                         pet.trim().toLowerCase().includes('dog') ? '🐕' :
                         pet.trim().toLowerCase().includes('horse') ? '🐴' :
                         pet.trim().toLowerCase().includes('bird') || pet.trim().toLowerCase().includes('toucan') || pet.trim().toLowerCase().includes('lovebird') ? '🐦' :
                         pet.trim().toLowerCase().includes('iguana') || pet.trim().toLowerCase().includes('chameleon') ? '🦎' :
                         pet.trim().toLowerCase().includes('tortoise') || pet.trim().toLowerCase().includes('turtle') ? '🐢' : '🐾'}
                      </div>
                      <span className="text-[10px] text-muted-foreground capitalize text-center">{pet.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Name & occult header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs uppercase tracking-widest" style={{ color: accent }}>{sim.occult || 'Human'}</span>
              </div>
              <h1 className="font-heading text-4xl font-bold text-foreground">{sim.name}</h1>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                <span>{sim.ageGroup}</span>
                <span>·</span>
                <span>{sim.gender}</span>
                {sim.world && <><span>·</span><span>{sim.world}</span></>}
              </div>
              <div className="h-px mt-3 bg-gradient-to-r from-transparent" style={{ backgroundImage: `linear-gradient(to right, ${accent}60, transparent)` }} />
            </div>

            {/* Attribute list */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-0.5">
              {simAttributes.map(attr => (
                <InfoRow key={attr.key} label={attr.label} value={sim[attr.key]} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}