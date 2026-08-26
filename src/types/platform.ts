/** Incremental TypeScript domain models for critical journeys. Runtime still uses JS clients. */

export type Role = 'donor' | 'recipient' | 'volunteer' | 'admin' | 'partner';

export type DonationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'available'
  | 'reserved'
  | 'matched'
  | 'pickup_scheduled'
  | 'collected'
  | 'in_transit'
  | 'delivered'
  | 'recipient_confirmed'
  | 'completed'
  | 'expired'
  | 'cancelled'
  | 'rejected'
  | 'recalled'
  | 'failed'
  | 'disputed';

export interface Donation {
  id: string;
  food_item: string;
  quantity: number;
  unit: string;
  status: DonationStatus;
  approx_location?: string;
  organisation_id?: string;
  match_reasons?: string[];
}

export interface Need {
  id: string;
  item: string;
  quantity: number;
  urgency: 'normal' | 'high';
  status: string;
  approx_location?: string;
}

export interface MatchSuggestion {
  donation: Donation;
  score: number;
  reasons: string[];
}

export interface Organisation {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'verified' | 'suspended';
  approx_location?: string;
}

export interface ImpactRecord {
  donation_id: string;
  quantity: number;
  unit: string;
  category: string;
  completed_at?: string;
}
