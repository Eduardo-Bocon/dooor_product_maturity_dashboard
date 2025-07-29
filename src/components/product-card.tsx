'use client';

import { 
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Activity,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { 
  canTransitionToNextStage, 
  getRequiredCriteriaForTransition,
  getNextStage,
  Stage as MaturityStage 
} from '@/lib/maturity-framework';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const getStageHoverColor = (stage: string) => {
  switch (stage) {
    case 'V1':
      return 'hover:border-amber-300 hover:shadow-amber-300';
    case 'V2':
      return 'hover:border-blue-300 hover:shadow-blue-300';
    case 'V3':
      return 'hover:border-purple-300 hover:shadow-purple-300';
    case 'V4':
      return 'hover:border-cyan-300 hover:shadow-cyan-300';
    case 'V5':
      return 'hover:border-green-300 hover:shadow-green-300';
    default:
      return 'hover:border-gray-300 hover:shadow-gray-300';
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'ready':
      return { 
        bg: 'bg-green-50', 
        text: 'text-green-700', 
        border: 'border-green-200', 
        icon: CheckCircle,
        label: 'READY'
      };
    case 'blocked':
      return { 
        bg: 'bg-red-50', 
        text: 'text-red-700', 
        border: 'border-red-200', 
        icon: AlertCircle,
        label: 'BLOCKED'
      };
    case 'in-progress':
      return { 
        bg: 'bg-yellow-50', 
        text: 'text-yellow-700', 
        border: 'border-yellow-200', 
        icon: Clock,
        label: 'IN PROGRESS'
      };
    default:
      return { 
        bg: 'bg-gray-50', 
        text: 'text-gray-700', 
        border: 'border-gray-200', 
        icon: Activity,
        label: 'UNKNOWN'
      };
  }
};

const getCriteriaLabel = (key: string) => {
  const labelMap: { [key: string]: string } = {
    'staging': 'Link pra Staging',
    'bugs_critical': 'Sem bugs high/highest',
    'bugs_medium_plus': 'Sem bugs medium+',
    'bugs_all': 'Sem nenhum bug registrado',
    'uptime_99': 'Uptime >= 99%',
    'uptime_95': 'Uptime >= 95%',
    'latency_avg_500': 'Latência média < 500ms',
    'latency_avg_1000': 'Latência média < 1000ms',
    'latency_p95': 'Latência P95 < 1000ms',
    'security_headers': 'Headers de segurança configurados',
    'active_users_1': 'Pelo menos 3 usuarios',
    'active_users_2': 'Pelo menos 10 usuarios',
    'active_users_3': 'Pelo menos 50 usuarios'
  };
  return labelMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  const stageHoverColor = getStageHoverColor(product.stage);
  
  // Get next stage and transition information using maturity framework
  const nextStage = getNextStage(product.stage as MaturityStage);
  const transitionResult = canTransitionToNextStage(
    product.stage as MaturityStage,
    product.criteria || {}
  );
  const requiredCriteria = getRequiredCriteriaForTransition(product.stage as MaturityStage);
  
  // Calculate progress percentage for next stage
  const nextStageProgress = requiredCriteria.length > 0 
    ? Math.round((requiredCriteria.filter(criterion => (product.criteria as any)[criterion] === true).length / requiredCriteria.length) * 100)
    : 100; // 100% if no criteria required (final stage)

  // Determine status based on progress and backend status
  const effectiveStatus = nextStageProgress === 100 ? 'ready' : product.status;
  const statusConfig = getStatusConfig(effectiveStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <Card 
      className={`bg-white border-2 border-gray-200 shadow hover:shadow-md ${stageHoverColor} transition-all cursor-pointer`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg uppercase">
              {product.name}
            </h3>
          </div>
          
        </div>

        <div className={`flex items-center space-x-2 p-2 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
          <StatusIcon className={`w-3 h-3 ${statusConfig.text}`} />
          <span className={`text-sm font-medium ${statusConfig.text}`}>
            {product.stage}→{nextStage || 'Final'} {statusConfig.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Next Stage Progress */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
               Progresso para o proximo estagio
            </span>
            <span className="text-sm font-semibold text-gray-900">{nextStageProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                nextStageProgress === 100 ? 'bg-green-500' : 
                nextStageProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${nextStageProgress}%` }}
            />
          </div>
        </div>

        {/* Exit Criteria */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-700">Exit Criteria</h4>
            {nextStage && (
              <div className="flex items-center space-x-1 text-xs">
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">{nextStage}</span>
                {!transitionResult.canTransition && (
                  <Lock className="w-3 h-3 text-red-400" />
                )}
              </div>
            )}
          </div>
          <div className="space-y-0.5">
            {/* Show only required criteria for next stage transition */}
            {requiredCriteria.length > 0 ? (
              requiredCriteria.map((criterionKey) => {
                const value = (product.criteria as any)[criterionKey];
                const isBlocking = transitionResult.blockingCriteria.includes(criterionKey);
                
                return (
                  <div key={criterionKey} className={`flex items-center space-x-1 text-sm ${isBlocking ? 'bg-red-50 px-1 rounded' : ''}`}>
                    {value ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-sm ${isBlocking ? 'text-red-700 font-medium' : 'text-gray-600'}`}>
                      {getCriteriaLabel(criterionKey)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center space-x-1 text-sm">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-gray-600 text-sm italic">
                  Estágio final alcançado
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Blockers */}
        {product.blockers && product.blockers.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-1">Blockers</h4>
            <div className="space-y-0.5">
              {product.blockers.slice(0, 1).map((blocker, index) => (
                <div key={index} className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                  • {blocker && blocker.length > 30 ? blocker.substring(0, 30) + '...' : blocker}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Action */}
        <div className="border-t pt-2">
          <div className="flex items-start space-x-1">
            <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-0.5">Observações</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {(product.observations || product.nextAction) ? ((product.observations || product.nextAction).length > 50 ? (product.observations || product.nextAction).substring(0, 50) + '...' : (product.observations || product.nextAction)) : 'Sem observações'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}