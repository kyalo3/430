/** Shared logistics labels — keep in sync with backend app.services.logistics */
export const LOAD_CLASSES = [
  { id: 'small', label: 'Small (hand-carried)', hint: 'Fits volunteer Mode A' },
  { id: 'medium', label: 'Medium (bags/boxes)', hint: 'Needs more capacity' },
  { id: 'bulk', label: 'Bulk (partner preferred)', hint: 'Routes to partner logistics' },
  { id: 'cold', label: 'Cold-chain sensitive', hint: 'Volunteer needs “cold” task type' },
  { id: 'vehicle', label: 'Needs a vehicle', hint: 'Volunteer needs “vehicle” task type' },
];

export const LOGISTICS_MODES = [
  { id: 'either', label: 'Volunteer or partner' },
  { id: 'volunteer', label: 'Volunteer only' },
  { id: 'partner', label: 'Partner logistics only' },
];
