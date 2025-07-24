'use client';

import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface StatsOverviewProps {
  products: Product[];
}

export function StatsOverview({ products }: StatsOverviewProps) {
  const stats = {
    totalProducts: products.length,
    readyToAdvance: products.filter(p => p.status === 'ready').length,
    blocked: products.filter(p => p.status === 'blocked').length,
    avgDaysInStage: Math.round(products.reduce((acc, p) => acc + p.daysInStage, 0) / products.length)
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="stats-card shadow-sm">
            <div className="stats-card-inner p-4 text-center h-20 flex flex-col justify-center">
              <div className="text-3xl font-bold text-gray-900">{stats.totalProducts}</div>
              <div className="text-sm text-gray-500 mt-1">Total Products</div>
            </div>
          </div>
          <div className="stats-card shadow-sm">
            <div className="stats-card-inner p-4 text-center h-20 flex flex-col justify-center">
              <div className="text-3xl font-bold text-green-600">{stats.readyToAdvance}</div>
              <div className="text-sm text-gray-500 mt-1">Ready to Advance</div>
            </div>
          </div>
          <div className="stats-card shadow-sm">
            <div className="stats-card-inner p-4 text-center h-20 flex flex-col justify-center">
              <div className="text-3xl font-bold text-red-600">{stats.blocked}</div>
              <div className="text-sm text-gray-500 mt-1">Blocked</div>
            </div>
          </div>
          <div className="stats-card shadow-sm ">
            <div className="stats-card-inner p-4 text-center h-20 flex flex-col justify-center ">
              <div className="text-3xl font-bold text-gray-900">{stats.avgDaysInStage}</div>
              <div className="text-sm text-gray-500 mt-1">Avg Days in Stage</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}