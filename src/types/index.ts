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
  criteria: Record<string, boolean>;
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