import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { persons, marriages, familyChildren, buildFamilyGroups } from '../data/familyData';
import { simsData } from '../data/simsData';
import { getOccultAccent, getOccultClass } from '../components/OccultFrame';

const familyBgColors = [
  { from: '#A3B95A22', line: '#A3B95A' },
  { from: '#C0572A22', line: '#C0572A' },
  { from: '#7c3aed22', line: '#7c3aed' },
  { from: '#1d4ed822', line: '#1d4ed8' },
  { from: '#be185d22', line: '#be185d' },
  { from: '#0f766e22', line: '#0f766e' },
  { from: '#b4530022', line: '#b45309' },
  { from: '#37516122', line: '#374151' },
];

// Match a family tree person to a sim in simsData
function matchSim(person) {
  if (!person) return null;
  const fullName = `${person.given} ${person.surname}`.trim().toLowerCase();
  return simsData.find(s => {
    const sn = s.name.toLowerCase();
    return sn === fullName ||
      sn.startsWith(person.given.toLowerCase()) ||
      sn.includes(person.given.toLowerCase() + ' ' + person.surname.toLowerCase());
  }) || null;
}

function getPetList(sim) {
  if (!sim?.pets) return [];
  return sim.pets.split(',').map(p => p.trim()).filter(Boolean);
}

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

// Single sim node — polaroid style with profile pic area + sticker pets
function SimNode({ person, lineColor = '#A3B95A', size = 'md' }) {
  if (!person) return null;
  const sim = matchSim(person);
  const pets = getPetList(sim);
  const occultClass = getOccultClass(sim?.occult);
  const accent = getOccultAccent(sim?.occult);

  const w = size === 'sm' ? 60 : 80;
  const h = size === 'sm' ? 68 : 90;
  const textSize = size === 'sm' ? 'text-[8px]' : 'text-[10px]';

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        {/* Polaroid card */}
        <div
          className="bg-white dark:bg-[#e8e3d5] rounded-sm shadow-md flex flex-col"
          style={{ padding: '5px 5px 20px 5px', border: `2px solid ${accent}55` }}
        >
          {/* Photo area */}
          <div
            className="placeholder-img rounded-sm"
            style={{ width: w, height: h }}
          />
          {/* Pet stickers on the photo */}
          {pets.length > 0 && (
            <div className="absolute top-1 right-1 flex flex-col gap-0.5">
              {pets.slice(0, 3).map((pet, i) => (
                <div
                  key={i}
                  title={pet}
                  className="w-5 h-5 rounded-full bg-card/80 border border-border flex items-center justify-center shadow-sm text-xs backdrop-blur-sm"
                  style={{ marginTop: i > 0 ? -3 : 0 }}
                >
                  {petEmoji(pet)}
                </div>
              ))}
              {pets.length > 3 && (
                <div className="w-5 h-5 rounded-full bg-card/80 border border-border flex items-center justify-center text-[8px] font-bold text-muted-foreground" style={{ marginTop: -3 }}>
                  +{pets.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Name below polaroid */}
        <div className="text-center mt-1 px-0.5">
          <p className={`font-medium text-foreground leading-tight ${textSize} truncate max-w-[90px]`}>{person.given}</p>
          <p className={`text-muted-foreground leading-tight ${size === 'sm' ? 'text-[7px]' : 'text-[9px]'} truncate max-w-[90px]`}>{person.surname}</p>
          {sim?.occult && sim.occult !== 'Human' && (
            <p className={`leading-tight ${size === 'sm' ? 'text-[7px]' : 'text-[8px]'}`} style={{ color: accent }}>{sim.occult}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Generation row of a couple (side by side) with vertical line down to children
function GenerationUnit({ husband, wife, children, lineColor, depth = 0 }) {
  if (!husband && !wife) return null;

  return (
    <div className="flex flex-col items-center">
      {/* Couple row */}
      <div className="flex items-end gap-1">
        {husband && <SimNode person={husband} lineColor={lineColor} size={depth === 0 ? 'md' : 'sm'} />}
        {husband && wife && (
          <div className="flex flex-col items-center pb-5 mx-0.5">
            <div className="h-px w-5" style={{ backgroundColor: lineColor + '80' }} />
            <div className="w-3 h-3 rounded-full border-2 flex items-center justify-center" style={{ borderColor: lineColor + '80', backgroundColor: 'transparent' }}>
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: lineColor }} />
            </div>
            <div className="h-px w-5" style={{ backgroundColor: lineColor + '80' }} />
          </div>
        )}
        {wife && <SimNode person={wife} lineColor={lineColor} size={depth === 0 ? 'md' : 'sm'} />}
      </div>

      {/* Vertical drop to children */}
      {children.length > 0 && (
        <>
          <div className="w-px h-5" style={{ backgroundColor: lineColor + '60' }} />
          {/* Horizontal bar across children */}
          <div className="flex items-start relative">
            {children.length > 1 && (
              <div
                className="absolute top-0 h-px"
                style={{
                  left: `calc(50% - ${((children.length - 1) * 50)}px)`,
                  width: `${(children.length - 1) * 100}px`,
                  backgroundColor: lineColor + '60',
                }}
              />
            )}
            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center" style={{ width: 100, flexShrink: 0 }}>
                <div className="w-px h-4" style={{ backgroundColor: lineColor + '60' }} />
                <SimNode person={child} lineColor={lineColor} size="sm" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FamilyTree({ familyName, members, colorScheme }) {
  const memberIds = new Set(members);

  // Find the "root" marriages — couples where at least one person is in this family
  // and try to find grandparent → parent → child chains
  const relevantMarriages = Object.entries(marriages).filter(([fid, m]) =>
    memberIds.has(m.husband) || memberIds.has(m.wife)
  );

  // Build rendered units (up to 6 couples to keep it readable)
  const units = relevantMarriages.slice(0, 6).map(([fid, m]) => ({
    fid,
    husband: m.husband ? persons[m.husband] : null,
    wife: m.wife ? persons[m.wife] : null,
    children: (familyChildren[fid] || []).map(id => persons[id]).filter(Boolean),
  }));

  // Singles not in marriages
  const marriedIds = new Set(units.flatMap(u => [u.husband?.id, u.wife?.id].filter(Boolean)));
  const singles = members.filter(id => !marriedIds.has(id)).slice(0, 8).map(id => persons[id]).filter(Boolean);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border p-6"
      style={{ background: `linear-gradient(135deg, ${colorScheme.from}, hsl(var(--card)))` }}
    >
      <h3 className="font-heading text-xl font-bold text-foreground mb-1">
        The {familyName} Family
      </h3>
      <p className="text-xs text-muted-foreground mb-6">{members.length} members</p>

      <div className="overflow-x-auto overflow-y-auto pb-4" style={{ maxHeight: 520 }}>
        {/* Top-down vertical layout: each couple unit stacked or side by side */}
        <div className="flex flex-wrap gap-10 min-w-max items-start">
          {units.map(({ fid, husband, wife, children }) => (
            <GenerationUnit
              key={fid}
              husband={husband}
              wife={wife}
              children={children}
              lineColor={colorScheme.line}
            />
          ))}
          {singles.length > 0 && (
            <div className="flex flex-wrap gap-4 items-start">
              {singles.map(p => <SimNode key={p.id} person={p} lineColor={colorScheme.line} size="sm" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Families() {
  const [selectedFamily, setSelectedFamily] = useState('');
  const familyGroups = useMemo(() => buildFamilyGroups(), []);

  const displayedFamilies = selectedFamily
    ? familyGroups.filter(f => f.name === selectedFamily)
    : familyGroups.slice(0, 15);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-2">Bloodlines</p>
          <h1 className="font-heading text-5xl font-bold text-foreground mb-3">Families</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-2" />
          <p className="text-muted-foreground">{familyGroups.length} families · sorted by size</p>
        </div>

        <div className="max-w-xs mx-auto mb-10">
          <div className="relative">
            <select
              value={selectedFamily}
              onChange={e => setSelectedFamily(e.target.value)}
              className="w-full py-2.5 px-4 pr-8 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary appearance-none"
            >
              <option value="">All Families (Top 15)</option>
              {familyGroups.map(f => (
                <option key={f.name} value={f.name}>{f.name} ({f.size})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="space-y-8">
          {displayedFamilies.map((family, i) => (
            <motion.div
              key={family.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <FamilyTree
                familyName={family.name}
                members={family.members}
                colorScheme={familyBgColors[i % familyBgColors.length]}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}