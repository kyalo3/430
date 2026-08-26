import { describe, it, expect } from 'vitest';
import { DONATION_STATUSES, nextActions } from './donationStates';

describe('donation state catalogue', () => {
  it('includes core journey statuses', () => {
    expect(DONATION_STATUSES).toContain('available');
    expect(DONATION_STATUSES).toContain('completed');
    expect(DONATION_STATUSES).not.toContain('arbitrary');
  });

  it('limits volunteer progress to legal next steps', () => {
    expect(nextActions('pickup_scheduled', 'volunteer')).toEqual(['collected', 'failed', 'disputed']);
    expect(nextActions('delivered', 'recipient')).toEqual(['recipient_confirmed', 'disputed']);
  });
});
