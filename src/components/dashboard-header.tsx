'use client';

import { 
  Clock,
  Filter,
  RefreshCw,
  Minimize2,
  Maximize2,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface DashboardHeaderProps {
  lastUpdated: Date;
  allExpanded: boolean;
  onToggleAll: () => void;
  onRefresh?: () => void;
  availableProjects: string[];
  selectedProjects: string[];
  onProjectFilter: (projects: string[]) => void;
}

export function DashboardHeader({ 
  lastUpdated, 
  allExpanded, 
  onToggleAll, 
  onRefresh,
  availableProjects,
  selectedProjects,
  onProjectFilter
}: DashboardHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleProjectToggle = (project: string) => {
    if (selectedProjects.includes(project)) {
      onProjectFilter(selectedProjects.filter(p => p !== project));
    } else {
      onProjectFilter([...selectedProjects, project]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === availableProjects.length) {
      onProjectFilter([]);
    } else {
      onProjectFilter([...availableProjects]);
    }
  };

  const getFilterButtonText = () => {
    if (selectedProjects.length === 0) return 'Filter';
    if (selectedProjects.length === 1) return selectedProjects[0].toUpperCase();
    return `${selectedProjects.length} Projects`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/dooor_black.svg"
              alt="Dooor Logo"
              width={120}
              height={33}
              className="h-8 w-auto"
            />
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Product Maturity Dashboard
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            <div className="relative" ref={filterRef}>
              <Button 
                variant="outline" 
                size="sm" 
                className='cursor-pointer'
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {getFilterButtonText()}
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              
              {isFilterOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white text-black border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                  <div className="p-3">
                    <div className="border-b border-gray-200 pb-2 mb-2">
                      <button
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded flex items-center space-x-2"
                        onClick={handleSelectAll}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProjects.length === availableProjects.length}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        />
                        <span className="font-medium">Select All</span>
                      </button>
                    </div>
                    {availableProjects.map((project) => (
                      <button
                        key={project}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-50 rounded flex items-center space-x-2"
                        onClick={() => handleProjectToggle(project)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProjects.includes(project)}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300"
                        />
                        <span>{project.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onToggleAll}
              className='cursor-pointer'
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
              className='cursor-pointer bg-black'
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