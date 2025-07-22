'use client';

import { 
  Clock,
  Filter,
  RefreshCw,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  lastUpdated: Date;
  allExpanded: boolean;
  onToggleAll: () => void;
  onRefresh?: () => void;
}

export function DashboardHeader({ 
  lastUpdated, 
  allExpanded, 
  onToggleAll, 
  onRefresh 
}: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🎯 Product Maturity Pipeline
            </h1>
            <p className="mt-2 text-gray-600">
              AI-Powered Development Stage Tracking
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleAll}
            >
              {allExpanded ? (
                <>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Collapse All
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Expand All
                </>
              )}
            </Button>
            
            <Button 
              size="sm"
              onClick={onRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}