
import React, { useState } from 'react';
import { Restaurant, MenuItem, Order, User, OrderItem, OrderStatus, Review } from '../types';
import { ShoppingCart, ArrowRight, Star, MapPin, Phone, Check, Clock, Truck, ChefHat, XCircle, MessageSquare, Send, Tag, Search, Filter, Package, Plus, LogOut } from 'lucide-react';

interface CustomerViewProps {
  restaurants: Restaurant[];
  user: User;
  orders: Order[];
  onPlaceOrder: (order: Order) => void;
  onAddReview: (resId: string, review: Review) => void;
  onLogout?: () => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ restaurants, user, orders, onPlaceOrder, onAddReview, onLogout }) => {
  const [selectedRes, setSelectedRes] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [notes, setNotes] = useState('');
  const [view, setView] = useState<'home' | 'orders'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [mainFilter, setMainFilter] = useState<'all' | 'free' | 'discount'>('all');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleCheckout = () => {
    if (!selectedRes) return;
    const order: Order = {
      id: `ord-${Math.random().toString(36).substr(2, 6)}`,
      restaurantId: selectedRes.id,
      customerId: user.id,
      customerName: user.name,
      customerAddress: user.address || '',
      customerPhone: user.phone || '',
      items: cart,
      notes,
      total: cart.reduce((s, i) => s + ((i.discountPrice || i.price) * i.quantity), 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
      history: [{ status: 'pending', time: new Date().toLocaleTimeString() }]
    };
    onPlaceOrder(order);
    setCart([]);
    setShowCheckout(false);
    setSelectedRes(null);
    setView('orders');
  };

  const filteredRestaurants = restaurants.filter(r => {
    if (mainFilter === 'free') return r.isFreeDelivery;
    if (mainFilter === 'discount') return r.menu?.some(item => item.discountPrice && item.discountPrice < item.price);
    return true;
  });

  return (
    <div className="h-full bg-slate-50 flex flex-col font-['Cairo']">
      {/* View Switcher Mobile Only - Hidden on Desktop Sidebar if we had one */}
      <div className="flex gap-4 p-4 bg-white md:hidden border-b overflow-x-auto no-scrollbar">
        <button onClick={() => setView('home')} className={`px-6 py-2 rounded-2xl text-xs font-black whitespace-nowrap ${view === 'home' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>المطاعم</button>
        <button onClick={() => setView('orders')} className={`px-6 py-2 rounded-2xl text-xs font-black whitespace-nowrap ${view === 'orders' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>طلباتي ({orders.length})</button>
      </div>

      <div className="flex-grow overflow-y-auto pb-24 no-scrollbar">
        {view === 'home' ? (
          selectedRes ? (
            <div className="animate-in slide-in-from-left duration-300">
               <div className="relative h-48 md:h-64 rounded-b-[2rem] overflow-hidden">
                 <img src={selectedRes.image} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                 <button onClick={() => setSelectedRes(null)} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-xl text-white"><ArrowRight/></button>
                 <div className="absolute bottom-6 right-6">
                    <h1 className="text-2xl md:text-3xl font-black text-white">{selectedRes.name}</h1>
                    <p className="text-white/70 text-sm font-bold">{selectedRes.cuisine}</p>
                 </div>
               </div>

               <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRes.menu?.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-4 shadow-sm group">
                       <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                       <div className="flex-grow">
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 mb-2">{item.description}</p>
                          <div className="flex justify-between items-center">
                             <span className="text-orange-600 font-black">{item.price.toLocaleString()} د.ع</span>
                             <button onClick={() => addToCart(item)} className="bg-orange-100 text-orange-600 p-2 rounded-xl hover:bg-orange-600 hover:text-white transition-all"><Plus size={16}/></button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredRestaurants.map(r => (
                  <div key={r.id} onClick={() => setSelectedRes(r)} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 cursor-pointer shadow-sm hover:shadow-md transition-all group">
                    <div className="relative h-44">
                      <img src={r.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {r.isFreeDelivery && <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] px-3 py-1 rounded-full font-black">توصيل مجاني</div>}
                    </div>
                    <div className="p-5 flex justify-between items-center">
                      <div>
                        <h5 className="font-black text-slate-800 text-lg">{r.name}</h5>
                        <p className="text-xs text-slate-400 font-bold">{r.cuisine}</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all"><ArrowRight className="rotate-180" size={18} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="p-6 space-y-4 max-w-2xl mx-auto">
            <h3 className="font-black text-2xl mb-6">سجل الطلبات</h3>
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black text-slate-400 mb-1">طلب #{order.id.slice(-5)}</div>
                  <div className="font-black text-slate-800">{order.items.length} أصناف • {order.total.toLocaleString()} د.ع</div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-black text-center ${order.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {order.status === 'pending' ? 'بانتظار الموافقة' : order.status === 'delivered' ? 'تم التوصيل ✅' : 'يتم التحضير...'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && !showCheckout && (
        <div className="fixed bottom-6 left-6 right-6 md:max-w-md md:mx-auto z-50">
          <button onClick={() => setShowCheckout(true)} className="w-full bg-orange-600 text-white py-4.5 rounded-[2rem] font-black shadow-2xl flex justify-between items-center px-8 active:scale-95 transition-all">
            <span>عرض السلة ({cart.length})</span>
            <span className="text-lg">{cart.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()} د.ع</span>
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col md:max-w-2xl md:mx-auto md:shadow-2xl">
           <div className="p-6 border-b flex justify-between items-center">
             <button onClick={() => setShowCheckout(false)} className="p-2 bg-slate-100 rounded-xl"><ArrowRight/></button>
             <h3 className="font-black text-xl">تأكيد الطلب</h3>
             <div className="w-10"></div>
           </div>
           <div className="p-6 flex-grow overflow-y-auto space-y-6">
              <div className="bg-slate-50 p-5 rounded-3xl">
                <h4 className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">محتويات السلة</h4>
                {cart.map((it, i) => (
                  <div key={i} className="flex justify-between py-2 text-sm font-bold border-b border-slate-100 last:border-0">
                    <span>{it.quantity}x {it.name}</span>
                    <span>{(it.price * it.quantity).toLocaleString()} د.ع</span>
                  </div>
                ))}
              </div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أي ملاحظات إضافية؟" className="w-full p-5 bg-slate-50 rounded-3xl border-none outline-none h-32 text-sm" />
           </div>
           <div className="p-8 border-t">
              <div className="flex justify-between mb-6 text-xl font-black">
                <span>الإجمالي</span>
                <span className="text-orange-600">{cart.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString()} د.ع</span>
              </div>
              <button onClick={handleCheckout} className="w-full bg-orange-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-orange-100 active:scale-95 transition-all">إرسال الطلب للمطعم</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CustomerView;
