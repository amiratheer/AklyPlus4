
import React from 'react';
import { Order, OrderStatus } from '../types';
import { Truck, MapPin, Phone, CheckCircle, Navigation, LogOut } from 'lucide-react';

interface DeliveryViewProps {
  orders: Order[];
  driverId: string;
  onUpdateStatus: (orderId: string, status: OrderStatus, driverId?: string) => void;
  onLogout?: () => void;
}

const DeliveryView: React.FC<DeliveryViewProps> = ({ orders, driverId, onUpdateStatus, onLogout }) => {
  const activeDelivery = orders.find(o => o.status === 'delivering' && o.assignedDriverId === driverId);
  const marketOrders = orders.filter(o => o.status === 'prepared');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Truck /> شاشة التوصيل</h2>
          <p className="text-blue-100 text-sm">أهلاً بك، ابدأ باستلام الطلبات الجاهزة</p>
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="text-right">
            <div className="text-xs uppercase opacity-70">رصيدك اليوم</div>
            <div className="text-2xl font-bold">25,000 د.ع</div>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all" title="خروج">
              <LogOut size={20} />
            </button>
          )}
        </div>
        <Truck className="absolute -bottom-6 -left-6 text-white/10 rotate-12" size={140} />
      </div>

      {activeDelivery ? (
        <div className="bg-white rounded-3xl shadow-xl border-4 border-blue-100 p-8">
          <div className="flex justify-between items-start mb-8">
            <h3 className="text-2xl font-black text-slate-800">طلب قيد التوصيل 🚚</h3>
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-bold animate-pulse">في الطريق</span>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 p-3 rounded-2xl text-slate-600"><MapPin /></div>
              <div>
                <div className="text-xs text-slate-400 font-bold mb-1">عنوان العميل</div>
                <div className="text-lg font-bold text-slate-800">{activeDelivery.customerAddress}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-slate-100 p-3 rounded-2xl text-slate-600"><Phone /></div>
              <div>
                <div className="text-xs text-slate-400 font-bold mb-1">رقم الهاتف</div>
                <div className="text-lg font-bold text-slate-800">{activeDelivery.customerPhone}</div>
                <div className="text-sm text-blue-600 font-bold mt-1">اتصال بالعميل</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl mb-8">
            <h4 className="font-bold mb-3 text-slate-700">محتويات الطلب:</h4>
            {activeDelivery.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-bold">{activeDelivery.customerName}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onUpdateStatus(activeDelivery.id, 'delivered')}
            className="w-full bg-green-500 text-white py-5 rounded-2xl font-black text-xl shadow-lg shadow-green-100 hover:bg-green-600 transition-all"
          >
            لقد وصلت! (تم توصيل الطلب)
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Navigation size={18}/> الطلبات المتاحة للاستلام</h3>
          {marketOrders.length === 0 ? (
            <div className="py-20 bg-white rounded-2xl text-center text-slate-400 border border-dashed border-slate-200">
              لا توجد طلبات جاهزة حالياً، بانتظار المطبخ...
            </div>
          ) : (
            marketOrders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center hover:border-blue-500 transition-all cursor-pointer">
                <div>
                  <div className="text-xs text-blue-600 font-bold mb-1">المسافة: 3.2 كم</div>
                  <h4 className="font-bold text-slate-800">{order.customerAddress.split('،')[0]}</h4>
                  <p className="text-xs text-slate-400">{order.items.length} قطع • {order.total.toLocaleString()} د.ع</p>
                </div>
                <button 
                  onClick={() => onUpdateStatus(order.id, 'delivering', driverId)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md"
                >
                  قبول وتوصيل
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryView;
