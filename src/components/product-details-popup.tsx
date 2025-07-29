'use client';

import React, { useState } from 'react';
import { 
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Activity,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  Info,
  FileWarning,
  MessageCircleWarning,
  CircleAlert,
  Edit2,
  Save
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { 
  canTransitionToNextStage, 
  getRequiredCriteriaForTransition,
  getStageTransitionDescription,
  getNextStage,
  Stage as MaturityStage 
} from '@/lib/maturity-framework';

interface ProductDetailsPopupProps {
  product: Product;
  onClose: () => void;
  onStageChange: (productId: string, newStage: string) => void;
  onObservationsUpdate?: (productId: string, observations: string) => void;
}

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

const getStageNavigation = (currentStage: string) => {
  const stages = ['V1', 'V2', 'V3', 'V4', 'V5'];
  const currentIndex = stages.indexOf(currentStage);
  
  return {
    canGoBack: currentIndex > 0,
    canGoForward: currentIndex < stages.length - 1,
    previousStage: currentIndex > 0 ? stages[currentIndex - 1] : null,
    nextStage: currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null
  };
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

export function ProductDetailsPopup({ product, onClose, onStageChange, onObservationsUpdate }: ProductDetailsPopupProps) {
  const [isChangingStage, setIsChangingStage] = useState(false);
  const [isEditingObservations, setIsEditingObservations] = useState(false);
  const [isSavingObservations, setIsSavingObservations] = useState(false);
  const [observations, setObservations] = useState(product.observations || product.nextAction || '');
  const statusConfig = getStatusConfig(product.status);
  const StatusIcon = statusConfig.icon;
  const navigation = getStageNavigation(product.stage);
  
  // Get next stage and enhanced transition information using maturity framework
  const nextStage = getNextStage(product.stage as MaturityStage);
  const transitionResult = canTransitionToNextStage(
    product.stage as MaturityStage,
    product.criteria || {}
  );
  const requiredCriteria = getRequiredCriteriaForTransition(product.stage as MaturityStage);
  const transitionDescription = getStageTransitionDescription(product.stage as MaturityStage);
  
  // Calculate progress percentage for next stage
  const nextStageProgress = requiredCriteria.length > 0 
    ? Math.round((requiredCriteria.filter(criterion => (product.criteria as any)[criterion] === true).length / requiredCriteria.length) * 100)
    : 100; // 100% if no criteria required (final stage)

  const handleStageChange = async (newStage: string) => {
    setIsChangingStage(true);
    try {
      await onStageChange(product.id, newStage);
    } finally {
      setIsChangingStage(false);
    }
  };

  const handleObservationsSave = async () => {
    if (onObservationsUpdate) {
      setIsSavingObservations(true);
      try {
        await onObservationsUpdate(product.id, observations);
        setIsEditingObservations(false);
      } catch (error) {
        console.error('Failed to update observations:', error);
      } finally {
        setIsSavingObservations(false);
      }
    }
  };

  const handleObservationsCancel = () => {
    setObservations(product.observations || product.nextAction || '');
    setIsEditingObservations(false);
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {isChangingStage && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Updating stage...</span>
            </div>
          </div>
        )}
        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 uppercase">
                    {product.name}
                  </h2>
                  {product.url && (
                    <a 
                      href={product.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
                  <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                  <span className={`text-sm font-medium ${statusConfig.text}`}>
                    {product.stage} → {nextStage || 'Final'} • {statusConfig.label}
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    {product.daysInStage} days in stage
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stage Navigation Buttons */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <Button
                variant="outline"
                onClick={() => navigation.previousStage && handleStageChange(navigation.previousStage)}
                disabled={!navigation.canGoBack || isChangingStage}
                className="flex items-center space-x-2 cursor-pointer hover:-translate-y-1"
              >
                {isChangingStage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
                <span>
                  {isChangingStage ? 'Moving...' : navigation.previousStage ? `Move to ${navigation.previousStage}` : 'Already at first stage'}
                </span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigation.nextStage && handleStageChange(navigation.nextStage)}
                disabled={!navigation.canGoForward || isChangingStage}
                className={`flex items-center space-x-2 cursor-pointer hover:-translate-y-1`}
                
              >
                <span>
                  {isChangingStage ? 'Moving...' : navigation.nextStage ? `Move to ${navigation.nextStage}` : 'Already at final stage'}
                </span>
                {isChangingStage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : navigation.nextStage && !transitionResult.canTransition ? (
                  <CircleAlert className="w-4 h-4 text-red-500" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Transition Information */}
            {nextStage && (
              <div className={`p-4 rounded-lg border ${
                transitionResult.canTransition ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start space-x-2">
                  <Info className={`w-4 h-4 mt-0.5 ${
                    transitionResult.canTransition ? 'text-green-600' : 'text-yellow-600'
                  }`} />
                  <div>
                    <h4 className={`font-medium text-sm ${
                      transitionResult.canTransition ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {transitionResult.canTransition ? 'Pronto para a proxima etapa' : 'Alerta de transição'}
                    </h4>
                    <p className={`text-sm mt-1 ${
                      transitionResult.canTransition ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      {transitionResult.canTransition 
                        ? `Todos os critérios para ${nextStage} estão concluidos.`
                        : `Ainda falta: ${transitionResult.blockingCriteria.map(getCriteriaLabel).join(', ')}.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Readiness Progress */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Progresso para o proximo estagio
                </h3>
                <span className="text-2xl font-bold text-gray-900">{nextStageProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    nextStageProgress === 100 ? 'bg-green-500' : 
                    nextStageProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${nextStageProgress}%` }}
                />
              </div>
              {transitionResult.nextStage && (
                <div className="mt-2 text-sm text-gray-600">
                  {requiredCriteria.filter(criterion => (product.criteria as any)[criterion] === true).length} de {requiredCriteria.length} critérios atendidos
                </div>
              )}
            </div>

            {/* Exit Criteria */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Exit Criteria</h3>
                {nextStage && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Para {nextStage}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              {/* Required criteria for next stage */}
              {requiredCriteria.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Requerido para próxima fase:
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {requiredCriteria.map((criterionKey) => {
                      const value = (product.criteria as any)[criterionKey];
                      const isBlocking = transitionResult.blockingCriteria.includes(criterionKey);
                      
                      return (
                        <div key={criterionKey} className={`flex items-center space-x-3 p-2 rounded ${
                          isBlocking ? 'bg-red-50 border border-red-200' : value ? 'bg-green-50' : 'bg-gray-50'
                        }`}>
                          {value ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${
                            isBlocking ? 'text-red-700' : value ? 'text-green-700' : 'text-gray-600'
                          }`}>
                            {getCriteriaLabel(criterionKey)}
                          </span>
                          
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Other criteria */}
              {Object.entries(product.criteria).filter(([key]) => !requiredCriteria.includes(key)).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Outros critérios:
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(product.criteria)
                      .filter(([key]) => !requiredCriteria.includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-3 p-2 rounded bg-gray-50 opacity-75">
                          {value ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className={`text-sm ${value ? 'text-gray-700' : 'text-gray-500'}`}>
                            {getCriteriaLabel(key)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics */}
            {Object.keys(product.metrics).length > 0 && (
              <div className="bg-white border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {value !== null ? value : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blockers */}
            {product.blockers && product.blockers.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Current Blockers
                </h3>
                <div className="space-y-2">
                  {product.blockers.map((blocker, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-red-200">
                      <p className="text-sm text-red-700">• {blocker}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observations */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Observações
                </h3>
                {!isEditingObservations && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingObservations(true)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {isEditingObservations ? (
                <div className="space-y-3">
                  <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    disabled={isSavingObservations}
                    className="w-full p-3 border border-blue-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:bg-gray-100"
                    rows={4}
                    placeholder="Adicione suas observações aqui..."
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleObservationsSave}
                      disabled={isSavingObservations}
                      className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingObservations ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleObservationsCancel}
                      disabled={isSavingObservations}
                      className='cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-blue-700 leading-relaxed">
                  {observations || 'Sem observações'}
                </p>
              )}
            </div>

            {/* Timeline Info */}
            {product.kickoffDate && (
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Timeline
                </h3>
                <p className="text-sm text-gray-600">
                  Kickoff Date: {new Date(product.kickoffDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}