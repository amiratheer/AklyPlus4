
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, User, Restaurant, Order, MenuItem, OrderStatus } from './types';
import CustomerView from './components/CustomerView';
import AdminPanel from './components/AdminPanel';
import RestaurantDashboard from './components/RestaurantDashboard';
import KitchenView from './components/KitchenView';
import DeliveryView from './components/DeliveryView';
import Login from './components/Login';
import Signup from './components/Signup';
import { dbService } from './services/firebaseService';
import { requestNotificationPermission, sendNotification, playNotificationSound } from './services/notificationService';
import { Store, LogOut, BellRing, CloudSync } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // 1. ربط قاعدة البيانات الحية
  useEffect(() => {
    requestNotificationPermission();

    // مزامنة المستخدمين
    const unsubUsers = dbService.subscribe('users', (data) => {
      if (data) setUsers(Object.values(data));
      else setUsers([
        { id: 'admin', name: 'أمير أثير', email: 'amiratheer@gmail.com', password: '1234', role: UserRole.ADMIN }
      ]);
    });

    // مزامنة المطاعم
    const unsubRes = dbService.subscribe('restaurants', (data) => {
      if (data) setRestaurants(Object.values(data));
    });

    // مزامنة الطلبات
    const unsubOrders = dbService.subscribe('orders', (data) => {
      if (data) {
        const sortedOrders = Object.values(data) as Order[];
        setOrders(sortedOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }
    });

    setIsLoading(false);
    return () => { unsubUsers(); unsubRes(); unsubOrders(); };
  }, []);

  // 2. معالجة الإشعارات والطلب الجديد
  const prevOrdersLength = useRef(0);
  useEffect(() => {
    if (orders.length > prevOrdersLength.current && currentUser) {
      const latest = orders[0];
      // إشعار لصاحب المطعم
      if (currentUser.restaurantId === latest.restaurantId && (currentUser.role === UserRole.OWNER || currentUser.role === UserRole.KITCHEN)) {
        sendNotification("طلب جديد! 🍔", `لديك طلب جديد من ${latest.customerName}`);
        playNotificationSound();
      }
      prevOrdersLength.current = orders.length;
    }
  }, [orders, currentUser]);

  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      alert("بيانات الدخول غير صحيحة");
    }
  };

  const handlePlaceOrder = async (newOrder: Order) => {
    setIsSyncing(true);
    await dbService.push('orders', newOrder);
    setIsSyncing(false);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, driverId?: string) => {
    const orderRef = orders.find(o => o.id === orderId);
    if (!orderRef) return;

    const updates: any = { status };
    if (driverId) updates.assignedDriverId = driverId;
    
    await dbService.update(`orders/${orderId}`, updates);

    // إذا تم قبول الطلب، تحديث مديونية المطعم
    if (status === 'accepted') {
      const res = restaurants.find(r => r.id === orderRef.restaurantId);
      if (res) {
        await dbService.update(`restaurants/${res.id}`, {
          dailyOrderCount: (res.dailyOrderCount || 0) + 1,
          totalDebt: (res.totalDebt || 0) + 250
        });
      }
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center font-black text-orange-600 animate-pulse">جاري الاتصال بالسحابة...</div>;

  if (!isAuthenticated) return showSignup ? <Signup onSignup={async (d) => { const u = {...d, id: `u-${Date.now()}`, role: UserRole.CUSTOMER}; await dbService.update(`users/${u.id}`, u); setCurrentUser(u as User); setIsAuthenticated(true); }} onToggleLogin={() => setShowSignup(false)} /> : <Login onLogin={handleLogin} onToggleSignup={() => setShowSignup(true)} />;

  return (
    <div className="h-full flex flex-col bg-slate-50 font-['Cairo'] overflow-hidden">
      {/* Header - Responsive */}
      <header className="bg-white px-4 md:px-10 py-4 flex justify-between items-center border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-orange-600 p-2.5 rounded-2xl shadow-lg shadow-orange-100">
            <Store className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 leading-none">أكلي بلس</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <CloudSync size={10} className={isSyncing ? "text-blue-500 animate-spin" : "text-green-500"} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">قاعدة بيانات مباشرة</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setIsAuthenticated(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={22} />
          </button>
        </div>
      </header>

      {/* Main Content Area - Responsive Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-container bg-slate-50/50">
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="w-full">
            {currentUser?.role === UserRole.ADMIN && <AdminPanel restaurants={restaurants} orders={orders} users={users} onAddOwner={async (u, r) => { const uid = `u-${Date.now()}`; const rid = `r-${Date.now()}`; await dbService.update(`users/${uid}`, {...u, id: uid, restaurantId: rid}); await dbService.update(`restaurants/${rid}`, {...r, id: rid, ownerId: uid, dailyOrderCount: 0, totalDebt: 0, orderHistory: [], reviews: [], menu: []}); }} onUpdateUserPassword={(id, p) => dbService.update(`users/${id}`, {password: p})} onUpdateRestaurant={(id, r) => dbService.update(`restaurants/${id}`, r)} onResetDebt={(id) => dbService.update(`restaurants/${id}`, {totalDebt: 0})} onLogout={() => setIsAuthenticated(false)} />}
            
            {currentUser?.role === UserRole.OWNER && <RestaurantDashboard restaurant={restaurants.find(r => r.ownerId === currentUser.id) || restaurants[0]} orders={orders.filter(o => o.restaurantId === currentUser.restaurantId)} onUpdateStatus={updateOrderStatus} onAddStaff={(s) => dbService.update(`users/s-${Date.now()}`, {...s, restaurantId: currentUser.restaurantId})} onUpdateMenu={(m) => dbService.update(`restaurants/${currentUser.restaurantId}/menu`, m)} onUpdateRestaurant={(d) => dbService.update(`restaurants/${currentUser.restaurantId}`, d)} users={users.filter(u => u.restaurantId === currentUser.restaurantId)} onLogout={() => setIsAuthenticated(false)} />}
            
            {currentUser?.role === UserRole.KITCHEN && <KitchenView orders={orders.filter(o => o.restaurantId === currentUser.restaurantId && (o.status === 'accepted' || o.status === 'preparing'))} onUpdateStatus={updateOrderStatus} onLogout={() => setIsAuthenticated(false)} />}
            
            {currentUser?.role === UserRole.DELIVERY && <DeliveryView orders={orders.filter(o => o.restaurantId === currentUser.restaurantId && (o.status === 'prepared' || (o.status === 'delivering' && o.assignedDriverId === currentUser.id)))} driverId={currentUser.id} onUpdateStatus={updateOrderStatus} onLogout={() => setIsAuthenticated(false)} />}
            
            {currentUser?.role === UserRole.CUSTOMER && (
              <div className="max-w-2xl mx-auto">
                <CustomerView restaurants={restaurants} user={currentUser} orders={orders.filter(o => o.customerId === currentUser.id)} onPlaceOrder={handlePlaceOrder} onAddReview={(rid, rev) => dbService.push(`restaurants/${rid}/reviews`, rev)} onLogout={() => setIsAuthenticated(false)} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
