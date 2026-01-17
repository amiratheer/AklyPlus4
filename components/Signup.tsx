
import React, { useState } from 'react';
import { UserCircle, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface SignupProps {
  onSignup: (data: Partial<User>) => void;
  onToggleLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onToggleLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignup(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Cairo']">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleLogin();
              }} 
              className="p-3 bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-all active:scale-90"
              aria-label="الرجوع لتسجيل الدخول"
            >
              <ArrowRight size={22} />
            </button>
            <span className="text-sm font-bold text-slate-400">الرجوع لتسجيل الدخول</span>
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 mb-1">حساب زبون جديد</h2>
          <p className="text-slate-500 text-sm mb-8">انضم إلى مجتمع أكلي بلس اليوم</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 mr-1">الاسم الكامل</label>
              <div className="relative">
                <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pr-12 pl-4 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-orange-500 outline-none text-sm"
                  placeholder="محمد علي" required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pr-12 pl-4 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-orange-500 outline-none text-sm"
                  placeholder="user@example.com" required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 mr-1">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pr-12 pl-4 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-orange-500 outline-none text-sm"
                  placeholder="0770XXXXXXX" required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 mr-1">العنوان</label>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full pr-12 pl-4 py-3.5 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-orange-500 outline-none text-sm"
                  placeholder="المنطقة، الزقاق، الدار" required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black mt-4 shadow-lg shadow-orange-100 hover:bg-orange-700 active:scale-95 transition-all">
              إنشاء الحساب والمتابعة
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
