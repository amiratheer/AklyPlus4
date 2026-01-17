
import React, { useState } from 'react';
import { Restaurant, Order, OrderStatus, User, UserRole, MenuItem } from '../types';
import { Store, Package, CheckCircle, XCircle, Clock, Truck, ChefHat, UserPlus, Mail, Shield, Plus, Edit2, Trash2, Tag, Percent, X, Save, Layers, LogOut, Wallet, Calendar, History } from 'lucide-react';

interface RestaurantDashboardProps {
  restaurant: Restaurant;
  orders: Order[];
  users: User[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAddStaff: (staffData: Partial<User>) => void;
  onUpdateMenu: (menu: MenuItem[]) => void;
  onUpdateRestaurant: (data: Partial<Restaurant>) => void;
  onLogout?: () => void;
}

const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ 
  restaurant, 
  orders, 
  users, 
  onUpdateStatus, 
  onAddStaff,
  onUpdateMenu,
  onUpdateRestaurant,
  onLogout
}) => {
  const [view, setView] = useState<'active' | 'completed' | 'staff' | 'menu' | 'billing'>('active');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: UserRole.KITCHEN });
  
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState<Partial<MenuItem>>({ name: '', description: '', price: 0, discountPrice: undefined, category: '' });

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'rejected');
  
  const categories = Array.from(new Set(restaurant.menu.map(item => item.category)));

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStaff(staffForm);
    setShowAddStaff(false);
    setStaffForm({ name: '', email: '', role: UserRole.KITCHEN });
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newMenu = [...restaurant.menu];
    if (editingItem) {
      const idx = newMenu.findIndex(i => i.id === editingItem.id);
      newMenu[idx] = { ...editingItem, ...itemForm } as MenuItem;
    } else {
      newMenu.push({
        id: `m-${Date.now()}`,
        name: itemForm.name || '',
        description: itemForm.description || '',
        price: Number(itemForm.price) || 0,
        category: itemForm.category || 'عام',
        discountPrice: itemForm.discountPrice ? Number(itemForm.discountPrice) : undefined,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
      });
    }
    onUpdateMenu(newMenu);
    setShowItemModal(false);
    setEditingItem(null);
    setItemForm({ name: '', description: '', price: 0, discountPrice: undefined, category: '' });
  };

  const deleteItem = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الأكلة؟')) {
      onUpdateMenu(restaurant.menu.filter(i => i.id !== id));
    }
  };

  const toggleFreeDelivery = () => {
    onUpdateRestaurant({ isFreeDelivery: !restaurant.isFreeDelivery });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <Store size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{restaurant.name}</h2>
            <p className="text-slate-500 text-sm">لوحة إدارة العمليات والمنيو</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border overflow-x-auto no-scrollbar">
            <button onClick={() => setView('active')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'active' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>الطلبات النشطة</button>
            <button onClick={() => setView('menu')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'menu' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>إدارة المنيو</button>
            <button onClick={() => setView('staff')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'staff' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>الموظفين</button>
            <button onClick={() => setView('billing')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${view === 'billing' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>المالية والإحصائيات</button>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-100 transition-all border border-red-100">
              <LogOut size={16} /> خروج
            </button>
          )}
        </div>
      </div>

      {view === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {activeOrders.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
               <Package className="mx-auto text-slate-300 mb-4" size={48} />
               <p className="text-slate-400 font-bold">لا توجد طلبات نشطة حالياً</p>
            </div>
          ) : (
            activeOrders.map(order => (
              <div key={order.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                    order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                    order.status === 'accepted' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {order.status === 'pending' ? 'بانتظار الموافقة' : 
                     order.status === 'accepted' ? 'في المطبخ' : 
                     order.status === 'prepared' ? 'جاهز للتوصيل' : 'في الطريق'}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">{order.createdAt}</span>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-bold text-slate-800">{order.customerName}</h4>
                  <p className="text-xs text-slate-500 truncate">{order.customerAddress}</p>
                </div>

                <div className="flex-grow space-y-2 mb-6 bg-slate-50 p-3 rounded-xl">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-600">{item.quantity}x {item.name}</span>
                      <span className="text-slate-400">{(item.price * item.quantity).toLocaleString()} د.ع</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t flex gap-2">
                  {order.status === 'pending' ? (
                    <>
                      <button onClick={() => onUpdateStatus(order.id, 'accepted')} className="flex-1 bg-green-500 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-lg shadow-green-50">
                        <CheckCircle size={14} /> قبول الطلب
                      </button>
                      <button onClick={() => onUpdateStatus(order.id, 'rejected')} className="flex-1 bg-red-50 text-red-500 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-100 transition-colors">
                        <XCircle size={14} /> رفض
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center text-[10px] text-indigo-500 font-bold py-3 bg-indigo-50 rounded-xl">
                      {order.status === 'accepted' || order.status === 'preparing' ? 'يتم التحضير في المطبخ 👨‍🍳' : 'بانتظار سائق الدليفري 🛵'}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {view === 'billing' && (
        <div className="space-y-6 animate-in fade-in duration-300">
           {/* Top Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                  <Package size={24} />
                </div>
                <div className="text-3xl font-black text-slate-800">{restaurant.dailyOrderCount}</div>
                <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">طلبات اليوم</div>
                <p className="text-[10px] text-orange-500 font-bold mt-2 italic">يتم التصفير عند 3:00 ص</p>
              </div>

              <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <Wallet className="absolute -bottom-4 -left-4 text-white/10" size={100} />
                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                  <Wallet size={24} />
                </div>
                <div className="text-3xl font-black">{restaurant.totalDebt.toLocaleString()} <span className="text-xs">د.ع</span></div>
                <div className="text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">إجمالي المستحقات المالية</div>
                <p className="text-[10px] font-bold mt-2 opacity-60">تكلفة الخدمة: 250 د.ع لكل طلب مقبول</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                  <Calendar size={24} />
                </div>
                <div className="text-3xl font-black text-slate-800">{restaurant.orderHistory.length}</div>
                <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">أيام الأرشفة المتاحة</div>
                <p className="text-[10px] text-blue-500 font-bold mt-2">نحتفظ بالسجلات لآخر 60 يوم</p>
              </div>
           </div>

           {/* History Log */}
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex items-center gap-3">
               <History className="text-slate-400" size={24} />
               <h3 className="font-black text-slate-800 text-xl">سجل مبيعات الأيام السابقة</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-8 py-4">التاريخ</th>
                      <th className="px-8 py-4">عدد الطلبات</th>
                      <th className="px-8 py-4">العائد المترتب (250 د.ع للطلب)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {restaurant.orderHistory.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-10 text-center text-slate-400 font-bold">لا يوجد سجل تاريخي بعد (أول يوم لك بالتطبيق)</td>
                      </tr>
                    ) : (
                      restaurant.orderHistory.map((day, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5 text-sm font-bold text-slate-700">{day.date}</td>
                          <td className="px-8 py-5">
                            <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black text-slate-600">{day.count} طلب</span>
                          </td>
                          <td className="px-8 py-5 text-sm font-black text-orange-600">{(day.count * 250).toLocaleString()} د.ع</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
           </div>
        </div>
      )}

      {view === 'menu' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-6">
                <div>
                  <h3 className="font-black text-slate-800 text-lg">إدارة المنيو</h3>
                  <p className="text-xs text-slate-500">تعديل التصنيفات والأصناف</p>
                </div>
             </div>
             <button 
               onClick={() => { setShowItemModal(true); setEditingItem(null); setItemForm({ name: '', description: '', price: 0, category: '' }); }}
               className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
             >
               <Plus size={18} /> إضافة صنف جديد
             </button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Layers className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold">المنيو فارغ، ابدأ بإضافة أصناف جديدة</p>
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat} className="space-y-4">
                <h4 className="font-black text-slate-800 flex items-center gap-2 text-lg">
                  <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                  {cat}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {restaurant.menu.filter(item => item.category === cat).map(item => (
                     <div key={item.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-all group">
                       <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
                       <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-800 truncate text-sm">{item.name}</h4>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingItem(item); setItemForm(item); setShowItemModal(true); }} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit2 size={14}/></button>
                              <button onClick={() => deleteItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mb-2">{item.description}</p>
                          <div className="flex items-center gap-2">
                             {item.discountPrice ? (
                               <>
                                 <span className="text-orange-600 font-black text-sm">{item.discountPrice.toLocaleString()} د.ع</span>
                                 <span className="text-slate-300 line-through text-[10px] font-bold">{item.price.toLocaleString()}</span>
                               </>
                             ) : (
                               <span className="text-slate-800 font-black text-sm">{item.price.toLocaleString()} د.ع</span>
                             )}
                          </div>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {view === 'staff' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div>
              <h3 className="text-xl font-black text-slate-800">إدارة الفريق</h3>
              <p className="text-slate-500 text-xs mt-1">يمكنك إضافة الطباخين والسائقين هنا</p>
            </div>
            <button 
              onClick={() => setShowAddStaff(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
            >
              <UserPlus size={18} /> إضافة موظف جديد
            </button>
          </div>

          {showAddStaff && (
            <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 animate-in slide-in-from-top duration-300">
               <div className="flex justify-between mb-6">
                 <h4 className="font-black text-indigo-900">بيانات الموظف الجديد</h4>
                 <button onClick={() => setShowAddStaff(false)} className="text-indigo-400 font-bold text-xs uppercase">إلغاء</button>
               </div>
               <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <input type="text" placeholder="اسم الموظف" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="p-4 bg-white rounded-2xl border-none outline-none text-sm" required />
                 <input type="email" placeholder="البريد الإلكتروني" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="p-4 bg-white rounded-2xl border-none outline-none text-sm" required />
                 <select value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value as UserRole})} className="p-4 bg-white rounded-2xl border-none outline-none text-sm font-bold">
                    <option value={UserRole.KITCHEN}>طباخ (Kitchen)</option>
                    <option value={UserRole.DELIVERY}>دليفري (Delivery)</option>
                 </select>
                 <button type="submit" className="md:col-span-3 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100">تأكيد الإضافة</button>
               </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-black mb-6 flex items-center gap-2 text-indigo-600"><ChefHat /> الفريق داخل المطبخ</h3>
              <div className="space-y-3">
                {users.filter(u => u.role === UserRole.KITCHEN).map(u => (
                  <div key={u.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600"><ChefHat size={20}/></div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-md font-bold uppercase">نشط</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-black mb-6 flex items-center gap-2 text-blue-600"><Truck /> سائقي التوصيل</h3>
              <div className="space-y-3">
                {users.filter(u => u.role === UserRole.DELIVERY).map(u => (
                  <div key={u.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600"><Truck size={20}/></div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-bold uppercase">متصل</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className="p-8 border-b flex justify-between items-center">
                <h3 className="text-xl font-black">{editingItem ? 'تعديل الصنف' : 'إضافة صنف جديد'}</h3>
                <button onClick={() => setShowItemModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800"><X /></button>
             </div>
             <form onSubmit={handleSaveItem} className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">الاسم</label>
                    <input type="text" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 outline-none text-sm" placeholder="برجر لحم" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">التصنيف</label>
                    <input type="text" value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 outline-none text-sm font-bold" placeholder="مثلاً: وجبات رئيسية" required />
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">الوصف</label>
                   <textarea value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 outline-none text-sm h-16 resize-none" placeholder="وصف الطبق..." required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">السعر الأصلي</label>
                     <input type="number" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 outline-none text-sm font-bold" required />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">سعر الخصم</label>
                     <input type="number" value={itemForm.discountPrice || ''} onChange={e => setItemForm({...itemForm, discountPrice: e.target.value ? Number(e.target.value) : undefined})} className="w-full p-4 bg-indigo-50 rounded-2xl border-none focus:ring-2 ring-indigo-500 outline-none text-sm font-bold text-indigo-600" placeholder="بدون خصم" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                   <button type="button" onClick={() => setShowItemModal(false)} className="flex-1 py-4 font-bold text-slate-400 hover:bg-slate-50 rounded-2xl">إلغاء</button>
                   <button type="submit" className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                     <Save size={18} /> حفظ البيانات
                   </button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
