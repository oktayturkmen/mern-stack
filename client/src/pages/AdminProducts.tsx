import React, { useState } from 'react';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useUploadImagesMutation } from '../app/api';

export default function AdminProducts() {
  const { data, isLoading, error, refetch } = useGetProductsQuery({});
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadImages, { isLoading: isUploading }] = useUploadImagesMutation();
  
  // Ön tanımlı kategoriler (dropdown için)
  const categories = [
    'Çantalar',
    'Bardak',
    'Takılar',
    'Elektronik Eşyalar',
    'Ayakkabılar',
    'Şapkalar',
    'Kapüşonlu Üstler',
    'Ceketler',
    'Çocuklar',
    'Gömlekler'
  ];
  
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

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fd = new FormData();
    Array.from(files).forEach((file) => fd.append('files', file));
    try {
      const res = await uploadImages(fd).unwrap();
      const urls = res.images || [];
      setFormData((prev) => ({
        ...prev,
        images: [prev.images, urls.join(', ')].filter(Boolean).join(', ')
      }));
      alert('Görseller yüklendi. URL’ler forma eklendi.');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Görsel yükleme başarısız', e);
      alert('Görsel yükleme başarısız.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category.trim()) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Lütfen geçerli bir fiyat girin.');
      return;
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert('Lütfen geçerli bir stok miktarı girin.');
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
      console.error('Ürün işlemi başarısız oldu:', error);
      alert('İşlem başarısız. Lütfen tekrar deneyin.');
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
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    
    try {
      await deleteProduct(productId).unwrap();
      refetch();
    } catch (error) {
      console.error('Ürün silme işlemi başarısız oldu:', error);
      alert('Silme işlemi başarısız. Lütfen tekrar deneyin.');
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
        <p>Ürünler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: 'red' }}>
        <p>Ürünler yüklenirken hata oluştu</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h2>Yönetici - Ürün Yönetimi</h2>
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
          Yeni Ürün Ekle
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
          <h3>{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
              <div>
                <label>Başlık *:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 5 }}
                />
              </div>
              <div>
                <label>Kategori *:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 5 }}
                >
                  <option value="" disabled>Bir kategori seçin</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Fiyat ($) *:</label>
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
                <label>Stok *:</label>
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
              <label>Açıklama *:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                style={{ width: '100%', padding: 8, marginTop: 5 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label>Resimler:</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 5, flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <button type="button" disabled={isUploading} style={{ padding: '8px 12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: 4, cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                  {isUploading ? 'Yükleniyor...' : 'Bilgisayardan Yükle'}
                </button>
              </div>
              <input
                type="text"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="Yüklenen URL’ler burada listelenir veya manuel ekleyin (virgülle)"
                style={{ width: '100%', padding: 8, marginTop: 8 }}
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
                {editingProduct ? 'Ürünü Güncelle' : 'Ürün Oluştur'}
              </button>
              <button type="button" onClick={handleCancel} style={{
                padding: '10px 20px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}>
                İptal
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
                  Resim Yok
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{product.title}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{product.description}</p>
              <div style={{ display: 'flex', gap: 20, marginBottom: 10 }}>
                <span><strong>Fiyat:</strong> ${product.price}</span>
                <span><strong>Stok:</strong> {product.stock}</span>
                <span><strong>Kategori:</strong> {product.category}</span>
                {product.ratingCount > 0 && (
                  <span><strong>Puan:</strong> {product.ratingAvg.toFixed(1)} ⭐ ({product.ratingCount})</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Oluşturulma: {new Date(product.createdAt).toLocaleDateString('tr-TR')}
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
                Düzenle
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
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {data?.products?.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>
          <p>Hiç ürün yok. Yeni ürün ekleyin!</p>
        </div>
      )}
    </div>
  );
}
