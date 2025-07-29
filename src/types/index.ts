export interface ProductCriteria {
  staging: boolean;
  bugs_critical: boolean;
  bugs_medium_plus: boolean;
  bugs_all: boolean;
  uptime_99: boolean;
  uptime_95: boolean;
  active_users_1: boolean;
  active_users_2: boolean;
  active_users_3: boolean;
}

export interface Product {
  id: string;
  name: string;
  stage: string;
  targetStage: string;
  description: string;
  daysInStage: number;
  status: 'ready' | 'blocked' | 'in-progress';
  readinessScore: number;
  url?: string | null;
  criteria: ProductCriteria | Record<string, boolean>;
  metrics: Record<string, number | null>;
  blockers: string[];
  nextAction: string;
  kickoffDate?: string | null;
}

export interface Stage {
  id: string;
  name: string;
  label: string;
  color: 'amber' | 'blue' | 'purple' | 'cyan' | 'green';
}

export type StageId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5';

export type StageColor = 'amber' | 'blue' | 'purple' | 'cyan' | 'green';