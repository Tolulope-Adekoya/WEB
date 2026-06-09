// Maps occult type to styling class and visual theme
export function getOccultClass(occult) {
  if (!occult) return 'occult-default';
  const o = occult.toLowerCase();
  if (o.includes('vampire')) return 'occult-vampire';
  if (o.includes('fairy') || o.includes('everdew')) return 'occult-fairy';
  if (o.includes('fae') || o.includes('sylvan')) return 'occult-fae';
  if (o.includes('alien')) return 'occult-alien';
  if (o.includes('werewolf')) return 'occult-werewolf';
  if (o.includes('ghost')) return 'occult-ghost';
  if (o.includes('mermaid')) return 'occult-mermaid';
  if (o.includes('spellcaster') || o.includes('witch')) return 'occult-spellcaster';
  if (o.includes('hybrid')) return 'occult-hybrid';
  if (o.includes('human')) return 'occult-human';
  return 'occult-default';
}

export function getOccultAccent(occult) {
  if (!occult) return '#A3B95A';
  const o = occult.toLowerCase();
  if (o.includes('vampire')) return '#8B0000';
  if (o.includes('fairy') || o.includes('everdew') || o.includes('fae')) return '#4CAF50';
  if (o.includes('alien')) return '#00BCD4';
  if (o.includes('werewolf')) return '#8D6E63';
  if (o.includes('ghost')) return '#B0C4DE';
  if (o.includes('mermaid')) return '#26C6DA';
  if (o.includes('spellcaster') || o.includes('witch')) return '#9C27B0';
  if (o.includes('hybrid')) return '#C0572A';
  return '#A3B95A';
}

export function getOccultGradient(occult) {
  const accent = getOccultAccent(occult);
  return `radial-gradient(ellipse at top, ${accent}22 0%, transparent 70%)`;
}

export function getOccultLabel(occult) {
  return occult || 'Human';
}

export function getOccultIcon(occult) {
  if (!occult) return '👤';
  const o = occult.toLowerCase();
  if (o.includes('vampire')) return '🦇';
  if (o.includes('fairy') || o.includes('everdew')) return '🧚';
  if (o.includes('fae') || o.includes('sylvan')) return '🌿';
  if (o.includes('alien')) return '👽';
  if (o.includes('werewolf')) return '🐺';
  if (o.includes('ghost')) return '👻';
  if (o.includes('mermaid')) return '🧜';
  if (o.includes('spellcaster') || o.includes('witch')) return '🔮';
  if (o.includes('hybrid')) return '✨';
  return '👤';
}