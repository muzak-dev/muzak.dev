// Shared sponsor roster, used by the landing marquee and the docs rail.

/**
 * Whether the sponsor sections are rendered at all.
 *
 * Off for the first release: there are no sponsors yet, and a roster of
 * placeholder names reads as a claim rather than as a placeholder. The roster
 * and both layouts below are kept intact, so turning this back on is the whole
 * change. It gates the landing marquee ("Backed and sponsored by") and the rail
 * in the docs table of contents.
 */
export const SHOW_SPONSORS = false

export interface Sponsor {
  n: string // name
  t: string // tier / role
  m: string // mark key (see SPONSOR_MARKS)
  gold?: boolean // premium tier, gets the brass treatment
}

export const SPONSOR_MARKS: Record<string, string> = {
  hex: '<polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  anvil:
    '<path d="M4 8h16l-3 4h-4v4h3l-2 2H8l1-2h2v-4H7L4 8Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  rings:
    '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.4"/>',
  chev: '<path d="M5 7l7 5-7 5M12 7l7 5-7 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
  square:
    '<rect x="5" y="5" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(45 12 12)"/>',
  arc: '<path d="M4 18a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="12" cy="18" r="1.6" fill="currentColor"/>',
  bolt: '<path d="M13 3 5 13h5l-1 8 8-11h-5l1-7Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  tri: '<path d="M12 4l8 14H4L12 4Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 11l4 7H8l4-7Z" fill="currentColor" opacity=".5"/>',
  shield:
    '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  drop: '<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
}

export const SPONSORS: Sponsor[] = [
  { n: 'Forgewright', t: 'Platinum partner', m: 'hex', gold: true },
  { n: 'Brass & Vane', t: 'Capital', m: 'bolt', gold: true },
  { n: 'Tensile', t: 'Series B lead', m: 'chev', gold: true },
  { n: 'Anvil Cloud', t: 'Infrastructure', m: 'anvil' },
  { n: 'Patina Labs', t: 'Research', m: 'rings' },
  { n: 'Coldforge', t: 'Open source', m: 'square' },
  { n: 'Meridian Foundry', t: 'Foundry partner', m: 'arc' },
  { n: 'Smelter', t: 'Compute', m: 'tri' },
  { n: 'Ironclad', t: 'Security', m: 'shield' },
  { n: 'Quench Systems', t: 'Edge', m: 'drop' },
]
