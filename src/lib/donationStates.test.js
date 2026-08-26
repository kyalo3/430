import { describe, it, expect } from 'vitest';
import { DONATION_STATUSES } from './donationStates';

describe('donation state catalogue', () => {
  it('includes core journey statuses', () => {
    expect(DONATION_STATUSES).toContain('available');
    expect(DONATION_STATUSES).toContain('completed');
    expect(DONATION_STATUSES).not.toContain('arbitrary');
  });
});
