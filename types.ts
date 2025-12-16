export interface User {
  name: string;
  companyName: string;
}

export interface Customer {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  gpsAddress: string;
  latitude: number;
  longitude: number;
  averageBags: number;
  lastVisit: string;
}

export type ViewState = 'dashboard' | 'map' | 'list' | 'add' | 'settings';

export interface AnalysisResult {
  summary: string;
  strategy: string;
  clusters: string[];
}