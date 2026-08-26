import { describe, it, expect } from 'vitest';
import { dashboardPathForRole } from './demo-accounts';

describe('dashboardPathForRole', () => {
  it('maps each role to its dashboard', () => {
    expect(dashboardPathForRole('donor')).toBe('/dashboard/donor');
    expect(dashboardPathForRole('recipient')).toBe('/dashboard/recipient');
    expect(dashboardPathForRole('volunteer')).toBe('/dashboard/volunteer');
    expect(dashboardPathForRole('admin')).toBe('/dashboard/admin');
    expect(dashboardPathForRole('unknown')).toBe('/');
  });
});
