'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatsOverview } from '@/components/stats-overview';
import { StageColumn } from '@/components/stage-column';
import { ProductDetailsPopup } from '@/components/product-details-popup';
import { CreateProductModal } from '@/components/create-product-modal';
import { Product, Stage, StageId } from '@/types';
import { 
  canTransitionToNextStage, 
  calculateReadinessScore,
  getNextStage,
  Stage as MaturityStage 
} from '@/lib/maturity-framework';

const ProductMaturityDashboard = () => {
  const backendUrl = 'http://localhost:8000';
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStages, setExpandedStages] = useState({
    'V1': true,
    'V2': true,
    'V3': true,
    'V4': true,
    'V5': true
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProjectsFilter, setSelectedProjectsFilter] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Get unique project names for filter
  const availableProjects = [...new Set(products.map(product => product.name))].sort();
  
  // Filter products based on selected projects
  const filteredProducts = selectedProjectsFilter.length > 0 
    ? products.filter(product => selectedProjectsFilter.includes(product.name))
    : products;

  // API function to fetch all products data
  const fetchProductsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${backendUrl}/maturity/products`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      // Extract products array from response object
      const productsArray = data.products || [];
      console.log('Products array:', productsArray);
      
      // Check if products is an array
      if (!Array.isArray(productsArray)) {
        throw new Error('API response products is not an array');
      }
      
      // Ensure all products have safe default values and enhanced calculations
      const safeProducts = productsArray.map((product: any) => {
        const productStage = product.stage || 'V1';
        const criteria = product.criteria || {};
        
        // Calculate enhanced readiness score using maturity framework
        const calculatedReadinessScore = calculateReadinessScore(
          productStage as MaturityStage, 
          criteria
        );
        
        // Get the next stage in sequence
        const nextStage = getNextStage(productStage as MaturityStage);
        
        // Check transition readiness
        const transitionResult = canTransitionToNextStage(
          productStage as MaturityStage,
          criteria
        );
        
        // Determine status based on transition readiness
        let status = product.status;
        if (!status) {
          if (transitionResult.canTransition) {
            status = 'ready';
          } else if (transitionResult.blockingCriteria.length > 0) {
            status = 'blocked';
          } else {
            status = 'in-progress';
          }
        }
        
        return {
          ...product,
          blockers: product.blockers || [],
          nextAction: product.nextAction || 'No action defined',
          description: product.description || 'No description',
          stage: productStage,
          targetStage: nextStage || 'Final',
          daysInStage: product.daysInStage || 0,
          readinessScore: calculatedReadinessScore,
          status: status,
          transitionResult: transitionResult
        };
      });
      
      setProducts(safeProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products data');
      console.error('Error fetching products data:', err);
    } finally {
      setLoading(false);
    }
  };

  console.log('All products:', products);

  const stages: Stage[] = [
    { id: 'V1', name: 'V1', label: 'Demo/Conceito', color: 'amber' },
    { id: 'V2', name: 'V2', label: 'Protótipo', color: 'blue' },
    { id: 'V3', name: 'V3', label: 'Alpha/Beta', color: 'purple' },
    { id: 'V4', name: 'V4', label: 'Pre-Production', color: 'cyan' },
    { id: 'V5', name: 'V5', label: 'Produção', color: 'green' }
  ];

  const getStageProducts = (stageId: string) => {
    const stageProducts = filteredProducts.filter(product => product.stage === stageId);
    console.log(`Stage ${stageId} products:`, stageProducts);
    return stageProducts;
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
    fetchProductsData();
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const handleObservationsUpdate = async (productId: string, observations: string) => {
    try {
      const response = await fetch(`${backendUrl}/maturity/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ observations: observations })
      });

      if (!response.ok) {
        throw new Error(`Failed to update observations: ${response.status}`);
      }

      console.log(`Successfully updated observations for ${productId}`);
      
      // Refresh products data to get updated state
      await fetchProductsData();
      
      // Update the selected product if it's still open
      if (selectedProduct && selectedProduct.id === productId) {
        const updatedProduct = products.find(p => p.id === productId);
        if (updatedProduct) {
          setSelectedProduct(updatedProduct);
        }
      }
    } catch (err) {
      console.error('Error updating observations:', err);
      setError(err instanceof Error ? err.message : 'Failed to update observations');
    }
  };

  const handleStageChange = async (productId: string, newStage: string) => {
    // Find the product to show warning for transitions without met criteria
    const product = products.find(p => p.id === productId);
    if (product) {
      const transitionResult = canTransitionToNextStage(
        product.stage as MaturityStage,
        product.criteria || {}
      );
      
      // Show warning for forward transitions without met criteria, but allow them
      const stages = ['V1', 'V2', 'V3', 'V4', 'V5'];
      const currentIndex = stages.indexOf(product.stage);
      const newIndex = stages.indexOf(newStage);
      
      if (newIndex > currentIndex && !transitionResult.canTransition) {
        const blockingCriteria = transitionResult.blockingCriteria.join(', ');
        console.warn(`Warning: Transitioning to ${newStage} without meeting criteria: ${blockingCriteria}`);
        // Continue with transition despite unmet criteria
      }
    }
    
    try {
      // Try the documented endpoint first
      let response = await fetch(`${backendUrl}/maturity/products/${productId}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage: newStage })
      });

      // If 404, try alternative endpoint structure
      if (!response.ok && response.status === 404) {
        response = await fetch(`${backendUrl}/maturity/products/${productId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stage: newStage })
        });
      }

      // If still not working, try PUT method
      if (!response.ok && response.status === 404) {
        response = await fetch(`${backendUrl}/maturity/products/${productId}/stage`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stage: newStage })
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to update product stage: ${response.status} - ${response.statusText}`);
      }

      console.log(`Successfully updated ${productId} to stage ${newStage}`);

      // Refresh products data to get updated state
      await fetchProductsData();
      
      // Update the selected product if it's still open
      if (selectedProduct && selectedProduct.id === productId) {
        const updatedProduct = products.find(p => p.id === productId);
        if (updatedProduct) {
          setSelectedProduct(updatedProduct);
        }
      }
      
      // Close popup after successful stage change
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error updating product stage:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product stage');
    }
  };

  const handleCreateProduct = async (productData: { id: string; name: string; description: string }) => {
    try {
      const response = await fetch(`${backendUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status} - ${response.statusText}`);
      }

      console.log(`Successfully created product: ${productData.name}`);
      
      // Refresh products data to include the new product
      await fetchProductsData();
      
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err; // Re-throw so the modal can handle it
    }
  };

  useEffect(() => {
    // Fetch all products data on component mount
    fetchProductsData();
    
    const timer = setInterval(() => {
      setLastUpdated(new Date());
      // Refresh all products data every minute
      fetchProductsData();
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${selectedProduct ? 'blur-sm' : ''}`}>
        <DashboardHeader
          lastUpdated={lastUpdated}
          allExpanded={Object.values(expandedStages).every(Boolean)}
          onToggleAll={handleToggleAll}
          onRefresh={handleRefresh}
          availableProjects={availableProjects}
          selectedProjects={selectedProjectsFilter}
          onProjectFilter={setSelectedProjectsFilter}
          onCreateProduct={() => setIsCreateModalOpen(true)}
        />
        
        <StatsOverview products={filteredProducts} />
      
      {/* Loading and Error States */}
      {loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800 text-sm">Loading products data from backend...</p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Backend Connection Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <p className="text-xs text-red-600 mt-2">Make sure your backend is running at {backendUrl}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                onProductClick={handleProductClick}
              />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            Feito por: Boçon 😎
          </p>
        </div>
      </div>

      </div>

      {/* Product Details Popup */}
      {selectedProduct && (
        <ProductDetailsPopup
          product={selectedProduct}
          onClose={handleClosePopup}
          onStageChange={handleStageChange}
          onObservationsUpdate={handleObservationsUpdate}
        />
      )}
      
      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProduct={handleCreateProduct}
      />
    </div>
  );
};

export default ProductMaturityDashboard;