export enum Branch {
  Siam = 'Siam',
  Thonglor = 'Thonglor',
  Ari = 'Ari',
  HQ = 'HQ', // Headquarters sees all
  All = 'All' // Fallback for super admin
}

export enum FollowUpStatus {
  Pending = 'Pending',
  Contacted = 'Contacted',
  Booked = 'Booked',
  NotInterested = 'Not Interested'
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  branch: Branch | string; // Allow string from sheet
  lastTreatment: string;
  serviceDate: string; // ISO Date string YYYY-MM-DD
  status: FollowUpStatus;
  notes: string;
}

export interface User {
  email: string;
  name: string;
  branch: Branch | string; // Allow string from sheet
}

export interface StatData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}