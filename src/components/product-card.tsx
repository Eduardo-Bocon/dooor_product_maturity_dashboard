'use client';

import { 
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  Activity,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

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

export function ProductCard({ product, onClick }: ProductCardProps) {
  const statusConfig = getStatusConfig(product.status);
  const StatusIcon = statusConfig.icon;
  const stageHoverColor = getStageHoverColor(product.stage);

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
            <p className="text-sm text-gray-600">{product.description}</p>
          </div>
          
        </div>

        <div className={`flex items-center space-x-2 p-2 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}>
          <StatusIcon className={`w-3 h-3 ${statusConfig.text}`} />
          <span className={`text-sm font-medium ${statusConfig.text}`}>
            {product.stage}→{product.targetStage} {statusConfig.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Readiness Progress */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Readiness</span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(product.readinessScore)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ${
                product.status === 'ready' ? 'bg-green-500' : 
                product.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${product.readinessScore}%` }}
            />
          </div>
        </div>

        {/* Exit Criteria */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Exit Criteria</h4>
          <div className="space-y-0.5">
            {Object.entries(product.criteria).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-1 text-sm">
                <span className={value ? 'text-green-500' : 'text-red-500'}>
                  {value ? '✓' : '✗'}
                </span>
                <span className="text-gray-600 capitalize text-sm">
                  {key.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
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
              <p className="text-sm font-medium text-gray-900 mb-0.5">Next Action</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.nextAction ? (product.nextAction.length > 50 ? product.nextAction.substring(0, 50) + '...' : product.nextAction) : 'No action defined'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}