/**
 * Maturity Framework - Stage Transition Logic
 * 
 * This module implements the logic for determining if a product can transition
 * between maturity stages (V1 -> V2 -> V3 -> V4 -> V5) based on specific criteria.
 */

export type Stage = 'V1' | 'V2' | 'V3' | 'V4' | 'V5';
export type CriteriaKey = 'staging' | 'bugs_critical' | 'bugs_medium_plus' | 'bugs_all' | 'uptime_99' | 'uptime_95' | 'active_users_1' | 'active_users_2' | 'active_users_3';
export type CriteriaEvaluations = Record<string, boolean> | { [K in CriteriaKey]?: boolean };

export interface StageTransitionResult {
  canTransition: boolean;
  nextStage?: Stage;
  blockingCriteria: string[];
  requiredCriteria: string[];
}

/**
 * Mapping of criteria to stage transitions
 * Each key represents a criterion that must be met for the specified transition
 */
export const STAGE_TRANSITION_MAPPING: Record<CriteriaKey, string> = {
  "staging": "V1 -> V2",
  "bugs_critical": "V2 -> V3", 
  "active_users_1": "V2 -> V3",
  "bugs_medium_plus": "V3 -> V4",
  "active_users_2": "V3 -> V4", 
  "uptime_95": "V3 -> V4",
  "bugs_all": "V4 -> V5",
  "active_users_3": "V4 -> V5",
  "uptime_99": "V4 -> V5"
};

/**
 * Get the next stage in sequence
 */
export function getNextStage(currentStage: Stage): Stage | null {
  const stages: Stage[] = ['V1', 'V2', 'V3', 'V4', 'V5'];
  const currentIndex = stages.indexOf(currentStage);
  
  if (currentIndex === -1 || currentIndex === stages.length - 1) {
    return null; // Invalid stage or already at final stage
  }
  
  return stages[currentIndex + 1];
}

/**
 * Get criteria required for transitioning from current stage to next stage
 */
export function getRequiredCriteriaForTransition(currentStage: Stage): string[] {
  const nextStage = getNextStage(currentStage);
  if (!nextStage) {
    return []; // No transition possible
  }
  
  const transitionString = `${currentStage} -> ${nextStage}`;
  const requiredCriteria: string[] = [];
  
  // Find all criteria that map to this transition
  for (const [criterion, transition] of Object.entries(STAGE_TRANSITION_MAPPING)) {
    if (transition === transitionString) {
      requiredCriteria.push(criterion);
    }
  }
  
  return requiredCriteria;
}

/**
 * Determine if a product can transition to the next stage
 * 
 * @param currentStage - Current stage of the product (e.g., "V2")
 * @param criteriaEvaluations - Dictionary of criteria evaluations (e.g., { "staging": true, "bugs_critical": false })
 * @returns StageTransitionResult with transition status and blocking criteria
 */
export function canTransitionToNextStage(
  currentStage: Stage, 
  criteriaEvaluations: CriteriaEvaluations
): StageTransitionResult {
  const nextStage = getNextStage(currentStage);
  
  if (!nextStage) {
    return {
      canTransition: false,
      blockingCriteria: [],
      requiredCriteria: []
    };
  }
  
  const requiredCriteria = getRequiredCriteriaForTransition(currentStage);
  const blockingCriteria: string[] = [];
  
  // Check each required criterion
  for (const criterion of requiredCriteria) {
    const isMetInEvaluations = (criteriaEvaluations as any)[criterion] === true;
    
    if (!isMetInEvaluations) {
      blockingCriteria.push(criterion);
    }
  }
  
  const canTransition = blockingCriteria.length === 0;
  
  return {
    canTransition,
    nextStage: canTransition ? nextStage : undefined,
    blockingCriteria,
    requiredCriteria
  };
}

/**
 * Get a human-readable description of stage transition requirements
 */
export function getStageTransitionDescription(currentStage: Stage): string {
  const nextStage = getNextStage(currentStage);
  if (!nextStage) {
    return `${currentStage} is the final stage.`;
  }
  
  const requiredCriteria = getRequiredCriteriaForTransition(currentStage);
  const criteriaLabels = requiredCriteria.map(criterion => {
    // Use the same label mapping as the UI components
    const labelMap: Record<string, string> = {
      'staging': 'Link pra Staging',
      'bugs_critical': 'Sem bugs high/highest',
      'bugs_medium_plus': 'Sem bugs medium+',
      'bugs_all': 'Sem nenhum bug registrado',
      'uptime_99': 'Uptime >= 99%',
      'uptime_95': 'Uptime >= 95%',
      'active_users_1': 'Pelo menos 3 usuarios',
      'active_users_2': 'Pelo menos 10 usuarios',
      'active_users_3': 'Pelo menos 50 usuarios'
    };
    return labelMap[criterion] || criterion.replace(/_/g, ' ');
  });
  
  return `To transition from ${currentStage} to ${nextStage}, the following criteria must be met: ${criteriaLabels.join(', ')}.`;
}

/**
 * Calculate readiness score as percentage of criteria met for next stage transition
 */
export function calculateReadinessScore(
  currentStage: Stage,
  criteriaEvaluations: CriteriaEvaluations
): number {
  const requiredCriteria = getRequiredCriteriaForTransition(currentStage);
  
  if (requiredCriteria.length === 0) {
    return 100; // No criteria required (final stage)
  }
  
  const metCriteria = requiredCriteria.filter(
    criterion => (criteriaEvaluations as any)[criterion] === true
  );
  
  return Math.round((metCriteria.length / requiredCriteria.length) * 100);
}