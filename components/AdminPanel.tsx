
import React, { useState } from 'react';
import { Restaurant, Order, User } from '../types';
import { 
  Users, 
  Store, 
  ShieldCheck,
  TrendingUp, 
  ShoppingBag, 
  Sparkles, 
  PlusCircle,
  ChevronRight,
  Mail,
  UserPlus,
  Lock,
  Edit2,
  X,
  Save,
  Trash2,
  LogOut,
  Wallet,
  CheckCircle,
  BadgeDollarSign,
  Receipt
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface AdminPanelProps {
  restaurants: Restaurant[];
  orders: Order[];
  users: User[];
  onAddOwner: (ownerData: Partial<User>, resData: Partial<Restaurant>) => void;
  onUpdateUserPassword: (userId: string, newPass: string) => void;
  onUpdateRestaurant: (resId: string, updatedRes: Partial<Restaurant>) => void;
  onResetDebt: (resId: string) => void;
  onLogout?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  restaurants, 
  orders, 
  users, 
  onAddOwner, 
  onUpdateUserPassword, 
  onUpdateRestaurant,
  onResetDebt,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'restaurants' | 'users'>('dashboard');
  const [showAddOwner, setShowAddOwner] = useState(false);
  const [ownerData, setOwnerData] = useState({ name: '', email: '' });
  const [resData, setResData] = useState({ name: '', cuisine: '' });
  
  const [editingRes, setEditingRes] = useState<Restaurant | null>(null);
  const [changingPassUser, setChangingPassUser] = useState<User | null>(null);
  const [newPass, setNewPass] = useState('');

  const totalGlobalDebt = restaurants.reduce((s, r) => s + r.totalDebt, 0);

  const stats = [
    { title: "المطاعم النشطة", value: restaurants.length, icon: <Store className="text-blue-500" />, change: "+2" },
    { title: "إجمالي الطلبات", value: orders.length, icon: <ShoppingBag className="text-orange-500" />, change: "+14" },
    { title: "إجمالي المبيعات", value: `${orders.reduce((s, o) => s + o.total, 0).toLocaleString()} د.ع`, icon: <TrendingUp className="text-green-500" />, change: "+18%" },
    { title: "المستحقات المالية الكلية", value: `${totalGlobalDebt.toLocaleString()} د.ع`, icon: <Wallet className="text-indigo-500" />, change: `بمعدل 250 للطلب` },
  ];

  const chartData = restaurants.map(r => ({
    name: r.name,
    sales: orders.filter(o => o.restaurantId === r.id).reduce((s, o) => s + o.total, 0)
  }));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddOwner(ownerData, resData);
    setShowAddOwner(false);
    setOwnerData({name: '', email: ''});
    setResData({name: '', cuisine: ''});
  };

  const handleSaveRes = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRes) {
      onUpdateRestaurant(editingRes.id, editingRes);
      setEditingRes(null);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (changingPassUser) {
      onUpdateUserPassword(changingPassUser.id, newPass);
      setChangingPassUser(null);
      setNewPass('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 p-2.5 rounded-2xl shadow-lg">
            {/* Fix: Added missing ShieldCheck import from lucide-react */}
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">لوحة تحكم المدير العام</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">النظام المالي والإحصائي</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
            <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>الإحصائيات</button>
            <button onClick={() => setActiveTab('restaurants')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'restaurants' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>إدارة المطاعم</button>
            <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>المستخدمين</button>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-xs font-black hover:bg-red-100 transition-all border border-red-100">
              <LogOut size={16} /> خروج
            </button>
          )}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl">{s.icon}</div>
                  <span className="text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-lg uppercase">{s.change}</span>
                </div>
                <div className="text-2xl font-black text-slate-800">{s.value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.title}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-500" /> أداء المبيعات حسب المطعم
              </h3>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="sales" fill="#6366f1" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100 relative overflow-hidden flex flex-col">
              <Sparkles className="absolute top-4 left-4 opacity-20" size={100} />
              <div className="relative z-10 flex-grow">
                <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                  <Sparkles size={24} /> رؤى Gemini AI
                </h3>
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 mb-6">
                  <p className="text-indigo-50 text-sm leading-relaxed font-bold">
                    إجمالي المستحقات المالية التي يجب تحصيلها حالياً هي <span className="text-white text-lg underline decoration-orange-400 underline-offset-4">{totalGlobalDebt.toLocaleString()} دينار</span>. 
                    ننصح بجدولة جولات التحصيل للمطاعم التي تجاوزت مديونيتها 50,000 دينار لضمان استقرار التدفق المالي.
                  </p>
                </div>
              </div>
              <button className="relative z-10 bg-white text-indigo-600 font-black py-4 rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all text-sm shadow-lg">
                توليد تقرير مالي ذكي
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="space-y-6">
          {/* Financial Summary Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-100 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
             <div className="relative z-10">
                <div className="text-xs font-black opacity-80 uppercase tracking-widest mb-1">المستحقات المالية الكلية للنظام</div>
                <div className="text-4xl font-black">{totalGlobalDebt.toLocaleString()} <span className="text-xl">د.ع</span></div>
             </div>
             <button 
                onClick={() => setShowAddOwner(true)}
                className="relative z-10 bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg hover:bg-orange-50 active:scale-95 transition-all"
              >
                <PlusCircle size={20} /> إضافة مطعم جديد
              </button>
              <BadgeDollarSign className="absolute -bottom-8 -left-8 text-white/10 rotate-12" size={180} />
          </div>

          {/* ADD RESTAURANT FORM */}
          {showAddOwner && (
            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 animate-in slide-in-from-top duration-400">
               <div className="flex justify-between mb-8">
                 <div>
                   <h3 className="text-2xl font-black text-indigo-900">إنشاء حساب صاحب مطعم جديد</h3>
                   <p className="text-indigo-400 text-xs font-bold mt-1">أدخل بيانات المالك والمطعم لتفعيل الحساب</p>
                 </div>
                 <button onClick={() => setShowAddOwner(false)} className="p-2.5 bg-white rounded-2xl text-indigo-400 hover:text-indigo-600 shadow-sm">
                   <X size={24} />
                 </button>
               </div>
               <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                     <Users size={14} /> بيانات المالك الشخصية
                   </h4>
                   <input 
                     type="text" 
                     placeholder="الاسم الكامل للمالك" 
                     value={ownerData.name} 
                     onChange={e => setOwnerData({...ownerData, name: e.target.value})} 
                     className="w-full p-5 bg-white rounded-3xl border-none outline-none text-sm shadow-sm focus:ring-4 ring-indigo-500/20" 
                     required 
                   />
                   <input 
                     type="email" 
                     placeholder="البريد الإلكتروني للمالك" 
                     value={ownerData.email} 
                     onChange={e => setOwnerData({...ownerData, email: e.target.value})} 
                     className="w-full p-5 bg-white rounded-3xl border-none outline-none text-sm shadow-sm focus:ring-4 ring-indigo-500/20" 
                     required 
                   />
                 </div>
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                     <Store size={14} /> بيانات المطعم المهنية
                   </h4>
                   <input 
                     type="text" 
                     placeholder="اسم المطعم" 
                     value={resData.name} 
                     onChange={e => setResData({...resData, name: e.target.value})} 
                     className="w-full p-5 bg-white rounded-3xl border-none outline-none text-sm shadow-sm focus:ring-4 ring-indigo-500/20" 
                     required 
                   />
                   <input 
                     type="text" 
                     placeholder="نوع المطبخ (إيطالي، سريع، الخ)" 
                     value={resData.cuisine} 
                     onChange={e => setResData({...resData, cuisine: e.target.value})} 
                     className="w-full p-5 bg-white rounded-3xl border-none outline-none text-sm shadow-sm focus:ring-4 ring-indigo-500/20" 
                     required 
                   />
                 </div>
                 <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                   تفعيل مطعم المالك الجديد الآن
                 </button>
               </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {restaurants.map(r => (
               <div key={r.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                  <div className="relative h-40">
                    <img src={r.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 right-5">
                      <div className="text-white font-black text-xl">{r.name}</div>
                      <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{r.cuisine}</div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="bg-orange-50 p-4 rounded-3xl mb-6 border border-orange-100">
                       <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">المستحقات المالية لهذا المطعم</div>
                       <div className="text-2xl font-black text-orange-600">{r.totalDebt.toLocaleString()} <span className="text-sm">د.ع</span></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <div className="text-[8px] font-black text-slate-400 uppercase mb-1">طلبات اليوم</div>
                        <div className="text-sm font-black text-slate-700">{r.dailyOrderCount} طلب</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl">
                        <div className="text-[8px] font-black text-slate-400 uppercase mb-1">سجل الأيام</div>
                        <div className="text-sm font-black text-slate-700">{r.orderHistory.length} يوم</div>
                      </div>
                    </div>

                    <div className="mt-auto flex gap-2">
                       <button 
                        onClick={() => onResetDebt(r.id)}
                        disabled={r.totalDebt === 0}
                        className="flex-1 bg-green-500 text-white py-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-green-50 hover:bg-green-600 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                       >
                         <Receipt size={16}/> تصفير المستحقات
                       </button>
                       <button onClick={() => setEditingRes(r)} className="p-4 text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-colors">
                        <Edit2 size={20} />
                      </button>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-400">
           <div className="p-8 border-b border-slate-50 flex items-center gap-4">
             <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><Users size={24}/></div>
             <div>
               <h3 className="text-xl font-black text-slate-800">إدارة مستخدمي النظام</h3>
               <p className="text-xs text-slate-500 font-bold mt-0.5 uppercase tracking-widest">تتبع الأدوار وتغيير كلمات المرور</p>
             </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">المستخدم</th>
                    <th className="px-8 py-5">البريد الإلكتروني</th>
                    <th className="px-8 py-5">الدور الوظيفي</th>
                    <th className="px-8 py-5">التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black">{u.name.charAt(0)}</div>
                          <span className="font-black text-slate-800 text-sm">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-500 font-bold text-sm">{u.email}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' :
                          u.role === 'OWNER' ? 'bg-orange-100 text-orange-600' :
                          u.role === 'CUSTOMER' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                         <button onClick={() => setChangingPassUser(u)} className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2">
                           <Lock size={14} /> تغيير الرمز
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Edit Restaurant Modal */}
      {editingRes && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">تعديل بيانات مطعم</h3>
                <button onClick={() => setEditingRes(null)} className="p-3 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-all"><X /></button>
             </div>
             <form onSubmit={handleSaveRes} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1">اسم المطعم</label>
                    <input type="text" value={editingRes.name} onChange={e => setEditingRes({...editingRes, name: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-4 ring-indigo-500/20 outline-none font-bold" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1">نوع المطبخ</label>
                    <input type="text" value={editingRes.cuisine} onChange={e => setEditingRes({...editingRes, cuisine: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-4 ring-indigo-500/20 outline-none font-bold" required />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1">رابط صورة المطعم الرئيسية</label>
                    <input type="text" value={editingRes.image} onChange={e => setEditingRes({...editingRes, image: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl border-none focus:ring-4 ring-indigo-500/20 outline-none font-bold" required />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setEditingRes(null)} className="px-8 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all">إلغاء التعديل</button>
                  <button type="submit" className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all">
                    <Save size={20} /> حفظ البيانات المعدلة
                  </button>
                </div>
             </form>
           </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changingPassUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-slate-800">تغيير رمز الدخول</h3>
                  <p className="text-xs text-indigo-500 font-bold mt-1">للمستخدم: {changingPassUser.name}</p>
                </div>
                <button onClick={() => setChangingPassUser(null)} className="p-3 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800"><X /></button>
              </div>
              <form onSubmit={handleChangePassword} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-1">كلمة المرور الجديدة</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" 
                      value={newPass} 
                      onChange={e => setNewPass(e.target.value)} 
                      placeholder="أدخل الرمز السري الجديد"
                      className="w-full pr-12 pl-4 py-5 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-indigo-500/20 outline-none text-sm font-black" 
                      required 
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setChangingPassUser(null)} className="flex-1 py-4 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all">إلغاء</button>
                  <button type="submit" className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
                    <CheckCircle size={18} /> تحديث الرمز
                  </button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
