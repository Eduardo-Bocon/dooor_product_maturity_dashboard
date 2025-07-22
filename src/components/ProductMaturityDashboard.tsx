'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatsOverview } from '@/components/stats-overview';
import { StageColumn } from '@/components/stage-column';
import { Product, Stage, StageId } from '@/types';

const ProductMaturityDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedStages, setExpandedStages] = useState({
    'V1': true,
    'V2': true,
    'V3': true,
    'V4': true,
    'V5': true
  });

  // Mock data baseado nos documentos reais
  const products: Product[] = [
    {
      id: 'kenna',
      name: 'Kenna',
      stage: 'V2',
      targetStage: 'V3',
      description: '🏥 Healthcare AI Platform',
      daysInStage: 65,
      status: 'blocked' as const,
      readinessScore: 75,
      url: 'https://kenna-front-2.vercel.app',
      criteria: {
        ci_green: true,
        internal_users: true,
        staging_deployed: true,
        critical_fixes: false
      },
      metrics: {
        target_doctors: 10,
        recruited_doctors: 8,
        soap_approval_rate: null,
        target_soap_approval: 80,
        recordings_per_tester: null,
        target_recordings: 2
      },
      blockers: ['AI speaker identification system', 'Account page adjustments'],
      nextAction: 'Fix P1 speaker identification - blocking V3 kickoff',
      kickoffDate: '2025-07-14'
    },
    {
      id: 'chorus',
      name: 'Chorus',
      stage: 'V3',
      targetStage: 'V4',
      description: '🎼 Collaboration Platform',
      daysInStage: 14,
      status: 'ready' as const,
      readinessScore: 95,
      url: 'https://chorus.dooor.ai',
      criteria: {
        alpha_users: true,
        p1_bugs_fixed: true,
        monitoring: true,
        user_engagement: true
      },
      metrics: {
        target_testers: 25,
        active_testers: 22,
        agents_per_user: 4.2,
        target_agents: 4,
        onboarding_completion: 85,
        target_onboarding: 80
      },
      blockers: [],
      nextAction: 'Ready to graduate to V4 - schedule transition review',
      kickoffDate: '2025-07-07'
    },
    {
      id: 'duet',
      name: 'Duet',
      stage: 'V3',
      targetStage: 'V3',
      description: '🎭 AI Chat Platform',
      daysInStage: 1,
      status: 'in-progress' as const,
      readinessScore: 90,
      url: 'https://chat-a.dooor.ai',
      criteria: {
        p1_bugs_fixed: true,
        p2_bugs: false,
        testers_identified: true,
        monitoring: true
      },
      metrics: {
        target_testers: 25,
        identified_testers: 20,
        conversations_per_tester: null,
        target_conversations: 10,
        wisdoms_tested: null,
        target_wisdoms: 3
      },
      blockers: ['Wisdom labs not opening (P2)'],
      nextAction: 'Fix Wisdom labs P2 issue, notify alpha testers',
      kickoffDate: '2025-07-21'
    },
    {
      id: 'cadence',
      name: 'Cadence',
      stage: 'V1',
      targetStage: 'V2',
      description: '🎵 Product Suite',
      daysInStage: 15,
      status: 'in-progress' as const,
      readinessScore: 60,
      url: null,
      criteria: {
        core_features: true,
        basic_ui: false,
        technical_feasibility: true,
        architecture: false
      },
      metrics: {
        core_features_complete: 65,
        target_completion: 80
      },
      blockers: ['UI consistency review needed'],
      nextAction: 'Complete UI standardization for V2 transition',
      kickoffDate: null
    },
    {
      id: 'n8n-content',
      name: 'n8n-content',
      stage: 'V1',
      targetStage: 'V2',
      description: '📝 Content Management',
      daysInStage: 45,
      status: 'in-progress' as const,
      readinessScore: 70,
      url: null,
      criteria: {
        core_features: true,
        basic_ui: true,
        technical_feasibility: true,
        user_feedback: false
      },
      metrics: {
        content_types_supported: 8,
        target_content_types: 12
      },
      blockers: ['User feedback collection needed'],
      nextAction: 'Gather internal user feedback before V2',
      kickoffDate: null
    }
  ];

  const stages: Stage[] = [
    { id: 'V1', name: 'V1', label: 'Demo/Conceito', color: 'amber' },
    { id: 'V2', name: 'V2', label: 'Protótipo', color: 'blue' },
    { id: 'V3', name: 'V3', label: 'Alpha/Beta', color: 'purple' },
    { id: 'V4', name: 'V4', label: 'Pre-Production', color: 'cyan' },
    { id: 'V5', name: 'V5', label: 'Produção', color: 'green' }
  ];

  const getStageProducts = (stageId: string) => {
    return products.filter(product => product.stage === stageId);
  };


  const toggleStage = (stageId: StageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const handleToggleAll = () => {
    const allExpanded = Object.values(expandedStages).every(Boolean);
    const newState = allExpanded ? 
      { 'V1': false, 'V2': false, 'V3': false, 'V4': false, 'V5': false } :
      { 'V1': true, 'V2': true, 'V3': true, 'V4': true, 'V5': true };
    setExpandedStages(newState);
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        lastUpdated={lastUpdated}
        allExpanded={Object.values(expandedStages).every(Boolean)}
        onToggleAll={handleToggleAll}
        onRefresh={handleRefresh}
      />
      
      <StatsOverview products={products} />

      {/* Pipeline Columns */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-5 gap-4 min-h-96">
          {stages.map((stage) => {
            const stageProducts = getStageProducts(stage.id);
            const isExpanded = expandedStages[stage.id as StageId];

            return (
              <StageColumn
                key={stage.id}
                stage={stage as any}
                products={stageProducts}
                isExpanded={isExpanded}
                onToggle={() => toggleStage(stage.id as StageId)}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            📅 Last updated: {lastUpdated.toLocaleString()} • 🤖 AI Analysis Active • 🔄 Auto-refresh every 15min
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductMaturityDashboard;