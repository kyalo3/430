/**
 * Marketing imagery — prefer local surplus photography; Unsplash for people/scenes that crop cleanly.
 * Each entry includes objectPosition so cards/heroes don't clip faces or empty sky.
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
};

/** Convenience string getters for places that only need a URL */
export const MEDIA_SRC = Object.fromEntries(
  Object.entries(MEDIA).map(([key, value]) => [key, value.src]),
);
