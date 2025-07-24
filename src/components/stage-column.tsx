'use client';

import { 
  Clock,
  AlertCircle,
  CheckCircle,
  Target,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from './product-card';
import { Product, Stage, StageColor } from '@/types';

interface StageColumnProps {
  stage: Stage;
  products: Product[];
  isExpanded: boolean;
  onToggle: () => void;
  onProductClick?: (product: Product) => void;
}


const getStageColorClasses = (color: StageColor) => {
  const colorMap = {
    amber: 'border-t-amber-500',
    blue: 'border-t-blue-500',
    purple: 'border-t-purple-500',
    cyan: 'border-t-cyan-500',
    green: 'border-t-green-500'
  };
  return colorMap[color] || 'border-t-gray-500';
};

const getTitleColorClass = (color: StageColor) => {
  const colorMap = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    cyan: 'text-cyan-600',
    green: 'text-green-600'
  };
  return colorMap[color] || 'text-gray-600';
};

export function StageColumn({ stage, products, isExpanded, onToggle, onProductClick }: StageColumnProps) {
  const stageColorClasses = getStageColorClasses(stage.color);
  const titleColorClass = getTitleColorClass(stage.color);

  return (
    <Card className={`border-t-4 ${stageColorClasses} bg-white shadow-sm transition-all duration-300 ${
      isExpanded ? 'min-h-96' : 'h-auto'
    } flex flex-col`}>
      {/* Stage Header - Always Visible */}
      <CardHeader className="border-b border-gray-200">
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onToggle}
            className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors group"
          >
            <h2 className={`text-2xl font-bold ${titleColorClass} mb-1`}>
              {stage.name}
            </h2>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            )}
          </Button>
          <p className="text-sm text-gray-600 uppercase tracking-wide">
            {stage.label}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardHeader>

      {/* Products - Collapsible */}
      {isExpanded && (
        <CardContent className="p-3 space-y-3 flex-1 overflow-y-auto">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => onProductClick?.(product)}
              />
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs">No products</p>
            </div>
          )}
        </CardContent>
      )}

      {/* Collapsed State Summary */}
      {!isExpanded && products.length > 0 && (
        <CardContent className="p-3 border-t">
          <div className="text-center space-y-1">
            <div className="flex justify-center space-x-4 text-xs text-gray-600">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>{products.filter(p => p.status === 'ready').length} Ready</span>
              </span>
              <span className="flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span>{products.filter(p => p.status === 'blocked').length} Blocked</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-yellow-500" />
                <span>{products.filter(p => p.status === 'in-progress').length} Active</span>
              </span>
            </div>
            {/* Product Names as Tags */}
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {products.map(product => (
                <Badge 
                  key={product.id}
                  variant={
                    product.status === 'ready' ? 'default' :
                    product.status === 'blocked' ? 'destructive' :
                    'secondary'
                  }
                  className="text-xs"
                >
                  {product.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      )}

      {/* Collapsed Empty State */}
      {!isExpanded && products.length === 0 && (
        <CardContent className="p-3 border-t">
          <div className="text-center">
            <p className="text-xs text-gray-500">Empty</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}