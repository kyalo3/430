import { formatStatus } from '../../lib/donationStates';

export default function StatusPill({ value }) {
  const v = (value || 'unknown').toLowerCase();
  const tone =
    v === 'available' ||
    v === 'completed' ||
    v === 'recipient_confirmed' ||
    v === 'active' ||
    v === 'ready'
      ? 'bg-emerald-100 text-emerald-800'
      : v === 'rejected' || v === 'failed' || v === 'cancelled' || v === 'suspended'
        ? 'bg-red-100 text-red-800'
        : v === 'delivered' || v === 'matched' || v === 'reserved' || v === 'pickup_scheduled'
          ? 'bg-orange-100 text-orange-900'
          : 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tone}`}>
      {formatStatus(value)}
    </span>
  );
}
