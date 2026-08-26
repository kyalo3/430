/** Consent-aware Choose/Use journey events. Do not emit invented impact. */
export const EVENTS = {
  choose_view_landing: 'choose.view_landing',
  choose_open_register: 'choose.open_register',
  choose_role_selected: 'choose.role_selected',
  use_donation_created: 'use.donation_created',
  use_need_created: 'use.need_created',
  use_claim: 'use.claim',
  use_volunteer_accept: 'use.volunteer_accept',
  use_handover_progress: 'use.handover_progress',
  use_confirm_receipt: 'use.confirm_receipt',
};

export function track(event, payload = {}) {
  if (typeof window === 'undefined') return;
  const record = {
    event,
    at: new Date().toISOString(),
    ...payload,
  };
  try {
    const key = 'ss_events';
    const prev = JSON.parse(sessionStorage.getItem(key) || '[]');
    prev.push(record);
    sessionStorage.setItem(key, JSON.stringify(prev.slice(-80)));
  } catch (_) {
    /* ignore quota */
  }
}
