
import React, { useState } from 'react';
import { Task } from '../types';
import { generateTaskDescription } from '../services/geminiService';
import { 
  Home, 
  Search, 
  PlusCircle, 
  Bell, 
  User as UserIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

interface UserViewProps {
  tasks: Task[];
}

const UserView: React.FC<UserViewProps> = ({ tasks }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [explainingTaskId, setExplainingTaskId] = useState<string | null>(null);
  const [taskDescriptions, setTaskDescriptions] = useState<Record<string, string>>({});

  const handleExplainTask = async (task: Task) => {
    if (taskDescriptions[task.id]) return;
    setExplainingTaskId(task.id);
    const desc = await generateTaskDescription(task.title);
    setTaskDescriptions(prev => ({ ...prev, [task.id]: desc }));
    setExplainingTaskId(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 pt-8 pb-20 overflow-y-auto no-scrollbar">
      {/* App Header */}
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">أهلاً بك 👋</h2>
          <p className="text-slate-500 text-sm">لديك {tasks.filter(t => t.status === 'pending').length} مهام متبقية</p>
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-indigo-500">
             <img src="https://picsum.photos/100/100" alt="avatar" />
          </div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
        </div>
      </div>

      {/* Featured Card */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-2">تحديثات النظام</h3>
            <p className="text-indigo-100 text-sm mb-4">تم إضافة ميزات الذكاء الاصطناعي الجديدة للوحة التحكم وتطبيقك الشخصي.</p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs backdrop-blur-md transition-all">
              اكتشف المزيد
            </button>
          </div>
          <div className="absolute -bottom-6 -right-6 opacity-20 transform rotate-12">
            <Sparkles size={120} />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="px-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-800">مهامي الحالية</h4>
          <button className="text-indigo-600 text-sm font-semibold">عرض الكل</button>
        </div>
        
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className={`mt-1 ${
                  task.status === 'completed' ? 'text-green-500' : 
                  task.status === 'in-progress' ? 'text-orange-500' : 'text-slate-300'
                }`}>
                  {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h5 className={`font-bold ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h5>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      task.priority === 'high' ? 'bg-red-50 text-red-600' : 
                      task.priority === 'medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {task.priority === 'high' ? 'عالي' : task.priority === 'medium' ? 'متوسط' : 'عادي'}
                    </span>
                  </div>
                  
                  {taskDescriptions[task.id] && (
                    <p className="text-xs text-slate-500 mt-2 p-2 bg-slate-50 rounded-lg italic">
                      {taskDescriptions[task.id]}
                    </p>
                  )}

                  <div className="mt-3 flex justify-between items-center">
                    <button 
                      onClick={() => handleExplainTask(task)}
                      disabled={explainingTaskId === task.id}
                      className="text-[10px] flex items-center gap-1 text-indigo-500 font-bold hover:text-indigo-700 disabled:opacity-50"
                    >
                      {explainingTaskId === task.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      وصف بالذكاء الاصطناعي
                    </button>
                    <span className="text-[10px] text-slate-400">{task.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center py-4 px-4 z-30">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={22} />} label="الرئيسية" />
        <NavButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<Search size={22} />} label="بحث" />
        <div className="relative -top-8">
           <button className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-200 ring-4 ring-white">
            <PlusCircle size={28} />
           </button>
        </div>
        <NavButton active={activeTab === 'notif'} onClick={() => setActiveTab('notif')} icon={<Bell size={22} />} label="تنبيهات" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon size={22} />} label="حسابي" />
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-600' : 'text-slate-400'}`}
  >
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

export default UserView;
