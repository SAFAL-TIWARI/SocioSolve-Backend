export type UserRole = 'citizen' | 'government' | 'university' | 'industry' | 'admin';

export type ChallengeSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type ChallengeStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Validated'
  | 'Assigned'
  | 'Accepted'
  | 'Solution Development'
  | 'Pilot'
  | 'Implementation'
  | 'Resolution Submitted'
  | 'Citizen Verification'
  | 'Resolved'
  | 'Rejected'
  | 'Duplicate'
  | 'Needs More Information'
  | 'Reopened'
  | 'Escalated';

export type ProjectStage =
  | 'Proposal'
  | 'Review'
  | 'Approved'
  | 'Team Formation'
  | 'Development'
  | 'Prototype'
  | 'Testing'
  | 'Pilot'
  | 'Deployment'
  | 'Impact Measurement'
  | 'Completed';

export type VerificationChoice = 'Yes' | 'Partially' | 'No';

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  district: string;
  block?: string;
  villageOrWard?: string;
  landmark?: string;
  address?: string;
}

export interface AuthUserPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  district?: string;
  organizationId?: string;
}
