
export enum ProjectStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
  PENDING = 'Pending',
  RE_OPEN = 'Re-Open',
  IOS_DONE = 'iOS Done',
  ANDROID_DONE = 'Android Done',
  CANCELLED = 'Cancelled',
  HAND_OFF = 'Hand-Off',
  PLANNING = 'Planning'
}

export enum ProjectType {
  STRATEGIC = 'Chiến lược',
  ANNUAL = 'Thường niên', // ANN
  NEW = 'Mới' // NEW
}

export interface Project {
  id: string;
  year: number;
  code: string;
  description: string;
  type: ProjectType;
  department: string;
  status: ProjectStatus;
  phase: string;
  quarter: number;
  techHandoff: string;
  releaseDate: string;
  pm: string;
  designer: string;
  po: string;
  kpi: string;
  dashboardUrl?: string;
  notes?: string;
}

export interface BacklogItem {
  id: string;
  code: string;
  description: string;
  type: string;
  department: string;
  status: string;
  priority: string;
  quarter: string;
  pm: string;
  designer: string;
  po: string;
  notes: string;
  techHandoff?: string;
  releaseDate?: string;
}

export enum UserRole {
  MEMBER = 'Member',
  EDITOR = 'Editor',
  VIEWER = 'Viewer'
}

export interface User {
  name: string;
  role: UserRole;
  avatar: string;
}
