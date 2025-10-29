import React, { useState } from 'react';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../app/api';

export default function AdminProducts() {
  const { data, isLoading, error, refetch } = useGetProductsQuery({});
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert('Please enter a valid stock quantity');
      return;
    }
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images ? formData.images.split(',').map(url => url.trim()).filter(url => url) : []
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...productData }).unwrap();
        setEditingProduct(null);
      } else {
        await createProduct(productData).unwrap();
      }
      
      setFormData({ title: '', description: '', price: '', stock: '', category: '', images: '' });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Product operation failed:', error);
      alert('Operation failed. Please try again.');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      images: product.images?.join(', ') || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteProduct(productId).unwrap();
      refetch();
    } catch (error) {
      console.error('Product deletion failed:', error);
      alert('Deletion failed. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ title: '', description: '', price: '', stock: '', category: '', images: '' });
  };

  if (isLoading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>
        <p>Error loading products</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h2>Admin - Product Management</h2>
        <button 
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Add New Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div style={{
          padding: 20,
          border: '1px solid #ddd',
          borderRadius: 8,
          backgroundColor: '#f8f9fa',
          marginBottom: 30
        }}>
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
              <div>
                <label>Title *:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 5 }}
                />
              </div>
              <div>
                <label>Category *:</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 5 }}
                />
              </div>
              <div>
                <label>Price *:</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  min="0"
                  style={{ width: '100%', padding: 8, marginTop: 5 }}
                />
              </div>
              <div>
                <label>Stock *:</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  min="0"
                  style={{ width: '100%', padding: 8, marginTop: 5 }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Description *:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                style={{ width: '100%', padding: 8, marginTop: 5 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Images (comma-separated URLs):</label>
              <input
                type="text"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                style={{ width: '100%', padding: 8, marginTop: 5 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" onClick={handleCancel} style={{
                padding: '10px 20px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div style={{ display: 'grid', gap: 15 }}>
        {data?.products?.map((product: any) => (
          <div key={product._id} style={{
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            backgroundColor: 'white',
            display: 'flex',
            gap: 20
          }}>
            {/* Product Image */}
            <div>
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                />
              ) : (
                <div style={{ 
                  width: 100, 
                  height: 100, 
                  backgroundColor: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: 4,
                  fontSize: 12,
                  color: '#999'
                }}>
                  No Image
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{product.title}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{product.description}</p>
              <div style={{ display: 'flex', gap: 20, marginBottom: 10 }}>
                <span><strong>Price:</strong> ${product.price}</span>
                <span><strong>Stock:</strong> {product.stock}</span>
                <span><strong>Category:</strong> {product.category}</span>
                {product.ratingCount > 0 && (
                  <span><strong>Rating:</strong> {product.ratingAvg.toFixed(1)} ⭐ ({product.ratingCount})</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Created: {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button 
                onClick={() => handleEdit(product)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f39c12',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(product._id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {data?.products?.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          <p>No products found. Add your first product!</p>
        </div>
      )}
    </div>
  );
}
