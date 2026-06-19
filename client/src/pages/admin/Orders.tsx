import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Eye, X, ClipboardList, MapPin, BadgeInfo, FileText } from 'lucide-react';
import { useOrderStore, Order } from '../../store/useOrderStore';

export const Orders: React.FC = () => {
  const { t } = useTranslation();
  const { orders, isLoading, fetchOrders, updateOrderStatus } = useOrderStore();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      const localizedStatus = t(`admin.orders.statuses.${newStatus}`);
      const successMsg = t('admin.orders.modal.statusUpdated');
      
      toast.success(`${successMsg} "${localizedStatus}"`);
    } catch (err) {
      toast.error(t('language') === 'en' ? 'Failed to update order status' : 'فشل تحديث حالة الطلب');
    }
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500';
      case 'preparing':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
      case 'shipping':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-500';
      case 'delivered':
        return 'bg-green-500/10 border-green-500/20 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 border-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-500';
    }
  };

  const getPaymentLabel = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'card':
        return t('checkout.payCard');
      case 'wallet':
        return t('checkout.payWallet');
      case 'cod':
        return t('checkout.payCod');
      default:
        return method;
    }
  };

  const lang = t('language');

  return (
    <div className="space-y-6 select-none">
      
      {/* Title */}
      <div className="border-b border-gray-850 pb-4">
        <h2 className="text-xl font-bold font-display text-white">{t('admin.nav.orders')}</h2>
        <p className="text-xs text-gray-500 mt-1">
          {lang === 'en' ? 'Track customer transactions, check shipping states, and update statuses' : 'متابعة طلبات العملاء وتعديل حالات الشحن المباشرة'}
        </p>
      </div>

      {/* Grid Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-gray-800 border-t-primary animate-spinner" />
          <p className="mt-4 text-xs text-gray-400 font-semibold">{t('language') === 'en' ? 'Fetching database...' : 'جاري سحب البيانات...'}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-950 rounded-2xl border border-gray-850">
          <span className="text-5xl block mb-4">📋</span>
          <p className="text-gray-500 font-semibold">{t('language') === 'en' ? 'No orders placed yet' : 'لا توجد طلبات مسجلة بعد'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-850 bg-gray-950">
          <table className="min-w-full divide-y divide-gray-850 text-start">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.orders.table.id')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.orders.table.name')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.orders.table.phone')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.orders.table.products')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.orders.table.total')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.orders.table.payment')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider">{t('admin.orders.table.status')}</th>
                <th className="px-6 py-4 text-start text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850 text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-900/20 transition">
                  <td className="px-6 py-3.5 whitespace-nowrap font-mono font-bold text-primary">#{order.id}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-white font-medium">{order.customerName}</td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-gray-400 font-price select-text">{order.phone}</td>
                  <td className="px-6 py-3.5 text-gray-300 max-w-xs truncate">
                    {order.items.map(item => `${item.quantity}× ${item.name}`).join(' ، ')}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap font-price text-gray-200 font-bold">
                    {order.total} {t('products.currency')}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-gray-400 text-xs truncate max-w-[130px]">
                    {getPaymentLabel(order.paymentMethod)}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none transition cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="pending" className="bg-gray-950 text-yellow-500 font-bold">{t('admin.orders.statuses.pending')}</option>
                      <option value="preparing" className="bg-gray-950 text-blue-500 font-bold">{t('admin.orders.statuses.preparing')}</option>
                      <option value="shipping" className="bg-gray-950 text-purple-500 font-bold">{t('admin.orders.statuses.shipping')}</option>
                      <option value="delivered" className="bg-gray-950 text-green-500 font-bold">{t('admin.orders.statuses.delivered')}</option>
                      <option value="cancelled" className="bg-gray-950 text-red-500 font-bold">{t('admin.orders.statuses.cancelled')}</option>
                    </select>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-gray-400">
                    <button
                      onClick={() => openDetailModal(order)}
                      className="hover:text-primary transition p-1 hover:bg-gray-900 rounded"
                      title={t('admin.orders.modal.title')}
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ORDER DETAIL MODAL ================= */}
      {detailModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailModalOpen(false)} />
          <div className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] z-10">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-950">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-sm text-white">
                  {t('admin.orders.modal.title')} #{selectedOrder.id}
                </h3>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="text-gray-400 hover:text-white transition rounded p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Customer Profile Block */}
              <div className="space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-850">
                <h4 className="text-xs font-bold text-gray-400 flex items-center gap-1.5 border-b border-gray-850 pb-2 mb-2">
                  <BadgeInfo className="h-4 w-4 text-primary" />
                  <span>{t('admin.orders.modal.customerInfo')}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div>
                    <span className="text-gray-500 block">{t('checkout.name')}:</span>
                    <span className="text-white font-semibold">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t('checkout.phone')}:</span>
                    <span className="text-white font-mono select-text font-semibold">{selectedOrder.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t('admin.orders.modal.governorate')}</span>
                    <span className="text-white font-semibold">{selectedOrder.governorate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">{t('admin.orders.modal.created')}</span>
                    <span className="text-white font-mono">{new Date(selectedOrder.createdAt).toLocaleString(lang === 'en' ? 'en-US' : 'ar-EG')}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-850 pt-2 mt-2 text-xs">
                  <span className="text-gray-500 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" /> {t('admin.orders.modal.address')}</span>
                  <p className="text-white mt-1 leading-relaxed">{selectedOrder.address}</p>
                </div>

                {selectedOrder.notes && (
                  <div className="border-t border-gray-850 pt-2 mt-2 text-xs">
                    <span className="text-gray-500 flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-gray-500 shrink-0" /> {t('admin.orders.modal.notes')}</span>
                    <p className="text-white mt-1 leading-relaxed bg-gray-900/50 p-2 rounded-lg border border-gray-900 italic font-mono select-text">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 border-b border-gray-850 pb-2">
                  {t('admin.orders.modal.items')}
                </h4>
                <div className="divide-y divide-gray-850">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-950 flex items-center justify-center border border-gray-850 text-xl shrink-0 overflow-hidden select-none bg-zinc-950">
                          {item.image && (item.image.startsWith('/') || item.image.startsWith('http')) ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            item.image || '🍔'
                          )}
                        </div>
                        <div>
                          <span className="text-white font-bold block leading-snug">{item.name}</span>
                          <span className="text-gray-500 block font-price mt-0.5">{item.quantity} × {item.price} {t('products.currency')}</span>
                        </div>
                      </div>
                      <span className="font-price font-bold text-white text-sm">
                        {item.price * item.quantity} {t('products.currency')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary subtotal */}
              <div className="border-t border-gray-850 pt-4 flex justify-between items-center bg-gray-950/50 p-4 rounded-xl">
                <div className="text-xs text-gray-500">
                  <span className="block">{t('checkout.paymentMethod')}:</span>
                  <span className="text-white font-semibold mt-1 block">{getPaymentLabel(selectedOrder.paymentMethod)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">{lang === 'en' ? 'Grand Total' : 'المجموع الإجمالي'}</span>
                  <span className="text-xl font-bold font-price text-primary block mt-1">
                    {selectedOrder.total} {t('products.currency')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
