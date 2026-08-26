/** Mirrors backend donation lifecycle labels for UI badges. */
export const DONATION_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'available',
  'reserved',
  'matched',
  'pickup_scheduled',
  'collected',
  'in_transit',
  'delivered',
  'recipient_confirmed',
  'completed',
  'expired',
  'cancelled',
  'rejected',
  'recalled',
  'failed',
  'disputed',
];

export const DONATION_TRANSITIONS = {
  draft: ['submitted', 'cancelled'],
  submitted: ['under_review', 'cancelled', 'rejected'],
  under_review: ['available', 'rejected', 'cancelled'],
  available: ['reserved', 'expired', 'recalled', 'cancelled'],
  reserved: ['matched', 'available', 'cancelled', 'expired'],
  matched: ['pickup_scheduled', 'cancelled', 'disputed'],
  pickup_scheduled: ['collected', 'failed', 'cancelled', 'disputed'],
  collected: ['in_transit', 'failed', 'disputed'],
  in_transit: ['delivered', 'failed', 'disputed'],
  delivered: ['recipient_confirmed', 'disputed', 'failed'],
  recipient_confirmed: ['completed', 'disputed'],
  completed: [],
  expired: [],
  cancelled: [],
  rejected: [],
  recalled: [],
  failed: ['disputed', 'cancelled'],
  disputed: ['under_review', 'cancelled', 'completed'],
};

const ROLE_ACTIONS = {
  donor: ['submitted', 'cancelled', 'recalled'],
  recipient: ['recipient_confirmed', 'disputed'],
  volunteer: ['pickup_scheduled', 'collected', 'in_transit', 'delivered', 'failed', 'disputed'],
};

export function nextActions(current, role) {
  const allowed = DONATION_TRANSITIONS[current] || [];
  if (role === 'admin') return allowed;
  const roleSet = new Set(ROLE_ACTIONS[role] || []);
  return allowed.filter((status) => roleSet.has(status));
}

export function formatStatus(status) {
  return String(status || 'unknown').replaceAll('_', ' ');
}

export function journeyStage(status) {
  if (['draft', 'submitted', 'under_review'].includes(status)) return 'Review';
  if (['available', 'reserved', 'matched'].includes(status)) return 'Match';
  if (['pickup_scheduled', 'collected', 'in_transit', 'delivered'].includes(status)) return 'Handover';
  if (['recipient_confirmed', 'completed'].includes(status)) return 'Verified';
  return 'Closed';
}
