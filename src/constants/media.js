/**
 * Marketing & dashboard imagery.
 * Prefer local surplus photography where available; Unsplash for sustainability /
 * community-garden / redistribution scenes that crop cleanly.
 * Free Unsplash photos only (not Unsplash+).
 * Source themes: https://unsplash.com/s/photos/sustainability
 */
const u = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const MEDIA = {
  hero: {
    src: '/images/hero.jpg',
    alt: 'Surplus pantry staples and fresh produce arranged for redistribution',
    objectPosition: 'center',
  },
  market: {
    src: u('photo-1542838132-92c53300491e'),
    alt: 'Fresh groceries and produce ready to redistribute',
    objectPosition: 'center 40%',
  },
  volunteers: {
    src: u('photo-1593113598332-cd288d649433'),
    alt: 'Volunteers packing food donation boxes',
    objectPosition: 'center 30%',
  },
  community: {
    src: u('photo-1559027615-cd4628902d4a'),
    alt: 'Community volunteers sorting donations together',
    objectPosition: 'center 25%',
  },
  kitchen: {
    src: u('photo-1556911220-bff31c812dba'),
    alt: 'Kitchen team preparing fresh food',
    objectPosition: 'center 35%',
  },
  handover: {
    src: u('photo-1532629345422-7515f3d16bb6'),
    alt: 'Hands exchanging donated groceries',
    objectPosition: 'center',
  },
  pantry: {
    src: '/images/hero.jpg',
    alt: 'Organised surplus staples and fresh produce ready to share',
    objectPosition: 'center',
  },
  produce: {
    src: '/images/fruits.jpg',
    alt: 'Fresh fruit available for redistribution',
    objectPosition: 'center',
  },
  berries: {
    src: u('photo-1610832958506-aa56368176cf'),
    alt: 'Fresh berries in a bowl',
    objectPosition: 'center',
  },

  /* Sustainability / garden set — Unsplash free library */
  harvestHands: {
    src: u('photo-1461354464878-ad92f492a5a0'),
    alt: 'Hands holding a bowl of freshly picked tomatoes',
    objectPosition: 'center 40%',
  },
  vegBundle: {
    src: u('photo-1464226184884-fa280b87c399'),
    alt: 'Bundle of assorted fresh vegetables',
    objectPosition: 'center',
  },
  vegCrate: {
    src: u('photo-1599660869952-3852916ff82b'),
    alt: 'Assorted vegetables in a crate ready to share',
    objectPosition: 'center 35%',
  },
  marketShelf: {
    src: u('photo-1516594798947-e65505dbb29d'),
    alt: 'Rows of fresh vegetables on a display shelf',
    objectPosition: 'center 45%',
  },
  soilHands: {
    src: u('photo-1492496913980-501348b61469'),
    alt: 'Hands carrying rich garden soil',
    objectPosition: 'center 30%',
  },
  seedlings: {
    src: u('photo-1523348837708-15d4a09cfac2'),
    alt: 'Green seedlings ready for transplanting',
    objectPosition: 'center',
  },
  watering: {
    src: u('photo-1515150144380-bca9f1650ed9'),
    alt: 'Person watering plants in a community garden',
    objectPosition: 'center 25%',
  },
  plantingTogether: {
    src: u('photo-1524247108137-732e0f642303'),
    alt: 'People planting together in a shared garden',
    objectPosition: 'center 35%',
  },
  gardenBeds: {
    src: u('photo-1591857177580-dc82b9ac4e1e'),
    alt: 'Lush green beds in a community garden',
    objectPosition: 'center',
  },
  carrots: {
    src: u('photo-1532509774891-141d37f25ae9'),
    alt: 'Fresh carrots held carefully in hand',
    objectPosition: 'center 40%',
  },
  produceBox: {
    src: u('photo-1698230653391-85ffb85f94c3'),
    alt: 'Box filled with mixed vegetables for redistribution',
    objectPosition: 'center',
  },
  greensField: {
    src: u('photo-1589821821018-05d61218251f'),
    alt: 'Green crop field under open sky',
    objectPosition: 'center 40%',
  },
  fruitPile: {
    src: u('photo-1694076544200-08114d9f2ef6'),
    alt: 'Colourful pile of fruits and vegetables',
    objectPosition: 'center',
  },
};

/** Role → primary hero + supporting mood strip */
export const DASHBOARD_VISUALS = {
  donor: {
    hero: MEDIA.vegCrate,
    mood: [MEDIA.vegBundle, MEDIA.marketShelf, MEDIA.produceBox],
    accent: 'from-emerald-950/85 via-emerald-900/55 to-emerald-950/25',
  },
  recipient: {
    hero: MEDIA.harvestHands,
    mood: [MEDIA.carrots, MEDIA.seedlings, MEDIA.fruitPile],
    accent: 'from-emerald-950/85 via-teal-900/50 to-emerald-950/20',
  },
  volunteer: {
    hero: MEDIA.plantingTogether,
    mood: [MEDIA.watering, MEDIA.soilHands, MEDIA.gardenBeds],
    accent: 'from-emerald-950/85 via-lime-950/45 to-emerald-950/25',
  },
  admin: {
    hero: MEDIA.market,
    mood: [MEDIA.marketShelf, MEDIA.volunteers, MEDIA.greensField],
    accent: 'from-emerald-950/90 via-emerald-900/60 to-slate-900/30',
  },
};

/** Convenience string getters for places that only need a URL */
export const MEDIA_SRC = Object.fromEntries(
  Object.entries(MEDIA).map(([key, value]) => [key, value.src]),
);
