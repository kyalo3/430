/** Pure helpers for dashboard summaries — verified data only, no invented metrics. */

export function countByStatus(rows = []) {
  const out = {};
  for (const row of rows) {
    const key = row?.status || 'unknown';
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

export function sumQuantity(rows = []) {
  return rows.reduce((acc, row) => acc + (Number(row?.quantity) || 0), 0);
}

export function filterStatuses(rows = [], statuses = []) {
  const set = new Set(statuses);
  return rows.filter((row) => set.has(row?.status));
}

export function formatWhen(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(value);
  }
}

export function formatDate(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return String(value);
  }
}

const HANDOVER = ['matched', 'pickup_scheduled', 'collected', 'in_transit', 'delivered'];
const REVIEW = ['draft', 'submitted', 'under_review'];
const VERIFIED = ['recipient_confirmed', 'completed'];
const OPEN_NEED = ['draft', 'submitted', 'verified', 'open', 'partially_matched', 'pending'];

export function donorPipeline(listings = [], impactItems = []) {
  const byStatus = countByStatus(listings);
  const verifiedQty = sumQuantity(impactItems);
  return {
    listed: listings.length,
    awaitingReview: filterStatuses(listings, REVIEW).length,
    available: byStatus.available || 0,
    inHandover: filterStatuses(listings, HANDOVER).length,
    verified: impactItems.length,
    verifiedQty,
    byStatus,
    byLoad: listings.reduce((acc, row) => {
      const key = row.load_class || 'small';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
  };
}

export function recipientPipeline(needs = [], available = [], mine = []) {
  return {
    needs: needs.length,
    openNeeds: filterStatuses(needs, OPEN_NEED).length,
    available: available.length,
    inProgress: filterStatuses(mine, [...HANDOVER, 'reserved', 'matched']).length,
    awaitingConfirm: filterStatuses(mine, ['delivered']).length,
    confirmed: filterStatuses(mine, VERIFIED).length,
    byNeedStatus: countByStatus(needs),
  };
}

export function volunteerPipeline(eligible = [], mine = [], capacity = 1) {
  const active = filterStatuses(mine, ['pickup_scheduled', 'collected', 'in_transit', 'delivered', 'matched']);
  const done = filterStatuses(mine, VERIFIED).concat(filterStatuses(mine, ['delivered']).filter(() => false));
  const completed = mine.filter((t) => ['delivered', 'recipient_confirmed', 'completed'].includes(t.status));
  const openSlots = Math.max(0, Number(capacity) || 1) - active.length;
  return {
    eligible: eligible.length,
    active: active.length,
    completed: completed.length,
    openSlots: Math.max(0, openSlots),
    capacity: Number(capacity) || 1,
    byStatus: countByStatus(mine),
  };
}

export function topEntries(map = {}, limit = 6) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}
