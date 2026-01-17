
import React from 'react';
import { Order, OrderStatus } from '../types';
import { ChefHat, CheckCircle, Clock, LogOut } from 'lucide-react';

interface KitchenViewProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onLogout?: () => void;
}

const KitchenView: React.FC<KitchenViewProps> = ({ orders, onUpdateStatus, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border-r-8 border-r-indigo-500">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><ChefHat size={32} /></div>
          <div>
            <h2 className="text-2xl font-bold">شاشة المطبخ</h2>
            <p className="text-slate-500">لديك {orders.length} طلبات قيد التحضير حالياً</p>
          </div>
        </div>
        {onLogout && (
          <button onClick={onLogout} className="flex items-center gap-2 bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-xs font-bold hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={16} /> خروج
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">لا توجد طلبات جديدة للتحضير</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-md p-6 border-2 border-indigo-50">
              <div className="flex justify-between mb-4 pb-2 border-b">
                <span className="font-bold text-lg">طلب #{order.id.slice(-4)}</span>
                <span className="text-indigo-600 font-bold flex items-center gap-1"><Clock size={14}/> {order.createdAt}</span>
              </div>
              
              <div className="space-y-4 mb-6">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">{item.quantity}</div>
                    <span className="text-lg font-bold text-slate-800">{item.name}</span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="p-3 bg-yellow-50 text-yellow-700 rounded-xl text-sm mb-6 border border-yellow-100">
                  <span className="font-bold">ملاحظة:</span> {order.notes}
                </div>
              )}

              <button 
                onClick={() => onUpdateStatus(order.id, 'prepared')}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                <CheckCircle size={20} /> تم تجهيز الطلب بالكامل
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KitchenView;
