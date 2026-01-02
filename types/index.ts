export type TabType = 'worker' | 'vendor' | 'work' | 'profile';

export interface Worker {
  id: string;
  name: string;
  skill: string;
  rating: number;
  dailyRate: number;
  experience: string;
  isAvailable: boolean;
}

export interface Vendor {
  id: string;
  companyName: string;
  description: string;
  category: 'Material' | 'Logistics' | 'Equipment';
  location: string;
}

export interface WorkRecord {
  id: string;
  title: string;
  status: 'present' | 'past';
  date: string;
  workerName: string;
}