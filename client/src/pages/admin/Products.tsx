import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Tag, X, Sparkles, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { useProductStore, Product } from '../../store/useProductStore';

export const Products: React.FC = () => {
  const { t } = useTranslation();
  const { products, isLoading, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();

  // Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('boxes');
  const [formImage, setFormImage] = useState('/ref/IMG-20260615-WA0025.jpg');
  const [formBadge, setFormBadge] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formPrepSteps, setFormPrepSteps] = useState('');

  // Discount Form Fields State
  const [discType, setDiscType] = useState<'percent' | 'fixed'>('percent');
  const [discValue, setDiscValue] = useState('');
  const [discExpiry, setDiscExpiry] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openAddModal = () => {
    setFormName('');
    setFormPrice('');
    setFormDescription('');
    setFormCategory('boxes');
    setFormImage('/ref/IMG-20260615-WA0025.jpg');
    setFormBadge('');
    setFormIngredients('');
    setFormPrepSteps('');
    setAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormDescription(product.description);
    setFormCategory(product.category);
    setFormImage(product.image);
    setFormBadge(product.badge || '');
    setFormIngredients(product.ingredients.join('\n'));
    setFormPrepSteps(product.prepSteps.join('\n'));
    setEditModalOpen(true);
  };

  const openDiscountModal = (product: Product) => {
    setSelectedProduct(product);
    if (product.discount) {
      setDiscType(product.discount.type);
      setDiscValue(product.discount.value.toString());
      setDiscExpiry(product.discount.expiryDate ? product.discount.expiryDate.split('T')[0] : '');
    } else {
      setDiscType('percent');
      setDiscValue('');
      setDiscExpiry('');
    }
    setDiscountModalOpen(true);
  };

  // Submit Operations
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    try {
      await addProduct({
        name: formName,
        price: Number(formPrice),
        description: formDescription,
        category: formCategory,
        image: formImage,
        badge: formBadge || null,
        ingredients: formIngredients.split('\n').map(x => x.trim()).filter(Boolean),
        prepSteps: formPrepSteps.split('\n').map(x => x.trim()).filter(Boolean),
        discount: null
      });
      toast.success(t('language') === 'en' ? 'Product added successfully' : 'تم إضافة المنتج بنجاح');
      setAddModalOpen(false);
    } catch (err) {
      toast.error(t('language') === 'en' ? 'Failed to add product' : 'فشل إضافة المنتج');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !formName || !formPrice) return;

    try {
      await updateProduct(selectedProduct.id, {
        name: formName,
        price: Number(formPrice),
        description: formDescription,
        category: formCategory,
        image: formImage,
        badge: formBadge || null,
        ingredients: formIngredients.split('\n').map(x => x.trim()).filter(Boolean),
        prepSteps: formPrepSteps.split('\n').map(x => x.trim()).filter(Boolean),
      });
      toast.success(t('language') === 'en' ? 'Product updated successfully' : 'تم تعديل المنتج بنجاح');
      setEditModalOpen(false);
    } catch (err) {
      toast.error(t('language') === 'en' ? 'Failed to update product' : 'فشل تعديل المنتج');
    }
  };

  const handleDeleteClick = async (product: Product) => {
    const confirmMsg = `${t('admin.products.deleteConfirm')}\n(${product.name})`;
    if (window.confirm(confirmMsg)) {
      try {
        await deleteProduct(product.id);
        toast.success(t('language') === 'en' ? 'Product deleted successfully' : 'تم حذف المنتج بنجاح');
      } catch (err) {
        toast.error(t('language') === 'en' ? 'Failed to delete product' : 'فشل حذف المنتج');
      }
    }
  };

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !discValue) return;

    try {
      await updateProduct(selectedProduct.id, {
        discount: {
          type: discType,
          value: Number(discValue),
          expiryDate: discExpiry ? new Date(discExpiry).toISOString() : undefined
        }
      });
      toast.success(t('language') === 'en' ? 'Discount applied successfully' : 'تم تطبيق الخصم بنجاح');
      setDiscountModalOpen(false);
    } catch (err) {
      toast.error(t('language') === 'en' ? 'Failed to apply discount' : 'فشل تطبيق الخصم');
    }
  };

  const handleRemoveDiscount = async () => {
    if (!selectedProduct) return;

    try {
      await updateProduct(selectedProduct.id, {
        discount: null
      });
      toast.success(t('language') === 'en' ? 'Discount removed successfully' : 'تم إزالة الخصم بنجاح');
      setDiscountModalOpen(false);
    } catch (err) {
      toast.error(t('language') === 'en' ? 'Failed to remove discount' : 'فشل إزالة الخصم');
    }
  };

  const lang = t('language');

  return (
    <div className="space-y-6 select-none">
      
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-850 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">{t('admin.nav.products')}</h2>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'en' ? 'Manage product catalog, details, and active deals' : 'إدارة البوكسات، المكونات، والعروض الفعالة'}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary hover:bg-primary-hover text-white rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-primary/15"
        >
          <Plus className="h-4 w-4" />
          <span>{t('admin.products.addBtn')}</span>
        </button>
      </div>

      {/* Table grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-gray-800 border-t-primary animate-spinner" />
          <p className="mt-4 text-xs text-gray-400 font-semibold">{t('language') === 'en' ? 'Fetching database...' : 'جاري سحب البيانات...'}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-950 rounded-2xl border border-gray-850">
          <Utensils className="h-12 w-12 text-gray-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 font-semibold">{t('products.noProducts')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-850 bg-gray-950">
          <table className="min-w-full divide-y divide-gray-850 text-start">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.products.table.image')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.products.table.name')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.products.table.price')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.products.table.category')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.products.table.badge')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.products.table.discount')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.products.table.visibility')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.products.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-900/20 transition">
                  <td className="px-6 py-3 whitespace-nowrap">
                    {product.image.startsWith('/') || product.image.startsWith('http') ? (
                      <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded-lg border border-gray-800" />
                    ) : (
                      <span className="text-3xl filter drop-shadow-sm select-none">{product.image}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap font-bold text-white">{product.name}</td>
                  <td className="px-6 py-3 whitespace-nowrap font-price text-gray-300 font-semibold">
                    {product.price} {t('products.currency')}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-400">
                    {product.category === 'boxes' && t('products.categoryBoxes')}
                    {product.category === 'appetizers' && t('products.categoryAppetizers')}
                    {product.category === 'addons' && t('products.categoryAddons')}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {product.badge ? (
                      <span className="bg-accent/15 border border-accent/20 text-accent text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max">
                        <Sparkles className="h-3 w-3" />
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-600">-</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {product.discount ? (
                      <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded block w-max">
                        -{product.discount.value}{product.discount.type === 'percent' ? '%' : ` ${t('products.currency')}`}
                      </span>
                    ) : (
                      <span className="text-gray-600">{t('admin.products.noDiscount')}</span>
                    )}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center" dir="ltr">
                      <button
                        onClick={async () => {
                          try {
                            await updateProduct(product.id, {
                              active: product.active === false ? true : false,
                            });
                            toast.success(
                              t('language') === 'en'
                                ? 'Status updated successfully'
                                : 'تم تحديث حالة المنتج بنجاح'
                            );
                          } catch (err) {
                            toast.error(
                              t('language') === 'en'
                                ? 'Failed to update status'
                                : 'فشل تحديث حالة المنتج'
                            );
                          }
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          product.active !== false ? 'bg-primary' : 'bg-gray-800'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            product.active !== false ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-400">
                    <div className="flex items-center gap-3">
                      {/* Edit button */}
                      <button
                        onClick={() => openEditModal(product)}
                        className="hover:text-primary transition p-1 hover:bg-gray-900 rounded"
                        title={t('language') === 'en' ? 'Edit' : 'تعديل'}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      {/* Discount button */}
                      <button
                        onClick={() => openDiscountModal(product)}
                        className="hover:text-accent transition p-1 hover:bg-gray-900 rounded"
                        title={t('admin.products.table.discount')}
                      >
                        <Tag className="h-4 w-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="hover:text-red-400 transition p-1 hover:bg-gray-900 rounded"
                        title={t('language') === 'en' ? 'Delete' : 'حذف'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODALS OVERLAYS ================= */}

      {/* 1. Add / Edit modal */}
      {(addModalOpen || editModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setAddModalOpen(false); setEditModalOpen(false); }} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] z-10">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-950">
              <h3 className="font-display font-bold text-sm text-white">
                {addModalOpen ? t('admin.products.form.addTitle') : t('admin.products.form.editTitle')}
              </h3>
              <button onClick={() => { setAddModalOpen(false); setEditModalOpen(false); }} className="text-gray-400 hover:text-white transition rounded p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={addModalOpen ? handleAddSubmit : handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.form.name')}</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.form.price')}</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.form.description')}</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.form.category')}</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value="boxes">{t('products.categoryBoxes')}</option>
                    <option value="appetizers">{t('products.categoryAppetizers')}</option>
                    <option value="addons">{t('products.categoryAddons')}</option>
                  </select>
                </div>
                {/* Image */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.form.image')}</label>
                  <input
                    type="text"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                {/* Badge */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.form.badge')}</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Premium"
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ingredients */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.form.ingredients')}</label>
                  <textarea
                    rows={4}
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none font-mono"
                    placeholder="لحمة 180g&#10;جبنة شيدر&#10;بصل مكرمل"
                  />
                </div>
                {/* Prep Steps */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.form.prepSteps')}</label>
                  <textarea
                    rows={4}
                    value={formPrepSteps}
                    onChange={(e) => setFormPrepSteps(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary resize-none font-mono"
                    placeholder="سخن الجريل&#10;اشوي اللحم 3 دقايق"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition flex items-center justify-center mt-6 cursor-pointer"
              >
                {t('admin.products.form.submit')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Discount Modal */}
      {discountModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDiscountModalOpen(false)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col z-10">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-950">
              <h3 className="font-display font-bold text-sm text-white">
                {t('admin.products.discount.title')} {selectedProduct.name}
              </h3>
              <button onClick={() => setDiscountModalOpen(false)} className="text-gray-400 hover:text-white transition rounded p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleApplyDiscount} className="p-6 space-y-4">
              {/* Type */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.discount.type')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscType('percent')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition ${
                      discType === 'percent'
                        ? 'bg-primary border-primary text-white'
                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {t('admin.products.discount.percent')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscType('fixed')}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition ${
                      discType === 'fixed'
                        ? 'bg-primary border-primary text-white'
                        : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {t('admin.products.discount.fixed')}
                  </button>
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.discount.value')}</label>
                <input
                  type="number"
                  required
                  value={discValue}
                  onChange={(e) => setDiscValue(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  placeholder={discType === 'percent' ? 'e.g. 15' : 'e.g. 50'}
                />
              </div>

              {/* Expiry */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">{t('admin.products.discount.expiry')}</label>
                <input
                  type="date"
                  value={discExpiry}
                  onChange={(e) => setDiscExpiry(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition flex items-center justify-center mt-4 cursor-pointer"
              >
                {t('admin.products.discount.btn')}
              </button>

              {/* Remove Discount */}
              {selectedProduct.discount && (
                <button
                  type="button"
                  onClick={handleRemoveDiscount}
                  className="w-full h-10 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-900/30 text-red-400 text-xs font-bold transition flex items-center justify-center cursor-pointer"
                >
                  {t('admin.products.discount.remove')}
                </button>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
