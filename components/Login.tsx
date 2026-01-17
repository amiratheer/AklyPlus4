
import React, { useState } from 'react';
import { Store, Mail, Lock, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, pass: string) => void;
  onToggleSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onToggleSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Cairo']">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
        <div className="bg-orange-500 p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <Store size={32} />
          </div>
          <h2 className="text-2xl font-black">أهلاً بك في أكلي</h2>
          <p className="opacity-80 text-sm mt-1">سجل دخولك للمتابعة</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-orange-500 outline-none transition-all text-sm"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2 mr-1">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 ring-orange-500 outline-none transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-orange-700 active:scale-95 transition-all">
            تسجيل الدخول
          </button>

          <div className="pt-6 border-t text-center space-y-4">
             <div className="text-xs text-slate-400">ليس لديك حساب؟ (للزبائن فقط)</div>
             <button type="button" onClick={onToggleSignup} className="text-orange-600 font-bold text-sm">إنشاء حساب جديد</button>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
             <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">حسابات تجريبية:</div>
             <div className="text-[10px] text-slate-500">الأدمن: amiratheer@gmail.com (1234)</div>
             <div className="text-[10px] text-slate-500">المطعم: owner@res.com (123)</div>
             <div className="text-[10px] text-slate-500">الزبون: customer@test.com (123)</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
