import { describe, it, expect } from 'vitest';
import { EVENTS } from './analytics';

describe('event taxonomy', () => {
  it('covers choose and use journeys', () => {
    expect(EVENTS.choose_view_landing).toBe('choose.view_landing');
    expect(EVENTS.use_confirm_receipt).toBe('use.confirm_receipt');
  });
});
