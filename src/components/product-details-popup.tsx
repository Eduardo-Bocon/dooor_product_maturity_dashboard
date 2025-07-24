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
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductDetailsPopupProps {
  product: Product;
  onClose: () => void;
  onStageChange: (productId: string, newStage: string) => void;
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

export function ProductDetailsPopup({ product, onClose, onStageChange }: ProductDetailsPopupProps) {
  const [isChangingStage, setIsChangingStage] = useState(false);
  const statusConfig = getStatusConfig(product.status);
  const StatusIcon = statusConfig.icon;
  const navigation = getStageNavigation(product.stage);

  const handleStageChange = async (newStage: string) => {
    setIsChangingStage(true);
    try {
      await onStageChange(product.id, newStage);
    } finally {
      setIsChangingStage(false);
    }
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
                <p className="text-gray-600 text-[14px] mb-4">{product.description}</p>
                
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
                  <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                  <span className={`text-sm font-medium ${statusConfig.text}`}>
                    {product.stage} → {product.targetStage} • {statusConfig.label}
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
                className="text-gray-400 hover:text-gray-600"
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
                className="flex items-center space-x-2 cursor-pointer"
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
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span>
                  {isChangingStage ? 'Moving...' : navigation.nextStage ? `Move to ${navigation.nextStage}` : 'Already at final stage'}
                </span>
                {isChangingStage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Readiness Progress */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Readiness Score</h3>
                <span className="text-2xl font-bold text-gray-900">{product.readinessScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    product.status === 'ready' ? 'bg-green-500' : 
                    product.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${product.readinessScore}%` }}
                />
              </div>
            </div>

            {/* Exit Criteria */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Exit Criteria</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(product.criteria).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <span className={`text-lg ${value ? 'text-green-500' : 'text-red-500'}`}>
                      {value ? '✓' : '✗'}
                    </span>
                    <span className={`text-sm ${value ? 'text-gray-700' : 'text-gray-500'} capitalize`}>
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
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

            {/* Next Action */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Next Action
              </h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                {product.nextAction || 'No action defined'}
              </p>
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