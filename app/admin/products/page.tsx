'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminProducts, getAdminCategories, createProduct, updateProduct, deleteProduct } from '@/app/actions/admin/dashboard';

interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  categoryId: number;
  description: string;
  condition: string;
  status: string;
  sku: string;
  price: number;
  cost: number;
  originalPrice: number;
  stock: number;
  specs: any;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  categoryName?: string;
}

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<any>({});
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadData();
  }, [search, filterBrand, filterCategory, filterStatus, sortField, sortOrder, page]);

  const defaultCategories = [
    { id: 1, name: 'Servers', slug: 'servers' },
    { id: 2, name: 'Storage', slug: 'storage' },
    { id: 3, name: 'Networking', slug: 'networking' },
    { id: 4, name: 'Components', slug: 'components' },
  ];

  const displayCategories = categoriesList.length > 0 ? categoriesList : defaultCategories;

  async function loadData() {
    setLoading(true);
    try {
      const result = await getAdminProducts(search, filterBrand, filterCategory, filterStatus, sortField, sortOrder, page, ITEMS_PER_PAGE);
      setProductsList(result);
      setCategoriesLoading(true);
      const cats = await getAdminCategories();
      setCategoriesList(cats);
      setCategoriesLoading(false);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    try {
      const price = formData.price === '' ? 0 : formData.price;
      const cost = formData.cost === '' ? 0 : formData.cost;
      const originalPrice = formData.originalPrice === '' ? 0 : formData.originalPrice;
      const stock = formData.stock === '' ? 0 : formData.stock;
      const data = {
        ...formData,
        price,
        cost,
        originalPrice,
        stock,
        specs: JSON.stringify(formData.specs || {}),
        imageUrls: formData.imageUrls || [],
      };
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({});
      loadData();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      model: product.model,
      categoryId: product.categoryId,
      description: product.description,
      condition: product.condition,
      status: product.status,
      sku: product.sku,
      price: product.price,
      cost: product.cost,
      originalPrice: product.originalPrice,
      stock: product.stock,
      specs: product.specs,
      imageUrls: product.imageUrls || [],
    });
    setShowModal(true);
  };

  const openNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      model: '',
      categoryId: '',
      description: '',
      condition: 'refurbished',
      status: 'active',
      sku: '',
      price: '',
      cost: '',
      originalPrice: '',
      stock: '',
      specs: {},
      imageUrls: [],
    });
    setShowModal(true);
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    draft: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your product inventory</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">+ Add Product</button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or SKU..." className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <select value={filterBrand} onChange={(e) => { setFilterBrand(e.target.value); setPage(1); }} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Brands</option>
            {['Dell', 'HP', 'Lenovo', 'Cisco', 'NetApp', 'HPE', 'Intel', 'Samsung', 'Crucial', 'Broadcom', 'Seagate'].map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Categories</option>
            {categoriesLoading ? (
              <option value="">Loading...</option>
            ) : displayCategories.length === 0 ? (
              <option value="">No categories available</option>
            ) : (
              displayCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
            )}
          </select>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : productsList.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No products found</td></tr>
              ) : (
                productsList.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{product.brand}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{product.categoryName || '-'}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">₱{product.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : product.stock > 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${statusColors[product.status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>{product.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(product)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Page {page}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors">Previous</button>
          <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Next</button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Product Name</label>
                <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product Name" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Brand</label>
                <input value={formData.brand || ''} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="Brand" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Model</label>
                <input value={formData.model || ''} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="Model" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
                <select value={formData.categoryId || ''} onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Category</option>
                  {categoriesLoading ? (
                    <option value="">Loading...</option>
                  ) : displayCategories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    displayCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">SKU</label>
                <input value={formData.sku || ''} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="SKU" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Price</label>
                <input value={formData.price === 0 ? '' : formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} type="number" placeholder="0.00" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Cost</label>
                <input value={formData.cost === 0 ? '' : formData.cost} onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })} type="number" placeholder="0.00" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Original Price</label>
                <input value={formData.originalPrice === 0 ? '' : formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })} type="number" placeholder="0.00" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Stock</label>
                <input value={formData.stock === 0 ? '' : formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} type="number" placeholder="0" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Condition</label>
                <select value={formData.condition || 'refurbished'} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500">
                  <option value="refurbished">Refurbished</option>
                  <option value="certified-pre-owned">Certified Pre-Owned</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                <select value={formData.status || 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                <textarea value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" rows={3} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Image URLs (up to 10, one per line)
                </label>
                <textarea
                  value={(formData.imageUrls || []).join('\n')}
                  onChange={(e) => {
                    const urls = e.target.value.split('\n').filter(u => u.trim()).slice(0, 10);
                    setFormData({ ...formData, imageUrls: urls });
                  }}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={4}
                  className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 w-full font-mono text-xs focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{(formData.imageUrls || []).length}/10 images</p>
                {(formData.imageUrls || []).length > 0 && (
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {(formData.imageUrls || []).map((url: string, i: number) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Preview ${i + 1}`} className="w-full h-16 object-cover rounded border border-gray-300 dark:border-gray-600" />
                        <button
                          onClick={() => {
                            const newUrls = [...(formData.imageUrls || [])];
                            newUrls.splice(i, 1);
                            setFormData({ ...formData, imageUrls: newUrls });
                          }}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">Save</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
