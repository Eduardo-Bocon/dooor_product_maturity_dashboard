'use client';

import { useState } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProduct: (productData: { id: string; name: string; description: string }) => Promise<void>;
}

export function CreateProductModal({ isOpen, onClose, onCreateProduct }: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.name.trim()) return;

    // Validate ID format (alphanumeric and lowercase only)
    const id = formData.id.trim();
    if (!/^[a-z0-9]+$/.test(id)) {
      alert('Product ID must be alphanumeric and lowercase only (no spaces or special characters)');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateProduct({
        ...formData,
        id: id.toLowerCase() // Ensure lowercase
      });
      setFormData({ id: '', name: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Failed to create product:', error);
      alert(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ id: '', name: '', description: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Product">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product-id" className="block text-sm font-medium text-gray-700 mb-1">
            Product ID *
          </label>
          <input
            id="product-id"
            type="text"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="e.g., symphony"
            pattern="[a-z0-9]+"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be alphanumeric and lowercase only (no spaces or special characters)
          </p>
        </div>
        
        <div>
          <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            id="product-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="e.g., Symphony"
            required
          />
        </div>
        
        <div>
          <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="product-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            placeholder="e.g., New orchestration product"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.id.trim() || !formData.name.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}