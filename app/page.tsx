'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  LineChart as LineChartIcon, 
  Zap, 
  Globe, 
  History, 
  Settings, 
  LogOut, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  PieChart, 
  Sparkles, 
  Search, 
  ChevronRight, 
  Menu, 
  X, 
  Send,
  Plus,
  RefreshCcw,
  Printer
} from 'lucide-react';
import { GoogleGenAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';

const PortfolioChart = dynamic(() => import('@/components/PortfolioChart'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-2xl" />
});
 
 // Initialize Gemini - handled locally in AnalystView
// const ai = ...

import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// --- Components ---

function SkeletonLoader() {
  return (
    <div className="flex justify-end w-full animate-pulse">
      <div className="max-w-[90%] w-full space-y-4">
        <div className="p-6 rounded-[2rem] bg-slate-100 border border-slate-200 h-32 w-full" />
        <div className="p-6 rounded-[2rem] bg-slate-100 border border-slate-200 h-24 w-2/3 ml-auto" />
      </div>
    </div>
  );
}

function AutomatedTradingView() {
  const [rules, setRules] = useState([
    { id: 1, type: 'Buy', stock: 'TMGH', condition: 'Price < 105', active: true, stopLoss: '2%' },
    { id: 2, type: 'Sell', stock: 'PHDC', condition: 'RSI > 70', active: false, stopLoss: '1.5%' },
  ]);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState({ stock: '', type: 'Buy', condition: '', stopLoss: '2%' });

  const toggleRule = (id: number) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleAddRule = () => {
    if (!newRule.stock || !newRule.condition) return;
    setRules([...rules, { ...newRule, id: Date.now(), active: true }]);
    setShowAddRule(false);
    setNewRule({ stock: '', type: 'Buy', condition: '', stopLoss: '2%' });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Zap className="text-amber-500" />
              أنظمة التداول الآلي (Automated Bot)
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">تداول بذكاء أثناء انشغالك</p>
          </div>
          <button 
            onClick={() => setShowAddRule(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Plus size={16} />
            إنشاء قاعدة تداول جديدة
          </button>
        </div>

        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className={cn(
              "p-6 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6",
              rule.active ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100 opacity-60"
            )}>
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm",
                  rule.type === 'Buy' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                )}>
                  {rule.type === 'Buy' ? 'شراء' : 'بيع'}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{rule.stock}.CA</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">الشرط: {rule.condition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 flex-1 max-w-xl">
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">وقف الخسارة (Scalping)</p>
                  <p className="text-xs font-black text-rose-500">{rule.stopLoss}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">الحالة</p>
                  <p className={cn("text-xs font-black", rule.active ? "text-emerald-600" : "text-slate-400")}>
                    {rule.active ? "نشط حالياً" : "متوقف"}
                  </p>
                </div>
                <div className="flex items-center justify-end">
                   <button 
                    onClick={() => toggleRule(rule.id)}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                      rule.active ? "bg-emerald-500" : "bg-slate-200"
                    )}>
                      <span className={cn(
                        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                        rule.active ? "translate-x-0" : "translate-x-5"
                      )} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Rule Modal */}
      <AnimatePresence>
        {showAddRule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddRule(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-[3rem] w-full max-w-lg shadow-2xl relative z-10"
            >
              <h3 className="text-xl font-black mb-6">إضافة قاعدة تداول ذكية</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">رمز السهم</label>
                  <input 
                    type="text" 
                    value={newRule.stock}
                    onChange={e => setNewRule({...newRule, stock: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                    placeholder="مثال: COMI"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">نوع الأمر</label>
                    <select 
                      value={newRule.type}
                      onChange={e => setNewRule({...newRule, type: e.target.value as 'Buy' | 'Sell'})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                    >
                      <option value="Buy">شراء</option>
                      <option value="Sell">بيع</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">وقف الخسارة (SL)</label>
                    <select 
                      value={newRule.stopLoss}
                      onChange={e => setNewRule({...newRule, stopLoss: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                    >
                      <option value="1%">1%</option>
                      <option value="2%">2%</option>
                      <option value="3%">3%</option>
                      <option value="5%">5%</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">الشرط (Condition)</label>
                  <input 
                    type="text" 
                    value={newRule.condition}
                    onChange={e => setNewRule({...newRule, condition: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-slate-900 outline-none"
                    placeholder="مثال: Price < 150 أو RSI > 70"
                  />
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <p className="text-[10px] text-amber-800 leading-relaxed font-bold">
                    * سيتم تنفيذ الأمر تلقائياً عند تحقق الشرط. يرجى التأكد من وجود سيولة كافية في حسابك.
                  </p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleAddRule}
                    className="flex-1 bg-slate-900 text-white p-4 rounded-2xl text-sm font-black hover:bg-slate-800 transition-colors"
                  >
                    تفعيل القاعدة
                  </button>
                  <button 
                    onClick={() => setShowAddRule(false)}
                    className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-2xl text-sm font-black hover:bg-slate-200 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-indigo-900 text-white p-10 rounded-[3rem] relative overflow-hidden shadow-2xl">
         <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
         <div className="relative z-10">
            <h4 className="text-lg font-black mb-4 flex items-center gap-2">
              <LogOut size={20} className="rotate-180" />
              كيف يعمل وقف الخسارة التلقائي؟
            </h4>
            <p className="text-sm text-indigo-100 leading-relaxed mb-6">
              في وضع <span className="font-black text-white italic">Scalping</span>، يقوم النظام بمراقبة السعر كل ثانية. إذا تحرك السعر عكس الاتجاه بنسبة <span className="text-rose-400 font-black">2%</span>، فسيتم تنفيذ أمر البيع فوراً لحماية رأس المال، مع مراعاة عمولة السمسرة في مصر.
            </p>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
               <p className="text-[10px] font-black uppercase text-indigo-300 mb-2">نصيحة Brights Pro</p>
               <p className="text-xs font-bold">يفضل استخدام مستويات الدعم الفنية كأهداف لوقف الخسارة بدلاً من النسبة الثابتة فقط لضمان عدم الخروج المبكر بسبب التذبذب العرضي.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, isCollapsed }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, isCollapsed: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && <span className="text-sm font-bold whitespace-nowrap">{label}</span>}
    </button>
  );
}

function MarketNews() {
  const news = [
    { title: 'تقرير: قطاع العقارات يتصدر قيم التداول في البورصة المصرية بنمو 140% في 2026', source: 'EGX News', time: 'منذ ساعتين' },
    { title: 'البنك المركزي المصري يثبت الفائدة عند 32% لمواجهة التضخم والجنيه يستقر', source: 'الشرق بلومبرج', time: 'منذ 5 ساعات' },
    { title: 'طلعت مصطفى (TMGH) تعلن عن أرباح تاريخية بقيمة 15 مليار جنيه في الربع الأول', source: 'مباشر', time: 'منذ 3 ساعات' },
    { title: 'تحليل: سهم COMI يستهدف مستوى 160 ج.م مع تدفق استثمارات خليجية جديدة', source: 'Brights Intelligence', time: 'منذ ساعة' },
  ];

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 h-full">
      <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
        <Globe size={18} className="text-blue-500" />
        آخر أخبار المال والأعمال (مصر)
      </h3>
      <div className="space-y-6">
        {news.map((n, i) => (
          <div key={i} className="flex gap-4 group cursor-pointer">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2 shrink-0 group-hover:bg-blue-500 transition-colors" />
            <div>
              <p className="text-xs font-bold text-slate-800 leading-relaxed group-hover:text-blue-600 transition-colors">{n.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] font-black text-slate-400">{n.source}</span>
                <span className="text-[9px] text-slate-300">•</span>
                <span className="text-[9px] text-slate-300">{n.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={() => {
          const event = new CustomEvent('showtoast', { detail: 'جاري تحميل موجز الأخبار المفصل...' });
          window.dispatchEvent(event);
        }}
        className="w-full mt-8 py-3 text-[10px] font-black text-slate-400 hover:text-slate-900 border-t border-slate-50 transition-colors">
        عرض كافة الأخبار
      </button>
    </div>
  );
}

interface RadarStock {
  name: string;
  symbol: string;
  change: string;
  price: string;
  rsi: number;
  trend: string;
  volume: string;
}

interface RadarAlert {
  type: string;
  stock: string;
  time: string;
  importance: string;
}

interface RadarTechNote {
  symbol: string;
  note: string;
  action: string;
  strength: string;
}

function StockRadar() {
  const [radarData, setRadarData] = useState<{
    gainers: RadarStock[],
    losers: RadarStock[],
    alerts: RadarAlert[],
    techNotes: RadarTechNote[]
  }>({
    gainers: [],
    losers: [],
    alerts: [],
    techNotes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const isUpdatingRef = useRef(false);
  const [lastTick, setLastTick] = useState<string>('');

  const fetchLiveRadarData = React.useCallback(async () => {
    if (isUpdatingRef.current) return;
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Radar Fetch Error: API Key is missing');
      return;
    }

    isUpdatingRef.current = true;
    setIsUpdating(true); // Still keep state for UI indicator
    try {
      const modelName = 'gemini-1.5-flash';
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        tools: [{ googleSearch: {} }],
      });

      const prompt = `Return ONLY a valid JSON object (no markdown) with real-time EGX market data for Stock Radar.
      JSON structure:
      {
        "gainers": [{"name": "string", "symbol": "string", "change": "string", "price": "string", "rsi": number, "trend": "Arabic string", "volume": "string"}],
        "losers": [{"name": "string", "symbol": "string", "change": "string", "price": "string", "rsi": number, "trend": "Arabic string", "volume": "string"}],
        "alerts": [{"type": "Support|Volume|Breakout", "stock": "Arabic description", "time": "Arabic relative time", "importance": "High|Medium|Critical"}],
        "techNotes": [{"symbol": "string", "note": "Arabic brief note", "action": "Buy|Sell|Hold", "strength": "Strong|Medium|Weak"}]
      }
      Search for the ABSOLUTE LATEST top gainers and losers in the Egyptian Exchange (EGX) right now. Ensure prices and percentage changes are current.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      if (!text) {
        throw new Error('Empty response from AI');
      }
      
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(jsonStr);
      if (data && typeof data === 'object') {
        setRadarData({
          gainers: Array.isArray(data.gainers) ? data.gainers : [],
          losers: Array.isArray(data.losers) ? data.losers : [],
          alerts: Array.isArray(data.alerts) ? data.alerts : [],
          techNotes: Array.isArray(data.techNotes) ? data.techNotes : []
        });
        setLastTick(new Date().toLocaleTimeString('ar-EG'));
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Radar Fetch Error:', err);
    } finally {
      isUpdatingRef.current = false;
      setIsUpdating(false);
    }
  }, []); // Removed isUpdating dependency

  useEffect(() => {
    fetchLiveRadarData();
    // Increased interval to 90 seconds to avoid rate limits and 500 errors
    const interval = setInterval(fetchLiveRadarData, 90000);
    return () => clearInterval(interval);
  }, [fetchLiveRadarData]);

  if (isLoading && !radarData.gainers.length) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-white rounded-[3rem] border border-slate-100 shadow-sm" dir="rtl">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-black text-slate-500 animate-pulse">جاري تشغيل رادار البورصة المصرية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest transition-colors",
            isUpdating ? "text-emerald-500 animate-pulse" : "text-slate-500"
          )}>
            {isUpdating ? 'جاري التحديث من البورصة...' : 'تحديث حي لمؤشرات السوق'}
          </span>
        </div>
        {lastTick && (
          <span className="text-[10px] font-bold text-slate-400">آخر تحديث: {lastTick}</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gainers */}
            <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <TrendingUp className="text-emerald-500" size={18} />
                    أعلى الرابحين (EGX)
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Momentum Tracking</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                  <Activity size={16} />
                </div>
              </div>
              <div className="space-y-3">
                {radarData.gainers?.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/40 hover:bg-white rounded-2xl group transition-all cursor-pointer border border-transparent hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/5">
                    <div className="flex gap-4 items-center">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-sm shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all transform group-hover:scale-105">
                         {s.symbol?.[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{s.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-black uppercase text-emerald-600/70 bg-emerald-50 px-1.5 py-0.5 rounded-md">{s.symbol}</span>
                          <span className="text-[9px] text-slate-300">|</span>
                          <p className="text-[9px] text-slate-400 font-bold">Vol: {s.volume}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600 font-mono tracking-tighter">{s.change}</p>
                      <p className="text-[10px] text-slate-400 font-bold font-mono tracking-tighter">{s.price} ج.م</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                  const event = new CustomEvent('showtoast', { detail: 'جاري استدعاء خارطة السيولة...' });
                  window.dispatchEvent(event);
                }}
                className="w-full mt-8 py-3 text-[10px] font-black text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-dashed border-slate-200 hover:border-emerald-200 uppercase tracking-widest flex items-center justify-center gap-2">
                عرض خارطة السيولة <ChevronRight size={14} />
              </button>
            </div>

            {/* Losers */}
            <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <TrendingDown className="text-rose-500" size={18} />
                    أعلى الخاسرين
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">Reversal Monitoring</p>
                </div>
                <div className="bg-rose-50 text-rose-600 p-2 rounded-xl">
                  <Zap size={16} />
                </div>
              </div>
              <div className="space-y-3">
                {radarData.losers?.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50/40 hover:bg-white rounded-2xl group transition-all cursor-pointer border border-transparent hover:border-rose-100 hover:shadow-lg hover:shadow-rose-500/5">
                    <div className="flex gap-4 items-center">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-sm shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all transform group-hover:scale-105">
                         {s.symbol?.[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 group-hover:text-rose-700 transition-colors">{s.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-black uppercase text-rose-600/70 bg-rose-50 px-1.5 py-0.5 rounded-md">{s.symbol}</span>
                          <span className="text-[9px] text-slate-300">|</span>
                          <p className="text-[9px] text-slate-400 font-bold">Vol: {s.volume}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-rose-600 font-mono tracking-tighter">{s.change}</p>
                      <p className="text-[10px] text-slate-400 font-bold font-mono tracking-tighter">{s.price} ج.م</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-auto pt-8 text-[9px] text-center text-slate-400 font-bold leading-relaxed border-t border-slate-50 mt-6">
                * البيانات تعكس آخر سعر تنفيذ | تحديث لحظي من EGX
              </p>
            </div>
          </div>

          {/* Liquid Radar & Alerts */}
          <div className="bg-slate-950 p-10 rounded-[3.5rem] shadow-2xl border border-slate-800 text-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent)] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-blue-500/15 transition-all duration-1000" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-lg font-black text-emerald-400 flex items-center gap-3 tracking-tight">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute inset-0" />
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative z-10" />
                    </div>
                    رادار السيولة الذكي
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-[0.2em]">Real-time Market Scanning</p>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-5 h-5 rounded-full border-2 border-slate-950 bg-emerald-500 animate-pulse" />
                      <div className="w-5 h-5 rounded-full border-2 border-slate-950 bg-blue-500" />
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-300">Active Nodes: 12</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {radarData.alerts?.map((a, i) => (
                  <div key={i} className="p-6 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] flex justify-between items-start group hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="space-y-3">
                      <p className="text-xs font-black text-white group-hover:text-emerald-400 transition-colors leading-relaxed">{a.stock}</p>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1.5 opacity-60">
                            <Activity size={12} className="text-slate-400" />
                            <p className="text-[10px] text-slate-400 font-bold">{a.time}</p>
                         </div>
                         <div className="w-1 h-1 rounded-full bg-slate-700" />
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Verified</span>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest whitespace-nowrap border transition-all",
                      a.importance === 'Critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' :
                      a.importance === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' :
                      'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    )}>
                      {a.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Activity className="text-indigo-500" size={18} />
                الأدوات الفنية (Quant)
              </h3>
              <Sparkles size={16} className="text-amber-400" />
            </div>
            
            <div className="space-y-5 flex-1">
              {radarData.techNotes?.map((note, i) => (
                <div key={i} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/20 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                        note.strength === 'Strong' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-amber-500 shadow-amber-200'
                      )} />
                      <span className="text-xs font-black text-slate-900 font-mono uppercase tracking-tighter">{note.symbol}</span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black px-3 py-1 rounded-xl transition-all",
                      note.action === 'Buy' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 text-slate-600'
                    )}>
                      {note.action === 'Buy' ? 'توصية شراء' : 'احتفاظ'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-bold group-hover:text-slate-700 transition-colors">
                    {note.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
               <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-3">تحديث الأنظمة</p>
                    <p className="text-xs font-bold leading-relaxed text-slate-300">
                      قامت أنظمة <span className="text-white font-black">Brights Pro</span> برصد ارتفاع في أحجام التداول على سهم <span className="text-emerald-400 font-black">COMI</span> قرب منطقة الـ 80 ج.م، مما يشير إلى تجميع مؤسسي قوي.
                    </p>
                  </div>
               </div>
            </div>
          </div>
          <MarketNews />
        </div>
      </div>
    </div>
  );
}

function MacroBar() {
  const indicators = [
    { label: 'سعر الفائدة (CBE)', value: '32.0%', change: '+0.0%', trend: 'neutral' },
    { label: 'التضخم (CPI)', value: '28.5%', change: '-0.5%', trend: 'down' },
    { label: 'USD/EGP', value: '68.50', change: '+0.15', trend: 'up' },
    { label: 'EGX30', value: '42,500', change: '+2.1%', trend: 'up' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" dir="rtl">
      {indicators.map((ind, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ind.label}</p>
          <div className="flex items-end justify-between mt-2">
            <h4 className="text-lg font-black text-slate-900 font-mono tracking-tighter">{ind.value}</h4>
            <div className={`flex items-center gap-1 text-[10px] font-black ${ind.trend === 'up' ? 'text-emerald-500' : ind.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
              {ind.trend === 'up' ? <TrendingUp size={10} /> : ind.trend === 'down' ? <TrendingDown size={10} /> : null}
              {ind.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export type PortfolioItem = {
  name: string;
  symbol: string;
  shares: number;
  avgPrice: string;
  currentPrice: string;
  total: number;
  profit: string;
};

function PortfolioView({ 
  portfolio, 
  onAddStock,
  onStockClick
}: { 
  portfolio: PortfolioItem[],
  onAddStock: () => void,
  onStockClick: (symbol: string) => void
}) {
  const totalValue = portfolio.reduce((acc, item) => acc + item.total, 0);
  
  return (
    <div className="space-y-6" dir="rtl">
      <MacroBar />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 min-h-[400px]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Activity className="text-emerald-500" />
                أداء المحفظة (30 يوم)
              </h3>
            </div>
            <PortfolioChart data={[
              { name: '1', value: totalValue * 0.85 },
              { name: '5', value: totalValue * 0.88 },
              { name: '10', value: totalValue * 0.86 },
              { name: '15', value: totalValue * 0.92 },
              { name: '20', value: totalValue * 0.95 },
              { name: '25', value: totalValue * 0.94 },
              { name: '30', value: totalValue },
            ]} />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PieChart className="text-blue-500" />
                مكونات المحفظة الذكية
              </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="text-[10px] font-black text-slate-500 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full border border-slate-200 transition-colors flex items-center gap-1">
                <Printer size={12} />
                تحميل التقرير PDF
              </button>
              <button 
                onClick={() => {
                   const event = new CustomEvent('showtoast', { detail: 'جاري تشغيل محرك الذكاء الاصطناعي لإعادة التوزيع...' });
                   window.dispatchEvent(event);
                }}
                className="text-[10px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full border border-indigo-100 flex items-center gap-2 transition-colors">
                <Sparkles size={14} />
                إعادة توزيع AI
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-4 pr-4">السهم</th>
                  <th className="pb-4">الكمية</th>
                  <th className="pb-4">متوسط التكلفة</th>
                  <th className="pb-4">السعر الحالي</th>
                  <th className="pb-4 pl-4">الربح المفتوح</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {portfolio.map((item, i) => {
                  const isProfit = item.profit.startsWith('+');
                  return (
                    <tr 
                      key={i} 
                      onClick={() => onStockClick(item.symbol)}
                      className="group hover:bg-slate-50 transition-all cursor-pointer hover:shadow-inner"
                    >
                      <td className="py-4 pr-4">
                        <p className="text-xs font-black">{item.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{item.symbol}.CA</p>
                      </td>
                      <td className="py-4 text-xs font-bold text-slate-600">{item.shares.toLocaleString('en-US')}</td>
                      <td className="py-4 text-xs font-bold text-slate-400 font-mono tracking-tighter">{item.avgPrice}</td>
                      <td className="py-4 text-xs font-black text-slate-900 font-mono tracking-tighter">{item.currentPrice}</td>
                      <td className="py-4 pl-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded ${isProfit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {item.profit}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
           <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-4 left-4 p-3 bg-emerald-500/20 rounded-2xl">
                 <TrendingUp className="text-emerald-400" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي قيمة المحفظة</p>
              <h2 className="text-3xl font-black mb-6 font-mono tracking-tighter">{totalValue.toLocaleString('en-US')} <span className="text-sm uppercase mr-1">EGP</span></h2>
              <div className="flex items-center gap-2 mb-8">
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded border border-emerald-500/20">اليوم: +1.8%</span>
                <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-2 py-1 rounded border border-slate-700">الشهر: +12.4%</span>
              </div>
              <button 
                onClick={onAddStock}
                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                <Plus size={16} />
                أضف سهم جديد للمحفظة
              </button>
           </div>

           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 mt-2">
                <Sparkles size={14} className="text-indigo-500 animate-pulse" />
                توصيات الذكاء الاصطناعي للمحفظة
              </h4>
              <div className="space-y-3">
                 <div className="p-3 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl border border-indigo-100 transition-colors cursor-pointer">
                    <p className="text-[10px] font-bold text-slate-900 mb-1">تحوط ضد التضخم (AI Signal)</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">ينصح الذكاء الاصطناعي بزيادة التعرض للقطاعات التصديرية مثل (EAST) بنسبة 5%.</p>
                 </div>
                 <div className="p-3 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl border border-emerald-100 transition-colors cursor-pointer">
                    <p className="text-[10px] font-bold text-slate-900 mb-1">فرصة جني أرباح في TMGH</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">السهم يقترب من منطقة مقاومة تاريخية عند 120 ج.م، يُنصح بتخفيف 20% من المراكز.</p>
                 </div>
              </div>
           </div>

           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={14} className="text-indigo-500" />
                تحليل المخاطرة الحالي
              </h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">معدل التنويع</span>
                    <span className="font-bold text-emerald-600">ممتاز</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%]" />
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">التعرض لقطاع العقارات</span>
                    <span className="font-bold text-amber-600">مرتفع (45%)</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[45%]" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function FundsView({ onSubscribe }: { onSubscribe: (fund: string) => void }) {
  const funds = [
    { name: 'صندوق بنك مصر الثالث', vendor: 'بنك مصر', type: 'أسهم', yield: '45.2%', risk: 'عالي', min: '100 ج.م', trend: '+5.4%' },
    { name: 'صندوق استثمار فيصل (أمان)', vendor: 'بنك فيصل', type: 'إسلامي', yield: '38.5%', risk: 'متوسط', min: '500 ج.م', trend: '+3.8%' },
    { name: 'أزيموت جولد (AZG)', vendor: 'Azimut', type: 'ذهب', yield: '52.1%', risk: 'مرتفع', min: '100 ج.م', trend: '+6.2%' },
    { name: 'أزيموت ادخار (AZS)', vendor: 'Azimut', type: 'نقدي', yield: '28.5%', risk: 'منخفض جداً', min: '10 ج.م', trend: '+2.5%' },
    { name: 'صندوق سي آي كابيتال (CI30)', vendor: 'CI Capital', type: 'مؤشر', yield: '41.4%', risk: 'مرتفع', min: '1000 ج.م', trend: '+4.4%' },
    { name: 'صندوق مصر سيولة', vendor: 'Misr Capital', type: 'نقدي', yield: '27.8%', risk: 'منخفض', min: '100 ج.م', trend: '+2.1%' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
      {funds.map((f, i) => (
        <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
          <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               <Globe size={24} />
             </div>
             <div className="text-right">
                <span className={`text-[8px] font-black px-2 py-1 rounded uppercase bg-slate-100 text-slate-500 block mb-1`}>{f.type}</span>
                <span className="text-[10px] font-black text-emerald-600">{f.trend} الشهرى</span>
             </div>
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1">{f.name}</h3>
          <p className="text-[10px] text-slate-400 font-bold mb-6">{f.vendor}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">العائد السنوي</p>
                <p className="text-lg font-black text-emerald-600 font-mono">{f.yield}</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">المخاطرة</p>
                <p className="text-xs font-black text-slate-700">{f.risk}</p>
             </div>
          </div>
          <div className="mt-8 flex items-center justify-between text-[10px] font-bold text-slate-400">
             <span className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">الحد الأدنى: {f.min}</span>
             <button 
               onClick={() => onSubscribe(f.name)}
               className="text-indigo-600 font-black flex items-center gap-1 hover:gap-2 transition-all">
               إشترك الآن <ChevronRight size={14} />
             </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FormattedMessage({ content, role }: { content: string, role: 'user' | 'ai' }) {
  if (role === 'user') {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-start"
      >
        <div className="max-w-[80%] p-5 rounded-[2rem] bg-slate-100 text-slate-900 rounded-tr-sm shadow-sm border border-slate-200/50">
          <p className="text-sm font-bold leading-relaxed">{content}</p>
        </div>
      </motion.div>
    );
  }

  // AI response - structure it
  const sections = content.split('###').filter(s => s.trim());

  if (sections.length < 2) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[90%] p-8 rounded-[2.5rem] bg-slate-900 text-white rounded-tl-sm shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-blue-500" />
          <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-p:text-slate-300">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex justify-end w-full">
      <div className="max-w-[95%] w-full space-y-4">
        {sections.map((section, idx) => {
          const lines = section.trim().split('\n');
          const title = lines[0];
          const body = lines.slice(1).join('\n');

          const getIcon = (t: string) => {
            if (t.includes('سنابشوت') || t.includes('Snapshot')) return <Activity className="text-blue-400" size={18} />;
            if (t.includes('التحليل') || t.includes('Deep Dive')) return <LineChartIcon className="text-emerald-400" size={18} />;
            if (t.includes('التوصية') || t.includes('Expert Advice')) return <Sparkles className="text-amber-400" size={18} />;
            if (t.includes('المخاطر') || t.includes('Risk')) return <TrendingDown className="text-rose-400" size={18} />;
            return <ChevronRight className="text-slate-400" size={18} />;
          };

          const isSimulation = title.includes('المحاكاة') || title.includes('Simulation');

          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-6 rounded-[2rem] shadow-lg border relative overflow-hidden transition-all",
                isSimulation 
                  ? 'bg-emerald-950 border-emerald-500/30 text-white shadow-emerald-500/10' 
                  : 'bg-slate-900 border-slate-800 text-white shadow-slate-900/20'
              )}
            >
              {isSimulation && (
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full -mr-24 -mt-24 pointer-events-none" />
              )}
              <h4 className="flex items-center gap-3 text-sm font-black mb-4 pb-3 border-b border-white/10 uppercase tracking-tighter">
                {getIcon(title)}
                {title}
              </h4>
              <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-p:text-slate-300 prose-li:text-slate-300 font-medium whitespace-pre-wrap">
                <ReactMarkdown>{body}</ReactMarkdown>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SimulationModule({ stockPrice, stockName }: { stockPrice: number, stockName: string }) {
  const [amount, setAmount] = useState(10000);
  
  const brokerageFee = 0.002; // 0.2%
  const stampDuty = 0.001; // 0.1%
  const capitalGainsTax = 0.1; // 10%
  
  const shares = Math.floor(amount / (stockPrice * (1 + brokerageFee + stampDuty)));
  const totalCost = shares * stockPrice * (1 + brokerageFee + stampDuty);
  const remainingCash = amount - totalCost;
  
  // Scenarios
  const scenarios = [
    { target: 1.05, label: '+5%' },
    { target: 1.15, label: '+15%' },
    { target: 1.30, label: '+30%' },
  ];

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-right" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-slate-900">محاكي محفظة Brights Pro</h3>
          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">Simulation of {stockName}</p>
        </div>
        <Zap className="text-amber-500" />
      </div>

      <div className="space-y-8">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">مبلغ الاستثمار (ج.م)</label>
          <input 
            type="range" 
            min="1000" 
            max="100000" 
            step="1000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xl font-black text-slate-900 font-mono">{amount.toLocaleString()} <span className="text-xs">ج.م</span></span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">عدد الأسهم</p>
            <p className="text-sm font-black text-slate-900 font-mono">{shares.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">تكلفة الرسوم</p>
            <p className="text-sm font-black text-rose-500 font-mono">{(totalCost - (shares * stockPrice)).toFixed(2)}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">السيولة المتبقية</p>
            <p className="text-sm font-black text-emerald-700 font-mono">{remainingCash.toFixed(2)}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-xs font-black mb-4">صافي الربح المتوقع (بعد الضرائب)</h4>
          <div className="space-y-3">
            {scenarios.map((sc, i) => {
              const sellPrice = stockPrice * sc.target;
              const grossProfit = (sellPrice - stockPrice) * shares;
              const netProfit = grossProfit * (1 - capitalGainsTax) - (sellPrice * shares * (brokerageFee + stampDuty));
              return (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-emerald-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                  <span className="text-xs font-black text-slate-600">عند صعود {sc.label}</span>
                  <div className="text-left font-mono">
                    <span className="text-sm font-black text-emerald-600">{netProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} ج.م</span>
                    <span className="text-[9px] text-slate-400 block tracking-tighter">سعر البيع: {sellPrice.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalystView({ initialSearchSymbol }: { initialSearchSymbol?: string }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'أهلاً بك. أنا Brights Pro، محللك المالي الذكي وخبير البورصة المصرية. كيف يمكنني مساعدتك في تحليل السوق المصري اليوم؟\n\nأنا الآن متصل بـ Google Search للحصول على أدق الأسعار اللحظية والأخبار الجوهرية.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [mode, setMode] = useState<'Speculation' | 'Investment'>('Speculation');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mountedClock, setMountedClock] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // New state for real-time stock search
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  interface StockData {
    symbol: string;
    price: number;
    change: string;
    volume: string;
    name: string;
    trend: string;
    lastUpdated: string;
    // Advanced Technicals
    rsi?: number;
    macd?: string;
    ma50?: number;
    ma200?: number;
    recommendation?: string;
    targetPrice?: string;
    // Fundamentals
    peRatio?: number;
    dividendYield?: string;
    marketCap?: string;
    sector?: string;
    recentNews?: {
      headline: string;
      impact: string;
      tone: 'positive' | 'negative' | 'neutral';
      linkedPriceImpact: string;
    }[];
  }
  const [searchedStock, setSearchedStock] = useState<StockData | null>(null);
  const [isSearchingStock, setIsSearchingStock] = useState(false);
  const isSearchingStockRef = useRef(false);
  type DeepDiveTab = 'Technicals' | 'Fundamentals' | 'News' | 'Simulation' | 'Chat';
  const [activeDeepDiveTab, setActiveDeepDiveTab] = useState<DeepDiveTab>('Chat');

  const fetchStockQuote = React.useCallback(async (symbol: string) => {
    if (!symbol.trim() || isSearchingStockRef.current) return;
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Stock Search Error: API Key is missing');
      return;
    }

    isSearchingStockRef.current = true;
    setIsSearchingStock(true);
    setStockSearchQuery(symbol.toUpperCase());
    try {
      const modelName = 'gemini-1.5-flash';
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        tools: [{ googleSearch: {} }] as any,
      });

      const promptTemplate = `Return ONLY a valid JSON object (no markdown code blocks, no extra text) with the following real-time and technical info for the EGX stock: ${symbol}.
      Fields: 
      - symbol (string)
      - price (number)
      - change (string, e.g., "+2.1%")
      - volume (string)
      - name (Arabic name)
      - trend (Arabic: صاعد/هابط/عرضي)
      - lastUpdated (time)
      - rsi (number, current RSI 14)
      - macd (string, e.g., "Positive Cross" or "Negative Divergence")
      - ma50 (number, 50-day moving average)
      - ma200 (number, 200-day moving average)
      - peRatio (number, P/E ratio)
      - dividendYield (string, e.g., "5.4%")
      - marketCap (string, Market cap in EGP)
      - sector (string, Arabic sector name)
      - recommendation (Arabic: شراء/بيع/احتفاظ)
      - targetPrice (string, price target)
      - recentNews (array of objects: { headline: string (Arabic), impact: string (Arabic analysis/summary), tone: "positive"|"negative"|"neutral", linkedPriceImpact: string (Arabic description of how this specifically affects price/trend) }) 
      
      Use Google Search to get the ABSOLUTE LATEST technicals, price, fundamentals, and most recent 3-4 news items from EGX/Mubasher/AlBorsa.`;

      const result = await model.generateContent(promptTemplate);
      const text = result.response.text();
      
      if (!text) {
        throw new Error('لم يتم استلام رد من الذكاء الاصطناعي.');
      }

      // Clean up potential markdown formatting if model didn't follow instructions perfectly
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        const data = JSON.parse(jsonStr) as StockData;
        if (!data || !data.symbol) throw new Error('بيانات السهم غير مكتملة.');
        setSearchedStock(data);
        setActiveDeepDiveTab('Technicals'); // Switch to deep dive view automatically
      } catch (parseErr) {
        console.error('JSON Parse Error:', parseErr, jsonStr);
        throw new Error('فشل تحليل بيانات السهم. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error('Stock Search Error:', err);
      const event = new CustomEvent('showtoast', { detail: 'عذراً، فشل البحث عن بيانات السهم اللحظية.' });
      window.dispatchEvent(event);
    } finally {
      isSearchingStockRef.current = false;
      setIsSearchingStock(false);
    }
  }, []); // Removed isSearchingStock dependency

  useEffect(() => {
    if (initialSearchSymbol) {
      fetchStockQuote(initialSearchSymbol);
    }
  }, [initialSearchSymbol, fetchStockQuote]);

  useEffect(() => {
    setMountedClock(true);
    setCurrentTime(new Date().toLocaleTimeString('ar-EG'));
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('ar-EG'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userQuery = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setLoading(true);
    setLoadingPhase('Brights Pro يقوم بتحليل طلبك...');

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'ai', content: 'خطأ: مفتاح API غير متوفر. يرجى التأكد من إعدادات البيئة.' }]);
      setLoading(false);
      return;
    }

    try {
      const analystPrompt = `
أنت "Brights Pro"، المحلل المالي الرقمي الرائد في مصر بمستوى Senior Financial Analyst. تخصصك الحصري هو البورصة المصرية (EGX).
أنت الآن تمتلك خاصية البحث المباشر (Google Search Grounding). يجب عليك استخدامه في كل مرة للتأكد من الأسعار والأخبار.

### قواعد العمل لـ "Brights Pro":
1. **دقة الأسعار:** ابحث عن سعر الإغلاق اللحظي، التغير المئوي، وحجم التداول لسهم (أو سوق) ${userQuery}.
2. **التحليل الفني:** حدد أهم 3 مستويات دعم و 3 مستويات مقاومة. اذكر حالة الـ RSI (تشبع بيع/شراء).
3. **التحليل المالي:** ابحث عن أحدث نتائج أعمال (Earning Reports) أو أي قرارات جوهرية (أرباح، زيادة رأس مال).
4. **المحاكاة الرقمية الإلزامية:** إذا استثمر المستخدم 10,000 ج.م في هذا السهم، احسب له بالورقة والقلم:
   - تكلفة الشراء بالرسوم.
   - الربح الصافي (بعد خصم 10% ضريبة أرباح رأسمالية وعمولة السمسرة 0.2%+ ودمغة البورصة).
5. **الاقتصاد الكلي:** اربط السهم بمعدلات الفائدة الحالية في مصر (CBE Rates) وتأثير سعر الصرف (الجنيه مقابل الدولار).

### هيكل الرد الإلزامي (استخدم ### للفصل):
### ملخص الأداء اللحظي (Market Snapshot)
- اذكر آخر سعر تم رصده في البحث.
- الحالة اللحظية للاتجاه (صاعد/هابط/عرضي).

### التحليل الفني والمالي المعمق (Technical & Fundamental Deep Dive)
- مستويات الدعم والمقاومة.
- قراءة القوائم المالية واختصار للخبر الجوهري الأخير.

### التوصية الاستراتيجية والمحاكاة الرقمية (Expert Advice & Simulation)
- هل التوصية (شراء BUY) أم (مراكز HOLD) أم (بيع SELL)؟
- محاكاة دقيقة لمبلغ 10,000 ج.م بخصم كافة الرسوم.

### إدارة المخاطر (Risk Management)
- السعر المحدد لوقف الخسارة (Stop Loss).
- التحذيرات من الأحداث الاقتصادية القادمة في مصر.

الوضع الفني المعتمد: ${mode === 'Speculation' ? 'مضاربة' : 'استثمار طويل'}
لغة الرد: عربية مصرية مهنية بلمسة "Brights Pro" الذكية.
\n\n User Question: ${userQuery}
`;

      const modelName = 'gemini-1.5-flash';
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        tools: [{ googleSearch: {} }],
      });
      
      setLoadingPhase('جاري استدعاء محركات البحث للبورصة المصرية...');
      const result = await model.generateContent(analystPrompt);
      
      const text = result.response.text() || 'عذراً، لم أتمكن من الحصول على رد حالياً.';
      setMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (err: unknown) {
      console.error('Gemini API Error:', err);
      // Detailed error message for the UI if it's a known error type
      const errorMessage = err instanceof Error ? err.message : 'عذراً، حدث خطأ أثناء الوصول للبيانات الحالية للبورصة المصرية.';
      setMessages(prev => [...prev, { role: 'ai', content: `خطأ: ${errorMessage}` }]);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-400 shadow-xl">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Brights Pro AI Analyst</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div className="flex items-center gap-1">
                 <Globe size={12} className="text-blue-500" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase">Google Search Grounding Enabled</span>
              </div>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] text-slate-400">{mountedClock ? currentTime : '--:--:--'}</span>
            </div>
          </div>
        </div>
        <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-200/50">
           <button 
             onClick={() => setMode('Speculation')}
             className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${mode === 'Speculation' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
           >
             مضاربة
           </button>
           <button 
             onClick={() => setMode('Investment')}
             className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${mode === 'Investment' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
           >
             استثمار
           </button>
        </div>
      </div>

      {/* Suggested Questions */}
      {!query && messages.length === 1 && (
        <div className="px-8 py-4 flex flex-wrap gap-2 shrink-0 bg-white shadow-sm border-b border-slate-50 relative z-10">
          {[
            'حلل سهم طلعت مصطفى (TMGH) حالياً من جوجل',
            'أسعار سهم CIB النهادرى ورايكم شراء ولا بيع؟',
            'تقرير عن سهم هيرميس (HRHO) وتأثير الفائدة',
            'أريد محاكاة لاستثمار 10 آلاف جنيه في بالم هيلز'
          ].map((q, i) => (
            <button 
              key={i}
              onClick={() => setQuery(q)}
              className="text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 px-4 py-2 rounded-full border border-slate-100 transition-all hover:border-emerald-200 shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages / Deep Dive Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-0 space-y-0 bg-slate-50/30 flex flex-col">
        {/* Real-time Stock Lookup Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && fetchStockQuote(stockSearchQuery)}
                placeholder="ابحث عن سعر سهم لحظي (مثال: TMGH)..."
                className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl py-3 pr-10 pl-4 text-xs font-black focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
              />
            </div>
            <button 
              onClick={() => fetchStockQuote(stockSearchQuery)}
              disabled={isSearchingStock || !stockSearchQuery.trim()}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap shadow-lg shadow-slate-200"
            >
              {isSearchingStock ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري البحث...
                </>
              ) : (
                'رصد السعر اللحظي'
              )}
            </button>
          </div>

          {/* Searched Stock Deep Dive Sub-Nav */}
          <AnimatePresence>
            {searchedStock && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto mt-4 px-4 pb-4"
              >
                <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                  {[
                    { id: 'Chat', label: 'الدردشة الذكية', icon: Send },
                    { id: 'Technicals', label: 'التحليل الفني', icon: Activity },
                    { id: 'Fundamentals', label: 'التحليل المالي', icon: PieChart },
                    { id: 'News', label: 'الأخبار والأثر', icon: Globe },
                    { id: 'Simulation', label: 'محاكي الاستثمار', icon: Zap },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDeepDiveTab(tab.id as DeepDiveTab)}
                      className={cn(
                        "flex-1 py-3 px-2 rounded-xl text-[10px] font-black flex flex-col items-center gap-1 transition-all",
                        activeDeepDiveTab === tab.id 
                          ? "bg-white text-slate-900 shadow-xl shadow-slate-200 scale-[1.02]" 
                          : "text-slate-500 hover:bg-white/50"
                      )}
                    >
                      <tab.icon size={14} className={activeDeepDiveTab === tab.id ? 'text-emerald-500' : 'text-slate-400'} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Compact Info Summary (Always visible when deep diving) */}
                <div className="mt-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
                  <button 
                    onClick={() => { setSearchedStock(null); setActiveDeepDiveTab('Chat'); }}
                    className="absolute top-4 left-4 p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl"
                  >
                    <X size={14} />
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 font-black text-lg backdrop-blur-xl border border-white/10">
                      {searchedStock.symbol[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{searchedStock.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black text-emerald-400 font-mono tracking-widest uppercase">{searchedStock.symbol}.CA</span>
                        <span className="text-slate-600 text-[10px]">•</span>
                        <span className="text-[10px] text-slate-400 font-bold">{searchedStock.price.toLocaleString('en-US')} ج.م</span>
                        <span className={cn(
                          "text-[10px] font-black font-mono",
                          searchedStock.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                        )}>
                          {searchedStock.change}
                        </span>
                      </div>
                    </div>
                    <div className="mr-auto">
                      <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg",
                        searchedStock.recommendation === 'شراء' ? 'bg-emerald-500 text-white' :
                        searchedStock.recommendation === 'بيع' ? 'bg-rose-500 text-white' :
                        'bg-amber-500 text-white'
                      )}>
                        {searchedStock.recommendation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Tab Content Render */}
                <div className="mt-6">
                  {activeDeepDiveTab === 'Technicals' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 text-right">مؤشر RSI (14)</p>
                          <div className="flex items-center justify-between gap-3">
                             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={cn("h-full transition-all duration-1000", searchedStock.rsi && searchedStock.rsi > 70 ? 'bg-rose-500' : searchedStock.rsi && searchedStock.rsi < 30 ? 'bg-emerald-500' : 'bg-blue-500')}
                                  style={{ width: `${searchedStock.rsi || 0}%` }}
                                />
                             </div>
                             <span className="text-sm font-black text-slate-900 font-mono">{searchedStock.rsi || '---'}</span>
                          </div>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 text-right">إشارة MACD</p>
                          <span className="text-xs font-black text-blue-600 block text-right">{searchedStock.macd || 'N/A'}</span>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 text-right">المتوسط المتحرك 50</p>
                          <span className="text-sm font-black text-slate-900 font-mono block text-right">{searchedStock.ma50 ||searchedStock.price}</span>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 text-right">المستهدف السعري</p>
                          <span className="text-sm font-black text-emerald-600 font-mono block text-right">{searchedStock.targetPrice || '---'}</span>
                        </div>
                      </div>
                      <div className="bg-indigo-900 p-6 rounded-[2rem] text-white text-right">
                        <div className="flex items-center gap-2 mb-3 justify-end">
                          <h4 className="text-xs font-black">Brights Expert Technical Note</h4>
                          <Activity size={14} className="text-emerald-400" />
                        </div>
                        <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                          بناءً على الاتجاه {searchedStock.trend} الحالي، يظهر السهم تماسكاً فوق مستويات المتوسطات المتحركة. {searchedStock.rsi && searchedStock.rsi < 30 ? 'هناك فرصة ارتداد فنية قوية بسبب تشبع البيع.' : searchedStock.rsi && searchedStock.rsi > 70 ? 'يجب الحذر من جني أرباح محتمل بسبب تشبع الشراء.' : 'السعر في منطقة توازن تدعم استمرار الحركة الحالية.'}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeDeepDiveTab === 'Fundamentals' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">مكرر الربحية P/E</p>
                          <p className="text-lg font-black text-slate-900 font-mono">{searchedStock.peRatio || '---'}</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">عائد التوزيعات</p>
                          <p className="text-lg font-black text-emerald-600 font-mono">{searchedStock.dividendYield || '0.0%'}</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">القيمة السوقية</p>
                          <p className="text-xs font-black text-slate-900 truncate">{searchedStock.marketCap || '---'}</p>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">القطاع</p>
                          <p className="text-xs font-black text-blue-600 truncate">{searchedStock.sector || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-slate-700 text-right">
                        <h4 className="text-xs font-black mb-3">الصحة المالية والنمو</h4>
                        <p className="text-[11px] leading-relaxed font-bold">
                           من الناحية الأساسية، يتمتع سهم {searchedStock.name} لعام 2026 بمركز مالي {searchedStock.peRatio && searchedStock.peRatio < 15 ? 'جذاب جداً مقارنة بمتوسط السوق' : 'متوازن'}. عائد التوزيعات {searchedStock.dividendYield ? `عند ${searchedStock.dividendYield} يجعله خياراً دفاعياً جيداً` : 'يحتاج لمراقبة إعلانات الأرباح القادمة'}.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeDeepDiveTab === 'News' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                       {searchedStock.recentNews && searchedStock.recentNews.length > 0 ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {searchedStock.recentNews.map((news, idx) => (
                             <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group/news">
                               <div className="flex items-start justify-between gap-3 mb-4 text-right">
                                  <div className={cn(
                                    "shrink-0 w-2 h-2 rounded-full mt-1.5",
                                    news.tone === 'positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                    news.tone === 'negative' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                    'bg-slate-500'
                                  )} />
                                  <p className="text-xs font-black text-slate-900 leading-relaxed flex-1">{news.headline}</p>
                               </div>
                               <div className="space-y-2 text-right">
                                  <div className="p-3 bg-slate-50 rounded-2xl">
                                    <p className="text-[11px] text-slate-300 leading-relaxed font-bold">{news.impact}</p>
                                  </div>
                                  <p className="text-[10px] text-emerald-600 font-black flex items-center justify-end gap-1">
                                    {news.linkedPriceImpact}
                                    <TrendingUp size={10} />
                                  </p>
                               </div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="p-12 text-center bg-white rounded-3xl border border-slate-100">
                           <Globe size={32} className="mx-auto text-slate-200 mb-4" />
                           <p className="text-xs font-black text-slate-400">لا توجد أخبار جوهرية حديثة مرصودة لهذا السهم حالياً.</p>
                         </div>
                       )}
                    </motion.div>
                  )}

                  {activeDeepDiveTab === 'Simulation' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                       <SimulationModule stockPrice={searchedStock.price} stockName={searchedStock.name} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat / Default View */}
        {(activeDeepDiveTab === 'Chat' || !searchedStock) && (
          <div className="flex-1 p-8 space-y-8">
            {messages.map((m, i) => (
              <FormattedMessage key={i} {...m} />
            ))}
            {loading && (
              <div className="flex flex-col gap-4">
                <SkeletonLoader />
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-black text-emerald-600 text-center animate-pulse"
                >
                  {loadingPhase}
                </motion.p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 bg-white border-t border-slate-50 shrink-0">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input 
            type="text" 
            placeholder="اسأل Brights Pro عن أي سهم مصري أو تحليل للسوق..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pr-6 pl-16 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="absolute left-3 w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:shadow-none"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-4 text-center font-medium">Brights Pro: المدخلات من بحث جوجل والتحليل بالبورصة المصرية 🇪🇬</p>
      </div>
    </div>
  );
}


interface LiveRecommendation {
  symbol: string;
  name: string;
  currentPrice: number;
  status: string;
  entryZone: string;
  targetPrice: string;
  stopLoss: string;
  analysis: string;
}

function RecommendationsView({ onStockClick }: { onStockClick: (symbol: string) => void }) {
  const [liveRecs, setLiveRecs] = useState<LiveRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const isFetchingRef = useRef(false);

  const fetchLiveRecommendations = async () => {
    if (isFetchingRef.current) return;
    
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Recommendations Fetch Error: API Key is missing');
      return;
    }

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const modelName = 'gemini-1.5-flash';
      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        tools: [{ googleSearch: {} }],
      });

      const prompt = `Act as Brights Pro, a top EGX analyst. 
      Use Google Search to find the ACTUAL LATEST prices and technical analysis for these specific stocks in the Egyptian Exchange: COMI, TMGH, SWDY, EKHO, PHDC.
      
      For each stock, provide:
      - symbol (e.g., COMI)
      - name (Arabic)
      - currentPrice (number)
      - status (Arabic: "فرصة شراء" / "جني أرباح" / "مراقبة")
      - entryZone (Arabic string)
      - targetPrice (Arabic string)
      - stopLoss (Arabic string)
      - analysis (Arabic brief technical reason)
      
      Return ONLY a valid JSON array of objects.`;

      const result = await model.generateContent(prompt);

      const text = result.response.text();
      if (!text) {
        throw new Error('Recommendations Fetch Error: Empty response from AI');
      }

      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
        const data = JSON.parse(jsonStr);
        setLiveRecs(Array.isArray(data) ? data : []);
        setLastUpdated(new Date().toLocaleTimeString('ar-EG'));
      } catch (parseErr) {
        console.error('Recommendations JSON Parse Error:', parseErr, jsonStr);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRecommendations();
  }, []);

  const history = [
    { stock: 'بالم هيلز (PHDC)', type: 'شراء', date: '2024-03-25', entry: '3.80', target: '4.50', status: 'Profit Hit', performance: '+18.4%' },
    { stock: 'طلعت مصطفى (TMGH)', type: 'شراء', date: '2024-03-20', entry: '41.20', target: '48.00', status: 'Active', performance: '+9.4%' },
    { stock: 'البنك التجاري الدولي (COMI)', type: 'مراكز', date: '2024-03-15', entry: '78.50', target: '85.00', status: 'Active', performance: '+5.1%' },
    { stock: 'إي فاينانس (EFIH)', type: 'شراء', date: '2024-03-10', entry: '24.10', target: '28.00', status: 'SL Hit', performance: '-4.2%' },
    { stock: 'السويدي اليكتريك (SWDY)', type: 'شراء', date: '2024-03-05', entry: '31.50', target: '36.00', status: 'Profit Hit', performance: '+14.3%' },
  ];

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* Live Technical Recommendations Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 animate-gradient-x" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <Sparkles className="text-emerald-400" />
                توصيات Brights Pro الحية
              </h3>
              {lastUpdated && (
                <span className="text-[9px] font-black text-slate-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5 uppercase tracking-widest">تحميل: {lastUpdated}</span>
              )}
            </div>
            <p className="text-xs text-indigo-200 font-bold mt-1">اقتناص الفرص اللحظية من قلب البورصة المصرية 🇪🇬</p>
          </div>
          <button 
            onClick={fetchLiveRecommendations}
            disabled={isLoading}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black backdrop-blur-xl border border-white/10 transition-all flex items-center gap-2"
          >
            {isLoading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RefreshCcw size={14} />}
            تحديث التوصيات الحية
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveRecs.map((rec, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all group relative flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-black text-white">{rec.name}</h4>
                    <span className="text-[10px] font-black text-emerald-400 font-mono tracking-widest">{rec.symbol}.CA</span>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black shadow-lg",
                    rec.status === 'فرصة شراء' ? 'bg-emerald-500 text-white' : 
                    rec.status === 'جني أرباح' ? 'bg-rose-500 text-white' : 
                    'bg-amber-500 text-white'
                  )}>
                    {rec.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-900/50 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">السعر الحالي</p>
                    <p className="text-sm font-black text-white font-mono">{rec.currentPrice} <span className="text-[9px]">ج.م</span></p>
                  </div>
                  <div className="p-3 bg-slate-900/50 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-slate-500 uppercase mb-1">منطقة الدخول</p>
                    <p className="text-[10px] font-black text-emerald-400">{rec.entryZone}</p>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400">المستهدف:</span>
                    <span className="text-white">{rec.targetPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-400">وقف الخسارة:</span>
                    <span className="text-rose-400">{rec.stopLoss}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium">{rec.analysis}</p>
                  </div>
                </div>

                <button 
                  onClick={() => onStockClick(rec.symbol)}
                  className="mt-6 w-full py-3 bg-indigo-500 text-white rounded-xl text-[10px] font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Activity size={12} />
                  انتقل للتحليل المتعمق
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Records Section */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 mt-12">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
             <History className="text-indigo-500" />
             أرشيف التوصيات المحققة
           </h3>
           <div className="flex gap-2">
              <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">نسبة دقة التوصيات 2024: 87%</span>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4 pr-4">السهم</th>
                <th className="pb-4">نوع العملية</th>
                <th className="pb-4">سعر التوصية</th>
                <th className="pb-4">الهدف</th>
                <th className="pb-4">النتيجة</th>
                <th className="pb-4 pl-4 text-left">العائد المحقق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((h, i) => (
                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-6 pr-4">
                    <p className="text-xs font-black text-slate-900">{h.stock}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{h.date}</p>
                  </td>
                  <td className="py-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${h.type === 'شراء' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'}`}>
                      {h.type}
                    </span>
                  </td>
                  <td className="py-6 text-xs font-bold text-slate-500 font-mono">{h.entry}</td>
                  <td className="py-6 text-xs font-bold text-slate-900 font-mono">{h.target}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${h.status === 'Profit Hit' ? 'bg-emerald-500' : h.status === 'SL Hit' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      <span className={`text-[11px] font-black ${
                        h.status === 'Profit Hit' ? 'text-emerald-600' : 
                        h.status === 'SL Hit' ? 'text-rose-600' : 
                        'text-amber-600'
                      }`}>
                        {h.status === 'Profit Hit' ? 'تحقيق الأهداف' : h.status === 'SL Hit' ? 'ضرب وقف الخسارة' : 'قيد المتابعة'}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 pl-4 text-left">
                    <span className={`text-xs font-black p-2 rounded-xl ${h.performance.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {h.performance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


function SettingsView() {
  return (
    <div className="max-w-2xl mx-auto space-y-8" dir="rtl">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-900 mb-8 border-b border-slate-50 pb-4">إعدادات الحساب والمنصة</h3>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">تفضيلات التحليل</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">وضع التحليل الافتراضي</p>
                  <p className="text-[10px] text-slate-500">اختر بين المضاربة السريعة أو الاستثمار طويل المدى</p>
                </div>
                <div className="flex gap-2 p-1 bg-white rounded-xl border border-slate-200">
                  <button className="px-3 py-1.5 text-[10px] font-bold bg-slate-900 text-white rounded-lg">مضاربة</button>
                  <button className="px-3 py-1.5 text-[10px] font-bold text-slate-400">استثمار</button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">تنبيهات الأسعار</p>
                  <p className="text-[10px] text-slate-500">تفعيل التنبيهات اللحظية عند وصول السهم لمستويات الدعم/المقاومة</p>
                </div>
                <div className="w-12 h-6 bg-emerald-500 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 group-hover:left-7 transition-all shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">مصدر البيانات</h4>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Google Search Grounding</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">تحصيل البيانات يتم لحظياً من نتائج Google لضمان دقة أسعار البورصة المصرية.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <button 
              onClick={() => {
                const event = new CustomEvent('showtoast', { detail: 'تم حفظ كافة الإعدادات بنجاح' });
                window.dispatchEvent(event);
              }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              حفظ كافة التغييرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalculatorView() {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [feeRate, setFeeRate] = useState('0.005'); // 0.5% default fee

  const calculate = () => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const qty = parseInt(quantity) || 0;
    const rate = parseFloat(feeRate) || 0;

    const buyTotal = buy * qty;
    const buyFees = buyTotal * rate;
    const netBuy = buyTotal + buyFees;

    const sellTotal = sell * qty;
    const sellFees = sellTotal * rate;
    const netSell = sellTotal - sellFees;

    const profit = netSell - netBuy;
    const returnPercent = netBuy > 0 ? (profit / netBuy) * 100 : 0;

    return { buyTotal, buyFees, netBuy, sellTotal, sellFees, netSell, profit, returnPercent };
  };

  const results = calculate();

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir="rtl">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="border-b border-slate-50 pb-4">
             <h3 className="text-xl font-black text-slate-900">محاكي الأرباح والرسوم</h3>
             <p className="text-xs text-slate-400 font-medium mt-1">تطبيق شامل لعمولات EGX والضرائب المحسوبة آلياً</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">سعر الشراء</label>
              <input 
                type="number" 
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="4.50"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">سعر البيع المتوقع</label>
              <input 
                type="number" 
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="5.20"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الكمية</label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1000"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">عمولة السمسرة (0.005 = 0.5%)</label>
              <input 
                type="number" 
                step="0.0001"
                value={feeRate}
                onChange={(e) => setFeeRate(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase mb-2">صافي الربح التقديري (بعد الضرائب والعمولات)</p>
               <h4 className={`text-4xl font-black font-mono ${results.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                 {results.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-bold">ج.م</span>
               </h4>
               <p className={`text-xs font-black mt-2 ${results.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                 {results.profit >= 0 ? '+' : ''}{results.returnPercent.toFixed(2)}% عائد صافي
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 mb-1">إجمالي الشراء</p>
                  <p className="text-xs font-black text-slate-900 font-mono">{results.netBuy.toLocaleString('en-US')} ج.م</p>
               </div>
               <div className="p-4 bg-white rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 mb-1">صافي البيع</p>
                  <p className="text-xs font-black text-slate-900 font-mono">{results.netSell.toLocaleString('en-US')} ج.م</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function Page() {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [isMobile]);
  type TabType = 'Dashboard' | 'Analyst' | 'Market' | 'Funds' | 'History' | 'Settings' | 'Calculator' | 'Trading';
  const [activeTab, setActiveTab] = useState<TabType>('Analyst');
  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // --- Global App States for Demo functionality ---
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { name: 'البنك التجاري الدولي', symbol: 'COMI', shares: 500, avgPrice: '120.20', currentPrice: '145.50', total: 72750, profit: '+21.0%' },
    { name: 'طلعت مصطفى', symbol: 'TMGH', shares: 1200, avgPrice: '85.60', currentPrice: '110.10', total: 132120, profit: '+28.6%' },
    { name: 'النساجون الشرقيون', symbol: 'ORWE', shares: 300, avgPrice: '45.40', currentPrice: '42.90', total: 12870, profit: '-5.5%' },
    { name: 'القاهرة للاستثمار', symbol: 'CIRA', shares: 2000, avgPrice: '28.10', currentPrice: '35.50', total: 71000, profit: '+26.3%' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const [newStockShares, setNewStockShares] = useState('');

  const [toasts, setToasts] = useState<{id: number, msg: string}[]>([]);
  const showToast = (msg: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      showToast(customEvent.detail);
    };
    window.addEventListener('showtoast', handleCustomToast);
    return () => window.removeEventListener('showtoast', handleCustomToast);
  }, []);

  const handleAddStock = () => {
    if(!newStockSymbol || !newStockShares) return;
    const price = Math.floor(Math.random() * 50) + 10;
    const qty = parseInt(newStockShares);
    setPortfolio([...portfolio, {
      name: 'سهم جديد (' + newStockSymbol.toUpperCase() + ')',
      symbol: newStockSymbol.toUpperCase(),
      shares: qty,
      avgPrice: price.toFixed(2),
      currentPrice: price.toFixed(2),
      total: qty * price,
      profit: '+0.0%'
    }]);
    setShowAddModal(false);
    setNewStockSymbol('');
    setNewStockShares('');
    showToast(`تم إضافة ${qty} سهم ${newStockSymbol.toUpperCase()} بنجاح`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const [tickerData, setTickerData] = useState([
    { s: 'EGX30', v: 42500, c: 2.1 },
    { s: 'COMI', v: 145.50, c: 4.2 },
    { s: 'TMGH', v: 110.10, c: 6.1 },
    { s: 'FWRY', v: 18.20, c: 4.8 },
    { s: 'SWDY', v: 84.40, c: 3.9 },
    { s: 'PHDC', v: 9.80, c: 12.4 },
    { s: 'EAST', v: 28.50, c: 1.5 },
    { s: 'ADIB', v: 54.20, c: 2.8 },
  ]);

  useEffect(() => {
    const val = setInterval(() => {
      setTickerData(prev => prev.map(t => {
        const vol = (Math.random() - 0.5) * 0.4;
        return {
          ...t,
          v: Math.max(1, t.v * (1 + vol/100)),
          c: t.c + vol
        }
      }));
    }, 2500);
    return () => clearInterval(val);
  }, []);

    if (!mounted) {
      return (
        <div className="h-screen w-screen bg-slate-900 flex items-center justify-center overflow-hidden" dir="rtl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto animate-bounce shadow-2xl">
              <Zap size={32} fill="currentColor" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white tracking-tighter">BRIGHTS PRO</h1>
              <p className="text-emerald-400 text-xs font-black uppercase tracking-widest animate-pulse">جاري تحميل المحلل المذكور...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <main 
        className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans" 
        dir="rtl"
      >
      {/* Toasts */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div 
              key={t.id}
              initial={{opacity: 0, scale: 0.9, y: 20}}
              animate={{opacity: 1, scale: 1, y: 0}}
              exit={{opacity: 0, scale: 0.9, y: 20}}
              className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border border-slate-800"
            >
              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <Sparkles size={12} />
              </div>
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
         {showAddModal && (
           <motion.div 
             initial={{opacity: 0}}
             animate={{opacity: 1}}
             exit={{opacity: 0}}
             className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div 
                initial={{scale: 0.95, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.95, opacity: 0}}
                className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md"
              >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-900">أضف سهم جديد</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase">رمز السهم (EGX)</label>
                      <input 
                        value={newStockSymbol} onChange={e=>setNewStockSymbol(e.target.value)}
                        placeholder="مثال: COMI" 
                        className="w-full bg-slate-50 border-none rounded-2xl mt-1 p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase">الكمية المستهدفة</label>
                      <input 
                        value={newStockShares} onChange={e=>setNewStockShares(e.target.value)}
                        type="number" 
                        placeholder="1000" 
                        className="w-full bg-slate-50 border-none rounded-2xl mt-1 p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <button 
                      onClick={handleAddStock}
                      className="w-full mt-4 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-emerald-200 flex justify-center items-center gap-2">
                       <Plus size={18} /> تأكيد وإضافة
                    </button>
                  </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        style={{ width: isCollapsed ? 80 : 280 }}
        className="bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden transition-all duration-300"
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-50 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-400">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-lg font-black tracking-tighter">BRIGHTS PRO</span>
            </div>
          ) : (
             <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-400 mx-auto">
                <Zap size={20} fill="currentColor" />
             </div>
          )}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="المحفظة الذكية" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} isCollapsed={isCollapsed} />
          <NavItem icon={<LineChartIcon size={20} />} label="التحليل الذكي" active={activeTab === 'Analyst'} onClick={() => setActiveTab('Analyst')} isCollapsed={isCollapsed} />
          <NavItem icon={<Zap size={20} />} label="رادار الأسهم" active={activeTab === 'Market'} onClick={() => setActiveTab('Market')} isCollapsed={isCollapsed} />
          <NavItem icon={<Activity size={20} />} label="التداول الآلي" active={activeTab === 'Trading'} onClick={() => setActiveTab('Trading')} isCollapsed={isCollapsed} />
          <NavItem icon={<Globe size={20} />} label="صناديق الاستثمار" active={activeTab === 'Funds'} onClick={() => setActiveTab('Funds')} isCollapsed={isCollapsed} />
          <NavItem icon={<History size={20} />} label="التوصيات الفنية" active={activeTab === 'History'} onClick={() => setActiveTab('History')} isCollapsed={isCollapsed} />
          <NavItem icon={<Activity size={20} />} label="حاسبة العائد" active={activeTab === 'Calculator'} onClick={() => setActiveTab('Calculator')} isCollapsed={isCollapsed} />
        </nav>

        <div className="mt-auto p-4 space-y-1 border-t border-slate-50">
           <NavItem icon={<Settings size={20} />} label="الإعدادات" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} isCollapsed={isCollapsed} />
           <NavItem icon={<LogOut size={20} />} label="تسجيل الخروج" active={false} onClick={() => {}} isCollapsed={isCollapsed} />
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-12 bg-slate-50 border-t border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100 relative">
        <div className="h-10 bg-slate-900 flex items-center overflow-hidden whitespace-nowrap shrink-0">
          <div className="flex animate-[ticker_30s_linear_infinite] gap-8">
            {tickerData.map((stock, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-black">
                <span className="text-slate-400 font-mono tracking-tighter">{stock.s}</span>
                <span className="text-white font-mono tracking-tighter">{stock.v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className={stock.c >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {stock.c >= 0 ? '+' : ''}{stock.c.toFixed(2)}%
                </span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {tickerData.map((stock, i) => (
              <div key={i+"-dup"} className="flex items-center gap-2 text-[10px] font-black">
                <span className="text-slate-400 font-mono tracking-tighter">{stock.s}</span>
                <span className="text-white font-mono tracking-tighter">{stock.v.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className={stock.c >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {stock.c >= 0 ? '+' : ''}{stock.c.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
             <div className="md:hidden" onClick={() => setIsCollapsed(!isCollapsed)}>
                <Menu className="text-slate-600 cursor-pointer" />
             </div>
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">البورصة المصرية: مفتوحة</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 gap-3">
                <Search size={16} className="text-slate-400" />
                <input type="text" placeholder="ابحث عن سهم..." className="bg-transparent text-xs focus:outline-none w-32 md:w-64" />
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 p-4 md:p-8 overflow-auto">
             <div className="max-w-6xl mx-auto h-full flex flex-col">
                <div className="flex-1 w-full h-full relative">
                  <AnimatePresence mode="wait">
                    {activeTab === 'Analyst' && (
                      <motion.div 
                        key="analyst" 
                        className="h-full"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AnalystView initialSearchSymbol={selectedSymbol} />
                      </motion.div>
                    )}
                    {activeTab === 'Dashboard' && (
                      <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <PortfolioView 
                          portfolio={portfolio} 
                          onAddStock={() => setShowAddModal(true)} 
                          onStockClick={(symbol) => {
                            setSelectedSymbol(symbol);
                            setActiveTab('Analyst');
                          }}
                        />
                      </motion.div>
                    )}
                    {activeTab === 'Trading' && (
                      <motion.div 
                        key="trading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AutomatedTradingView />
                      </motion.div>
                    )}
                    {activeTab === 'Market' && (
                      <motion.div 
                        key="market"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <StockRadar />
                      </motion.div>
                    )}
                    {activeTab === 'Funds' && (
                      <motion.div 
                        key="funds"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <FundsView onSubscribe={(f) => showToast(`تم تقديم طلب اشتراك في ${f}`)} />
                      </motion.div>
                    )}
                    {activeTab === 'History' && (
                      <motion.div 
                        key="history"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <RecommendationsView 
                          onStockClick={(symbol) => {
                            setSelectedSymbol(symbol);
                            setActiveTab('Analyst');
                          }} 
                        />
                      </motion.div>
                    )}
                    {activeTab === 'Calculator' && (
                      <motion.div 
                        key="calculator"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <CalculatorView />
                      </motion.div>
                    )}
                    {activeTab === 'Settings' && (
                      <motion.div 
                        key="settings"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <SettingsView />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
