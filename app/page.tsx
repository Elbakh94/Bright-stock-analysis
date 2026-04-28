'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { Search, Info, TrendingUp, AlertTriangle, Crosshair, ArrowUpRight, ArrowDownRight, Layers, BellRing, Bell, Calculator, PieChart, Activity, Menu, Newspaper, Sparkles, Target, Zap, Shield, Landmark, LayoutGrid, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// Using generic standard mock data to represent EGX stocks in screener
const mockScreenerData = [
  { symbol: 'COMI.CA', name: 'البنك التجاري الدولي', price: 81.50, change: 1.2, volume: '4.5M', rsi: 55, support: 78.00, resistance: 84.50, signal: 'احتفاظ', type: 'Investment', marketCap: 285.5, pe: 8.5, dividendYield: 4.5, sector: 'البنوك', isMarginable: true, isShortable: true },
  { symbol: 'TMGH.CA', name: 'مجموعة طلعت مصطفى', price: 55.40, change: 2.1, volume: '12.5M', rsi: 65, support: 52.00, resistance: 58.50, signal: 'شراء (زخم)', type: 'Trading', marketCap: 120.4, pe: 18.2, dividendYield: 1.2, sector: 'العقارات', isMarginable: true, isShortable: true },
  { symbol: 'ABUK.CA', name: 'أبو قير للأسمدة', price: 88.00, change: -1.2, volume: '1.1M', rsi: 40, support: 85.00, resistance: 92.00, signal: 'مراقبة', type: 'Investment', marketCap: 110.5, pe: 6.2, dividendYield: 8.5, sector: 'بتروكيماويات', isMarginable: false, isShortable: false },
  { symbol: 'EAST.CA', name: 'الشرقية إيسترن كومباني', price: 26.30, change: -0.5, volume: '2.1M', rsi: 28, support: 25.50, resistance: 28.00, signal: 'شراء (تشبع بيعي)', type: 'Trading', marketCap: 75.3, pe: 10.2, dividendYield: 6.8, sector: 'أغذية ومشروبات', isMarginable: true, isShortable: false },
  { symbol: 'FWRY.CA', name: 'فوري لتكنولوجيا البنوك', price: 6.25, change: 0.8, volume: '18.4M', rsi: 52, support: 5.90, resistance: 6.50, signal: 'مراقبة', type: 'Trading', marketCap: 20.6, pe: 35.1, dividendYield: 0, sector: 'تكنولوجيا المعلومات', isMarginable: true, isShortable: true },
  { symbol: 'SWDY.CA', name: 'السويدي إلكتريك', price: 42.10, change: -2.3, volume: '3.2M', rsi: 35, support: 40.00, resistance: 45.00, signal: 'مراقبة', type: 'Investment', marketCap: 91.2, pe: 9.8, dividendYield: 4.1, sector: 'مواد أساسية والصناعة', isMarginable: true, isShortable: true },
  { symbol: 'MNHD.CA', name: 'مدينة مصر للإسكان والتعمير', price: 4.15, change: 1.5, volume: '9.6M', rsi: 60, support: 3.80, resistance: 4.30, signal: 'احتفاظ', type: 'Trading', marketCap: 15.2, pe: 6.1, dividendYield: 0, sector: 'العقارات', isMarginable: true, isShortable: true },
  { symbol: 'HELI.CA', name: 'مصر الجديدة للإسكان والتعمير', price: 11.20, change: 4.5, volume: '14.1M', rsi: 75, support: 10.50, resistance: 11.80, signal: 'جني أرباح', type: 'Trading', marketCap: 14.9, pe: 12.3, dividendYield: 0, sector: 'العقارات', isMarginable: true, isShortable: true },
  { symbol: 'HRHO.CA', name: 'إي إف جي القابضة', price: 18.20, change: 3.4, volume: '8.2M', rsi: 72, support: 17.50, resistance: 19.00, signal: 'جني أرباح', type: 'Trading', marketCap: 21.8, pe: 15.4, dividendYield: 2.1, sector: 'خدمات مالية', isMarginable: true, isShortable: true },
  { symbol: 'AMOC.CA', name: 'الإسكندرية للزيوت المعدنية', price: 9.85, change: 0.0, volume: '1.5M', rsi: 45, support: 9.50, resistance: 10.30, signal: 'مراقبة', type: 'Investment', marketCap: 12.6, pe: 4.8, dividendYield: 11.5, sector: 'بتروكيماويات', isMarginable: true, isShortable: false },
  { symbol: 'MFPC.CA', name: 'موبكو للأسمدة', price: 58.70, change: -0.8, volume: '1.2M', rsi: 48, support: 55.00, resistance: 62.00, signal: 'احتفاظ', type: 'Investment', marketCap: 135.2, pe: 5.5, dividendYield: 7.2, sector: 'بتروكيماويات', isMarginable: true, isShortable: true },
  { symbol: 'CLHO.CA', name: 'مستشفى كليوباترا', price: 6.80, change: 1.1, volume: '2.5M', rsi: 55, support: 6.20, resistance: 7.10, signal: 'مراقبة', type: 'Investment', marketCap: 10.4, pe: 15.2, dividendYield: 2.5, sector: 'رعاية صحية', isMarginable: true, isShortable: false },
  { symbol: 'JUFO.CA', name: 'جهينة للصناعات الغذائية', price: 18.45, change: 2.8, volume: '3.1M', rsi: 62, support: 17.00, resistance: 19.50, signal: 'احتفاظ', type: 'Investment', marketCap: 16.5, pe: 18.4, dividendYield: 1.8, sector: 'أغذية ومشروبات', isMarginable: true, isShortable: false },
  { symbol: 'ORAS.CA', name: 'أوراسكوم كونستراكشون', price: 240.00, change: -1.5, volume: '0.1M', rsi: 42, support: 230.00, resistance: 255.00, signal: 'مراقبة', type: 'Investment', marketCap: 28.5, pe: 7.1, dividendYield: 6.5, sector: 'مواد أساسية والصناعة', isMarginable: false, isShortable: false },
  { symbol: 'ESRS.CA', name: 'حديد عز', price: 92.50, change: 4.1, volume: '5.2M', rsi: 68, support: 85.00, resistance: 95.00, signal: 'تراكم', type: 'Trading', marketCap: 45.6, pe: 4.2, dividendYield: 0, sector: 'مواد أساسية والصناعة', isMarginable: true, isShortable: true },
  { symbol: 'DOMT.CA', name: 'دومتي', price: 13.20, change: 0.5, volume: '0.8M', rsi: 50, support: 12.50, resistance: 14.00, signal: 'مراقبة', type: 'Investment', marketCap: 3.4, pe: 11.5, dividendYield: 8.2, sector: 'أغذية ومشروبات', isMarginable: false, isShortable: false },
  { symbol: 'CCAP.CA', name: 'القلعة للاستشارات المالية', price: 3.10, change: -2.5, volume: '22.5M', rsi: 35, support: 2.90, resistance: 3.40, signal: 'تراكم', type: 'Trading', marketCap: 6.8, pe: -1.5, dividendYield: 0, sector: 'خدمات مالية', isMarginable: true, isShortable: true },
  { symbol: 'ADIB.CA', name: 'مصرف أبو ظبي الإسلامي', price: 42.15, change: 1.8, volume: '1.1M', rsi: 58, support: 40.00, resistance: 44.50, signal: 'شراء', type: 'Investment', marketCap: 21.0, pe: 3.5, dividendYield: 5.5, sector: 'البنوك', isMarginable: true, isShortable: false },
  { symbol: 'ISPH.CA', name: 'ابن سينا فارما', price: 3.85, change: -0.5, volume: '4.2M', rsi: 45, support: 3.60, resistance: 4.10, signal: 'مراقبة', type: 'Trading', marketCap: 4.5, pe: 14.1, dividendYield: 1.1, sector: 'رعاية صحية', isMarginable: true, isShortable: true },
  { symbol: 'EKHOA.CA', name: 'القابضة المصرية الكويتية', price: 32.50, change: 0.2, volume: '0.5M', rsi: 51, support: 31.00, resistance: 34.00, signal: 'احتفاظ', type: 'Investment', marketCap: 36.2, pe: 6.1, dividendYield: 7.2, sector: 'خدمات مالية', isMarginable: true, isShortable: false }
];

export default function BrightsProDashboard() {
  const [activeTab, setActiveTab] = useState('analyst');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [marketData, setMarketData] = useState(mockScreenerData);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fake randomization removed
  }, []);

  const alertsRef = useRef(alerts);
  const prevMarketDataRef = useRef(marketData);

  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  useEffect(() => {
    if (prevMarketDataRef.current === marketData) return;
    prevMarketDataRef.current = marketData;

    setAlerts(prevAlerts => {
      let changed = false;
      const newAlerts = prevAlerts.map(alert => {
        if (alert.isTriggered) return alert;
        const stock = marketData.find(s => s.symbol === alert.symbol);
        if (stock) {
          if (alert.condition === 'above' && stock.price >= alert.price) {
            changed = true;
            return { ...alert, isTriggered: true };
          }
          if (alert.condition === 'below' && stock.price <= alert.price) {
            changed = true;
            return { ...alert, isTriggered: true };
          }
        }
        return alert;
      });
      return changed ? newAlerts : prevAlerts;
    });
  }, [marketData]);

  const triggeredAlertsCount = alerts.filter(a => a.isTriggered && !a.isRead).length;

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center bg-emerald-500 p-4 rounded-2xl shadow-xl shadow-emerald-500/20 mb-6"
            >
              <Activity className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-white tracking-tight"
            >
              Brights Pro
            </motion.h1>
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "200px" }}
               transition={{ duration: 1.5, delay: 0.4, ease: "circInOut" }}
               className="h-1 bg-emerald-500 mt-6 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-slate-100 font-sans">
        {/* Desktop Sidebar */}
      <aside className={`max-md:hidden bg-slate-900 text-slate-300 flex flex-col py-6 shadow-xl z-20 transition-all duration-300 shrink-0 ${isCollapsed ? 'w-20 items-center' : 'w-64'}`}>
        <div className={`flex items-center mb-10 w-full ${isCollapsed ? 'justify-center px-0' : 'px-6 gap-3'}`}>
          <div className="bg-emerald-500 p-2 rounded-lg text-white shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold text-white tracking-tight truncate">Brights Pro</h1>
              <span className="text-xs text-emerald-400 font-medium tracking-widest uppercase truncate block">EGX Edition</span>
            </div>
          )}
        </div>

        <nav className={`flex flex-col gap-2 w-full ${isCollapsed ? 'px-2' : 'px-4'} overflow-x-hidden`}>
          <NavItem isCollapsed={isCollapsed} active={activeTab === 'analyst'} onClick={() => setActiveTab('analyst')} icon={<Search size={20} />} label="المحلل الذكي" />
          <NavItem isCollapsed={isCollapsed} active={activeTab === 'screener'} onClick={() => setActiveTab('screener')} icon={<Layers size={20} />} label="فلتر الأسهم" />
          <NavItem isCollapsed={isCollapsed} active={activeTab === 'heatmap'} onClick={() => setActiveTab('heatmap')} icon={<LayoutGrid size={20} />} label="خريطة السوق" />
          <NavItem isCollapsed={isCollapsed} active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<Newspaper size={20} />} label="أخبار السوق" />
          <NavItem isCollapsed={isCollapsed} active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} icon={<Bell size={20} />} label="التنبيهات" />
          <NavItem isCollapsed={isCollapsed} active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} icon={<Calculator size={20} />} label="حاسبة الأرباح" />
          <NavItem isCollapsed={isCollapsed} active={activeTab === 'funds'} onClick={() => setActiveTab('funds')} icon={<Landmark size={20} />} label="صناديق الاستثمار" />
          <NavItem isCollapsed={isCollapsed} active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<PieChart size={20} />} label="إدارة المحفظة" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 pb-16 md:pb-0">
        <header className="h-14 md:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors hidden md:block"
            >
              <Menu size={24} />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
                <Activity className="w-4 h-4" />
              </div>
              <h1 className="font-bold text-slate-800 text-lg">Brights Pro</h1>
            </div>
            <h2 className="text-lg font-semibold text-slate-800 hidden md:block">
              {activeTab === 'analyst' && 'التحليل اللحظي والذكاء الاصطناعي'}
              {activeTab === 'screener' && 'رادار السوق (تحديد الفرص اللحظية)'}
              {activeTab === 'heatmap' && 'الخريطة الحرارية للسوق'}
              {activeTab === 'news' && 'أخبار ورؤى السوق'}
              {activeTab === 'alerts' && 'التنبيهات الذكية للأسعار'}
              {activeTab === 'calculator' && 'الحاسبة الصافية للعمولات والضرائب'}
              {activeTab === 'funds' && 'تحليلات صناديق الاستثمار المشتركة'}
              {activeTab === 'portfolio' && 'تحليل وتوزيع السيولة'}
            </h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setActiveTab('alerts')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative"
            >
              <BellRing size={20} className={triggeredAlertsCount > 0 ? "text-rose-500 animate-pulse" : ""} />
              {triggeredAlertsCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-3.5 h-3.5 text-[9px] font-bold text-white bg-rose-500 border border-white rounded-full">
                  {triggeredAlertsCount}
                </span>
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-emerald-500 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">PR</div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === 'analyst' && <AnalystView />}
                {activeTab === 'screener' && <ScreenerView marketData={marketData} />}
                {activeTab === 'heatmap' && <HeatmapView marketData={marketData} setMarketData={setMarketData} />}
                {activeTab === 'news' && <NewsView />}
                {activeTab === 'alerts' && <AlertsView alerts={alerts} setAlerts={setAlerts} marketData={marketData} />}
                {activeTab === 'calculator' && <CalculatorView />}
                {activeTab === 'funds' && <FundsView />}
                {activeTab === 'portfolio' && <PortfolioView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex overflow-x-auto gap-4 items-center px-4 py-2 z-30 hide-scroll-bar"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <MobileNavItem active={activeTab === 'analyst'} onClick={() => setActiveTab('analyst')} icon={<Search size={22} />} label="المحلل" />
        <MobileNavItem active={activeTab === 'screener'} onClick={() => setActiveTab('screener')} icon={<Layers size={22} />} label="فلتر" />
        <MobileNavItem active={activeTab === 'heatmap'} onClick={() => setActiveTab('heatmap')} icon={<LayoutGrid size={22} />} label="خريطة" />
        <MobileNavItem active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<Newspaper size={22} />} label="أخبار" />
        <MobileNavItem active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} icon={<Bell size={22} />} label="تنبيهات" />
        <MobileNavItem active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')} icon={<Calculator size={22} />} label="حاسبة" />
        <MobileNavItem active={activeTab === 'funds'} onClick={() => setActiveTab('funds')} icon={<Landmark size={22} />} label="صناديق" />
        <MobileNavItem active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} icon={<PieChart size={22} />} label="محفظة" />
      </nav>
    </div>
    </>
  );
}

function MobileNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 w-full transition-colors ${
        active ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function NavItem({ isCollapsed, active, onClick, icon, label }: { isCollapsed: boolean, active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full rounded-xl transition-all duration-200 ${
        isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
      } ${
        active 
          ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
          : 'hover:bg-slate-800 hover:text-white text-slate-400'
      }`}
      title={isCollapsed ? label : undefined}
    >
      <div className="shrink-0">{icon}</div>
      {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
      {!isCollapsed && active && <div className="mr-auto w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
    </button>
  );
}

function generateMockHistoricalData(symbol: string) {
  const data = [];
  let price = 50 + Math.random() * 50; 
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  
  for (let i = 0; i < 12; i++) {
    price = price * (1 + (Math.random() - 0.45) * 0.2); 
    data.push({
      name: months[i],
      price: Number(price.toFixed(2))
    });
  }
  return data;
}

function AnalystView() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string, chartData?: any[], chartSymbol?: string}[]>([
    {
      role: 'ai',
      content: 'مرحباً، أنا Brights Pro للإصدار EGX. أدخل كود السهم (مثل EAST.CA أو COMI.CA) أو اسم الشركة وسأقدم لك تحليلاً شاملاً يجمع بين المؤشرات الفنية والمالية مع تحديد نقاط الدخول والخروج بدقة.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'Speculation' | 'Investment'>('Speculation');

  const analyzeStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQuery = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userQuery }]);
    setLoading(true);

    try {
        const prompt = `
أنت "Brights Pro"، محلل مالي خبير واستراتيجي متخصص في البورصة المصرية (EGX). 
طلب المستخدم تحليل: "${userQuery}".
وضع العمل الحالي هو: ${mode === 'Speculation' ? 'المضاربة (Trading/Scalping)' : 'الاستثمار (Investing)'}.

**تعليمات هامة جداً (يجب تنفيذها):**
1. يجب عليك استخدام أداة البحث في جوجل (Google Search) المرفقة للبحث فوراً عن السعر المباشر والبيانات الحديثة لهذا السهم المذكور في البورصة المصرية، وتأكد من أن كود السهم يطابق اسم الشركة.
2. ابحث بمصطلحات مثل "سعر سهم ${userQuery} مباشر" أو "Mubasher Egypt ${userQuery}" لمعرفة السعر الحالي اللحظي بدقة اليوم ومقارنته وتحليله.
3. لا تقم أبداً بتخمين السعر أو الاعتماد على بيانات قديمة من تدريبك. 

يجب أن يلتزم الرد بشكل صارم بهذا البروتوكول بناءً على البيانات الحية التي بحثت عنها:
1. **الملخص الرقمي**: (السعر اللحظي الدقيق الذي وجدته الآن، نسبة التغير الحالية، حجم التداول).
2. **التقييم الفني**: (اتجاه صاعد/هابط، نقطة الدعم، نقطة المقاومة).
3. **التوصية**: (شراء / احتفاظ / بيع) مع ذكر السبب بوضوح تام اعتماداً على السعر الحالي الفعلي.
4. **الهدف السعري (Target)**: تحديد السعر المستهدف بدقة والمخاطرة المسموح بها (Stop Loss) - في وضع الاستثمار حدد السعر العادل، وفي المضاربة حدد الخروج السريع.
5. **تنبيه المخاطر**: (اذكر أي أخبار جيوسياسية أو عوامل اقتصاد كلي مرتبطة بالسياق المصري قد تؤثر على هذا السهم اليوم).

اجعل الرد بنقاط واضحة ومختصرة بتنسيق Markdown وتجنب المقدمات الطويلة.
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const historicData = generateMockHistoricalData(userQuery);

      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: response.text || 'حدث خطأ في النظام.',
        chartData: historicData,
        chartSymbol: userQuery
      }]);
    } catch (err: any) {
      // Catch exceptions silently down here since the platform sometimes returns HTML error pages (Unexpected token <) in proxy
      let errorMessage = 'نعتذر، هناك مشكلة في الاتصال بمحرك التحليل.';
      if (err instanceof Error) {
         if (err.message.includes('<') || err.name === 'SyntaxError') {
             errorMessage = 'عذراً، الخادم يواجه ضغطاً أو هناك مشكلة في إعدادات الاتصال (Unexpected token). يرجى المحاولة لاحقاً.';
         } else if (err.message.includes('429') || err.message.includes('quota') || err.message.includes('RESOURCE_EXHAUSTED')) {
             errorMessage = 'عذراً، لقد تجاوزت الحد الأقصى للاستخدام (Quota Exceeded) لمفتاح Gemini API الحالي. يرجى التحقق من خطة الفوترة أو المحاولة لاحقاً.';
         }
      }
      setMessages(prev => [...prev, { role: 'ai', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Settings Bar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 font-medium">وضع العمل:</span>
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            <button 
              onClick={() => setMode('Speculation')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'Speculation' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              مضاربة (Trading)
            </button>
            <button 
              onClick={() => setMode('Investment')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === 'Investment' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              استثمار (Investing)
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          متصل بالخوادم
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex gap-3 md:gap-4 ${msg.role === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full flex items-center justify-center text-white ${msg.role === 'ai' ? 'bg-slate-800' : 'bg-emerald-500'}`}>
                {msg.role === 'ai' ? <Activity size={20} className="w-5 h-5" /> : <span className="font-bold text-sm md:text-base">U</span>}
              </div>
              <div className={`px-4 py-3 md:px-5 md:py-4 w-full flex-1 max-w-[95%] lg:max-w-[80%] rounded-2xl ${msg.role === 'ai' ? 'bg-slate-50 border border-slate-100 text-slate-800 shadow-sm' : 'bg-emerald-500 text-white shadow-md max-w-fit align-self-end mr-auto ml-0'}`}>
                <div className="prose prose-sm md:prose-base prose-slate max-w-none text-right rtl:space-x-reverse markdown-body" style={{ color: msg.role === 'user' ? 'white' : undefined }}>
                   <Markdown>{msg.content}</Markdown>
                </div>
                {msg.chartData && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-6 p-4 bg-white border border-slate-200 rounded-xl shadow-md" dir="rtl"
                  >
                    <h4 className="text-sm font-bold text-slate-700 mb-4 text-center">أداء السهم خلال عام {msg.chartSymbol && `(${msg.chartSymbol})`}</h4>
                    <div className="h-56 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={msg.chartData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickMargin={10} />
                          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} tickFormatter={(val) => val.toFixed(0)} width={40} orientation="right" />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right', direction: 'rtl' }}
                            labelStyle={{ color: '#64748b', marginBottom: '4px', textAlign: 'right' }}
                            itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                            formatter={(value: any) => [`${value} EGP`, 'السعر']}
                          />
                          <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-slate-800">
                <Activity size={20} className="animate-spin" />
              </div>
              <div className="px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        {messages.length === 1 && (
          <div className="flex gap-2 w-full overflow-x-auto pb-3 mb-1 hide-scroll-bar">
            {['تحليل سهم التجاري الدولي (COMI.CA)', 'هل وقت مناسب لشراء طلعت مصطفى؟', 'البحث عن فرصة شراء بهامش (Margin)', 'تحليل تاريخي لسهم أبو قير (ABUK.CA)'].map((sug, i) => (
              <button 
                key={i} 
                className="shrink-0 bg-slate-50 border border-slate-200 text-slate-600 text-xs py-1.5 px-3 rounded-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                onClick={() => setQuery(sug)}
              >
                {sug}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={analyzeStock} suppressHydrationWarning>
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="اكتب اسم السهم أو الرمز (مثل: COMI.CA) لتحليله أو اطلب نمط تاريخي..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-16 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              disabled={loading}
              suppressHydrationWarning
            />
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="absolute left-2 top-2 bottom-2 aspect-square bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
          <p className="text-xs text-center text-slate-400 mt-3 font-medium">البيانات المقدمة هي لأغراض تحليلية مساعدة. التداول ينطوي على مخاطر.</p>
        </form>
      </div>
    </div>
  );
}

function SortIcon({ sortConfig, columnKey }: { sortConfig: {key: string, direction: 'asc' | 'desc'} | null, columnKey: string }) {
    if (sortConfig?.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <span className="ml-1 text-emerald-500">↑</span> : <span className="ml-1 text-emerald-500">↓</span>;
}

function ScreenerView({ marketData }: { marketData: any[] }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ sector: '', minMarketCap: '', maxPe: '', minDivYield: '', isMarginable: false, isShortable: false });
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredData = marketData.filter(s => {
    if (filters.sector && s.sector !== filters.sector) return false;
    if (filters.minMarketCap && s.marketCap < Number(filters.minMarketCap)) return false;
    if (filters.maxPe && s.pe > Number(filters.maxPe)) return false;
    if (filters.minDivYield && s.dividendYield < Number(filters.minDivYield)) return false;
    if (filters.isMarginable && !s.isMarginable) return false;
    if (filters.isShortable && !s.isShortable) return false;
    return true;
  });

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const sectors = Array.from(new Set(marketData.map(s => s.sector)));

  return (
    <div className="space-y-6 h-full flex flex-col pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
          <h2 className="text-2xl font-bold text-slate-800">رادار الأسهم (Screener)</h2>
          <p className="text-slate-500 mt-1">يصطاد الفرص الحالية في البورصة المصرية بناءً على التحليل الفني والأساسي.</p>
         </div>
         <button 
           onClick={() => setShowFilters(!showFilters)}
           className={`border px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shrink-0 ${showFilters ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
         >
           <Search size={16} /> تصفية متقدمة
         </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">القطاع</label>
            <select value={filters.sector} onChange={e => setFilters({...filters, sector: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800">
              <option value="">الكل</option>
              {sectors.map(sec => <option key={sec} value={sec}>{sec}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">مكرر الربحية (P/E) كحد أقصى</label>
            <input type="number" value={filters.maxPe} onChange={e => setFilters({...filters, maxPe: e.target.value})} placeholder="الكل" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">عائد التوزيعات (%) كحد أدنى</label>
            <input type="number" value={filters.minDivYield} onChange={e => setFilters({...filters, minDivYield: e.target.value})} placeholder="الكل" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">القيمة السوقية (مليار) كحد أدنى</label>
            <input type="number" value={filters.minMarketCap} onChange={e => setFilters({...filters, minMarketCap: e.target.value})} placeholder="الكل" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono" />
          </div>
          <div className="md:col-span-4 flex gap-4 pt-2 border-t border-slate-100">
             <label className="flex items-center gap-2 cursor-pointer">
               <input type="checkbox" checked={filters.isMarginable} onChange={e => setFilters({...filters, isMarginable: e.target.checked})} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
               <span className="text-sm font-medium text-slate-700">مسموح بالشراء بالهامش</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
               <input type="checkbox" checked={filters.isShortable} onChange={e => setFilters({...filters, isShortable: e.target.checked})} className="rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
               <span className="text-sm font-medium text-slate-700">مسموح بالبيع على المكشوف (شورت سيلنج)</span>
             </label>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 relative">
        <div className="overflow-x-auto h-full"> 
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 shadow-sm z-10">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('symbol')}>الرمز/السهم <SortIcon sortConfig={sortConfig} columnKey="symbol" /></th>
                <th className="px-6 py-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('price')}>السعر <SortIcon sortConfig={sortConfig} columnKey="price" /></th>
                <th className="px-6 py-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('change')}>التغير <SortIcon sortConfig={sortConfig} columnKey="change" /></th>
                <th className="px-6 py-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('marketCap')}>القيمة السوقية <span className="text-[10px] text-slate-400 font-normal">(مليار)</span> <SortIcon sortConfig={sortConfig} columnKey="marketCap" /></th>
                <th className="px-6 py-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('pe')}>مكرر الأرباح <SortIcon sortConfig={sortConfig} columnKey="pe" /></th>
                <th className="px-6 py-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('dividendYield')}>العائد <SortIcon sortConfig={sortConfig} columnKey="dividendYield" /></th>
                <th className="px-6 py-4 border-b border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleSort('rsi')}>RSI <SortIcon sortConfig={sortConfig} columnKey="rsi" /></th>
                <th className="px-6 py-4 border-b border-slate-200">صلاحيات التداول</th>
                <th className="px-6 py-4 border-b border-slate-200">إشارة النظام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedData.map((s, i) => (
                <ScreenerRow key={s.symbol} s={s} />
              ))}
              {sortedData.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-400 font-medium h-48">
                    لا توجد أسهم تطابق معايير البحث والفلترة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CalculatorView() {
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(110);
  const [quantity, setQuantity] = useState(1000);
  // Default EGX standard brokerage commision + fixed fees roughly ~0.15% to 0.25%, we will use 0.002
  const [commissionRate, setCommissionRate] = useState(0.2); 
  // Customary standard EGX tax rate or stamp duty applied roughly on total ops
  const [applyCapGains, setApplyCapGains] = useState(false);

  const rawCost = buyPrice * quantity;
  const buyCommission = rawCost * (commissionRate / 100);
  const totalCost = rawCost + buyCommission;

  const rawRevenue = sellPrice * quantity;
  const sellCommission = rawRevenue * (commissionRate / 100);
  const netRevenueBeforeTax = rawRevenue - sellCommission;

  const grossProfit = netRevenueBeforeTax - totalCost;
  
  // Hypothetical simplified 10% cap gains tax on positive profits 
  const taxAmount = (applyCapGains && grossProfit > 0) ? (grossProfit * 0.1) : 0;
  const netProfit = grossProfit - taxAmount;

  const returnPercentage = (netProfit / totalCost) * 100;

  return (
    <div className="max-w-4xl space-y-6 mx-auto pb-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">حاسبة الأرباح الصافية (EGX)</h2>
        <p className="text-slate-500 mt-1">احسب الرقم الحقيقي الذي سيدخل جيبك بعد خصم جميع العمولات والضرائب.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
           <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-3">تفاصيل الصفقة</h3>
           
           <div>
             <label className="block text-sm font-medium text-slate-600 mb-1.5">كمية الأسهم</label>
             <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 font-mono" />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-emerald-600 mb-1.5">سعر الشراء</label>
               <input type="number" step="0.01" value={buyPrice} onChange={e => setBuyPrice(Number(e.target.value))} className="w-full bg-slate-50 border border-emerald-200 rounded-lg px-4 py-2 text-emerald-800 font-mono focus:ring-emerald-500 focus:border-emerald-500" />
             </div>
             <div>
               <label className="block text-sm font-medium text-blue-600 mb-1.5">سعر البيع (متوقع)</label>
               <input type="number" step="0.01" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))} className="w-full bg-slate-50 border border-blue-200 rounded-lg px-4 py-2 text-blue-800 font-mono focus:ring-blue-500 focus:border-blue-500" />
             </div>
           </div>

           <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-3 pt-2">الرسوم والضرائب</h3>
           
           <div>
             <label className="block text-sm font-medium text-slate-600 mb-1.5">عمولة السمسار + الهيئات (%)</label>
             <input type="number" step="0.01" value={commissionRate} onChange={e => setCommissionRate(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 font-mono" />
             <p className="text-xs text-slate-400 mt-1">العمولة الشائعة تتراوح بين 0.1% إلى 0.25%</p>
           </div>

           <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 cursor-pointer">
             <input type="checkbox" checked={applyCapGains} onChange={e => setApplyCapGains(e.target.checked)} className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500" />
             <span className="text-sm font-medium text-slate-700">خصم ضريبة الأرباح الرأسمالية (10%)</span>
          </label>
        </div>

        {/* Results Panel */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
           <div>
             <h3 className="font-semibold text-slate-300 border-b border-slate-800 pb-3 mb-5">ملخص العملية</h3>
             
             <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center text-slate-400">
                  <span>إجمالي تكلفة الشراء الأساسية:</span>
                  <span>{rawCost.toLocaleString(undefined, {minimumFractionDigits: 2})} EGP</span>
                </div>
                <div className="flex justify-between items-center text-rose-400">
                  <span>عمولات الشراء والبيع ({commissionRate}%):</span>
                  <span>-{(buyCommission + sellCommission).toLocaleString(undefined, {minimumFractionDigits: 2})} EGP</span>
                </div>
                {applyCapGains && grossProfit > 0 && (
                  <div className="flex justify-between items-center text-rose-400">
                    <span>ضريبة الأرباح (10%):</span>
                    <span>-{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2})} EGP</span>
                  </div>
                )}
             </div>
           </div>

           <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="text-slate-400 text-sm mb-1 font-medium">الربح/الخسارة الصافية (Net Profit)</div>
              <div className={`text-4xl font-bold font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {netProfit > 0 ? '+' : ''}{netProfit.toLocaleString(undefined, {minimumFractionDigits: 2})} EGP
              </div>
              
              <div className="flex justify-between items-center mt-4 bg-slate-800/50 p-3 rounded-lg">
                <span className="text-slate-400 font-medium text-sm">العائد على الاستثمار المتوقع:</span>
                <span className={`font-mono font-bold text-lg ${returnPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {returnPercentage.toFixed(2)}%
                </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioView() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIResult, setShowAIResult] = useState(false);

  const chartData = showAIResult ? [
    { name: 'البنوك والخدمات المالية', value: 30, fill: '#3b82f6' }, // Blue
    { name: 'العقارات والإنشاءات', value: 35, fill: '#10b981' }, // Emerald
    { name: 'البتروكيماويات والأسمدة', value: 15, fill: '#f59e0b' }, // Amber
    { name: 'أغذية ومشروبات', value: 10, fill: '#8b5cf6' }, // Purple
    { name: 'سيولة نقدية (كاش)', value: 10, fill: '#64748b' } // Slate
  ] : [
    { name: 'البنوك', value: 40, fill: '#3b82f6' }, // Blue
    { name: 'العقارات', value: 25, fill: '#10b981' }, // Emerald
    { name: 'البتروكيماويات', value: 20, fill: '#f59e0b' }, // Amber
    { name: 'سيولة نقدية', value: 15, fill: '#64748b' } // Slate
  ];

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowAIResult(true);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">إدارة المخاطر وتوزيع المحفظة</h2>
          <p className="text-slate-500 mt-1">توصيات Brights Pro لتجنب التركيز في سهم واحد ومراقبة حدود المخاطرة.</p>
        </div>
        {!showAIResult && (
          <button 
            onClick={handleGenerateAI} disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            {isGenerating ? <Activity className="animate-spin" size={20} /> : <Sparkles size={20} />}
            بناء محفظة ذكية (AI)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Warnings & Suggestions */}
         <div className="lg:col-span-2 space-y-4">
           {showAIResult ? (
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
               <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex gap-4">
                 <Shield className="text-indigo-600 shrink-0 mt-0.5" />
                 <div>
                   <h3 className="font-bold text-indigo-800 mb-1">المحفظة المقترحة: متوازنة (عائد مستهدف 22%)</h3>
                   <p className="text-sm text-indigo-700/80 leading-relaxed">
                     بناءً على ظروف السوق الحالية في البورصة المصرية ومعدلات التضخم، قمنا بتنويع المحفظة لحمايتك من تقلبات سعر الصرف والتركيز على قطاعات ذات تدفقات نقدية قوية (كالعقارات والبنوك) مع الاحتفاظ بـ 10% كاش لاقتناص الفرص.
                   </p>
                 </div>
               </div>
               <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex gap-4">
                 <Target className="text-emerald-600 shrink-0 mt-0.5" />
                 <div>
                   <h3 className="font-bold text-emerald-800 mb-1">أسهم مرشحة للبدء</h3>
                   <ul className="text-sm text-emerald-700/80 list-disc list-inside mt-2 space-y-1">
                     <li><strong>العقارات:</strong> TMGH.CA , PHDC.CA (35%)</li>
                     <li><strong>البنوك:</strong> CIB.CA , ADIB.CA (30%)</li>
                     <li><strong>البتروكيماويات:</strong> ABUK.CA , MFPC.CA (15%)</li>
                   </ul>
                 </div>
               </div>
             </motion.div>
           ) : (
             <>
               <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex gap-4">
                 <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" />
                 <div>
                   <h3 className="font-bold text-rose-800 mb-1">تحذير أوزان: قطاع البنوك</h3>
                   <p className="text-sm text-rose-700/80 leading-relaxed">
                     استناداً لتحليلات البنك المركزي الأخيرة وتوقعات الفائدة، يشكل قطاع البنوك (40%) من محفظتك وهو يتجاوز الحد الآمن (30%). ننصح بتخفيف المراكز وجني الأرباح الجزئي في CIB.
                   </p>
                 </div>
               </div>
               
               <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex gap-4">
                 <Crosshair className="text-emerald-600 shrink-0 mt-0.5" />
                 <div>
                   <h3 className="font-bold text-emerald-800 mb-1">فرصة تجميع: التطوير العقاري</h3>
                   <p className="text-sm text-emerald-700/80 leading-relaxed">
                     انخفاض معدلات الفائدة المتوقع مستقبلاً يعزز شركات العقارات (مثل TMGH.CA و PHDC.CA). وزن القطاع الحالي 25%، يمكن رفعه تدريجياً إلى 35% حسب استراتيجية المدى المتوسط.
                   </p>
                 </div>
               </div>
             </>
           )}
         </div>

         {/* Graph */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
            <h3 className="font-semibold text-slate-800 w-full mb-4">{showAIResult ? 'التوزيع الذكي المقترح' : 'التوزيع القطاعي الحالي'}</h3>
            <div className="flex-1 w-full flex items-center justify-center relative">
               <svg viewBox="0 0 100 100" className="w-48 h-48 transform -rotate-90 origin-center transition-all duration-1000">
                  {showAIResult ? (
                    <>
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#64748b" strokeWidth="20" strokeDasharray="10 100" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="10 100" strokeDashoffset="-10" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="15 100" strokeDashoffset="-20" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="35 100" strokeDashoffset="-35" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="30 100" strokeDashoffset="-70" />
                    </>
                  ) : (
                    <>
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#64748b" strokeWidth="20" strokeDasharray="25 100" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="20 100" strokeDashoffset="-25" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="25 100" strokeDashoffset="-45" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="40 100" strokeDashoffset="-70" />
                    </>
                  )}
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                 <span className="text-3xl font-bold text-slate-800">100%</span>
                 <span className="text-xs text-slate-400 uppercase font-medium mt-1">Allocated</span>
               </div>
            </div>
            
            <div className="w-full mt-4 space-y-2">
               {chartData.map((item, idx) => (
                 <motion.div key={item.name} initial={showAIResult ? {opacity:0, y:10} : false} animate={{opacity:1, y:0}} transition={{delay: idx * 0.1}} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></span>
                     <span className="text-slate-600 font-medium">{item.name}</span>
                   </div>
                   <span className="font-bold text-slate-800">{item.value}%</span>
                 </motion.div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

function ScreenerRow({ s }: { s: any }) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevPrice = useRef(s.price);

  useEffect(() => {
    if (s.price > prevPrice.current) {
       setFlash('up');
       const t = setTimeout(() => setFlash(null), 1000);
       prevPrice.current = s.price;
       return () => clearTimeout(t);
    } else if (s.price < prevPrice.current) {
       setFlash('down');
       const t = setTimeout(() => setFlash(null), 1000);
       prevPrice.current = s.price;
       return () => clearTimeout(t);
    }
  }, [s.price]);

  return (
    <tr className={`group transition-colors duration-500 ${flash === 'up' ? 'bg-emerald-500/20' : flash === 'down' ? 'bg-rose-500/20' : 'hover:bg-slate-50/80'}`}>
      <td className="px-6 py-4 min-w-[200px]">
        <div className="font-bold text-slate-800">{s.symbol}</div>
        <div className="text-xs text-slate-400 truncate max-w-[180px]">{s.name}</div>
        <div className="text-[10px] bg-slate-100 text-slate-500 inline-block px-1.5 py-0.5 rounded mt-1">{s.sector}</div>
      </td>
      <td className={`px-6 py-4 font-mono font-medium transition-colors duration-500 ${flash === 'up' ? 'text-emerald-700' : flash === 'down' ? 'text-rose-700' : 'text-slate-700'}`}>{s.price.toFixed(2)}</td>
      <td className={`px-6 py-4 font-mono flex flex-col justify-center gap-0.5 min-w-[100px] h-[72px] font-bold ${s.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
        <div className="flex items-center gap-1">
          {s.change > 0 ? <ArrowUpRight size={16} /> : s.change < 0 ? <ArrowDownRight size={16} /> : null}
          {Math.abs(s.change)}%
        </div>
      </td>
      <td className="px-6 py-4 font-mono text-slate-700">{s.marketCap}</td>
      <td className="px-6 py-4 font-mono text-slate-700">{s.pe}</td>
      <td className="px-6 py-4 font-mono text-slate-700">{s.dividendYield}%</td>
      <td className="px-6 py-4 min-w-[120px]">
        <div className="flex items-center gap-2">
           <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden shrink-0">
             <div 
               className={`h-full transition-all duration-500 ${s.rsi <= 30 ? 'bg-emerald-500' : s.rsi >= 70 ? 'bg-rose-500' : 'bg-blue-400'}`} 
               style={{ width: `${s.rsi}%` }}
             />
           </div>
           <span className={`font-mono text-xs shrink-0 ${s.rsi <= 30 ? 'text-emerald-600 font-bold' : s.rsi >= 70 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>{s.rsi}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5 flex-wrap w-[110px]">
          {s.isMarginable && <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">هامش</span>}
          {s.isShortable && <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-100">شورت</span>}
          {(!s.isMarginable && !s.isShortable) && <span className="text-[10px] text-slate-400">-</span>}
        </div>
      </td>
      <td className="px-6 py-4 w-[140px] shrink-0">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap ${
          s.signal.includes('شراء') ? 'bg-emerald-100 text-emerald-700' :
          s.signal.includes('جني') ? 'bg-rose-100 text-rose-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          {s.signal}
        </span>
      </td>
    </tr>
  );
}

function AlertsView({ alerts, setAlerts, marketData }: { alerts: any[], setAlerts: React.Dispatch<React.SetStateAction<any[]>>, marketData: any[] }) {
  const [symbol, setSymbol] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  // Mark all alerts as read when viewing the alerts tab
  useEffect(() => {
    if (alerts.some(a => !a.isRead)) {
      setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    }
  }, [alerts, setAlerts]);

  const addAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !price) return;
    
    const newAlert = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      price: Number(price),
      condition,
      isTriggered: false,
      isRead: false
    };

    // Immediately check against market data
    const stock = marketData.find(s => s.symbol.toUpperCase() === newAlert.symbol);
    if (stock) {
       if (condition === 'above' && stock.price >= newAlert.price) {
         newAlert.isTriggered = true;
       }
       if (condition === 'below' && stock.price <= newAlert.price) {
         newAlert.isTriggered = true;
       }
    }

    setAlerts(prev => [newAlert, ...prev]);
    setSymbol('');
    setPrice('');
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 pb-16">
       <div>
         <h2 className="text-2xl font-bold text-slate-800">التنبيهات الذكية</h2>
         <p className="text-slate-500 mt-1">قم بتعيين تنبيهات للأسعار وسيتم إشعارك فور وصول السهم للهدف (تعمل فورياً مع البيانات المتاحة).</p>
       </div>
       
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
         <form onSubmit={addAlert} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
           <div>
             <label className="block text-sm font-medium text-slate-600 mb-1.5">رمز السهم</label>
             <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="مثال: COMI.CA" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 font-mono" required />
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-600 mb-1.5">الشرط</label>
             <select value={condition} onChange={(e: any) => setCondition(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 font-medium">
               <option value="above">أكبر من أو يساوي (≥)</option>
               <option value="below">أقل من أو يساوي (≤)</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-600 mb-1.5">السعر المستهدف</label>
             <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="مثال: 85.00" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 font-mono" required />
           </div>
           <div>
             <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg px-4 py-2 transition-colors h-[42px] flex items-center justify-center gap-2">
               <Bell size={18} /> إضافة تنبيه
             </button>
           </div>
         </form>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50">
           <h3 className="font-semibold text-slate-800">التنبيهات النشطة</h3>
         </div>
         <div className="divide-y divide-slate-100">
           {alerts.length === 0 ? (
             <div className="p-8 text-center text-slate-400 font-medium">لا توجد تنبيهات نشطة حالياً.</div>
           ) : (
             alerts.map(alert => (
               <div key={alert.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${alert.isTriggered ? 'bg-rose-100 text-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.4)] animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                     <BellRing size={20} />
                   </div>
                   <div>
                     <div className="font-bold text-slate-800 font-mono text-lg">{alert.symbol}</div>
                     <div className="text-sm text-slate-500 mt-0.5">
                       تنبيه عندما يكون السعر <strong className="text-slate-700">{alert.condition === 'above' ? 'أكبر من أو يساوي' : 'أقل من أو يساوي'}</strong> <span className="font-mono text-slate-800 font-semibold">{alert.price}</span> EGP
                     </div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                   {alert.isTriggered && (
                     <span className="px-3 py-1.5 bg-rose-500 text-white text-xs font-bold rounded-full animate-bounce">
                       تم الوصول للهدف!
                     </span>
                   )}
                   <button onClick={() => deleteAlert(alert.id)} className="text-slate-400 hover:text-rose-500 p-2 transition-colors text-sm font-medium">حذف</button>
                 </div>
               </div>
             ))
           )}
         </div>
       </div>
    </div>
  );
}

function FundsView() {
  const [funds, setFunds] = useState([
    { id: 'azg', name: 'صندوق إي زد-جولد (AZG.CA)', provider: 'أزيموت مصر', type: 'معدن الذهب', nav: null as string | null, ytd: 15.2, risk: 'متوسط', signal: 'شراء' },
    { id: 'ahly', name: 'صندوق البنك الأهلي الأول', provider: 'البنك الأهلي المصري', type: 'أسهم تراكمي', nav: null as string | null, ytd: 22.4, risk: 'عالي', signal: 'احتفاظ' },
    { id: 'baraka', name: 'صندوق بشاير (الإسلامي)', provider: 'بنك البركة', type: 'أسهم إسلامية', nav: null as string | null, ytd: 28.5, risk: 'عالي', signal: 'جني أرباح' },
    { id: 'cib', name: 'صندوق أصول (الرابع)', provider: 'التجاري الدولي (CIB)', type: 'أسهم', nav: null as string | null, ytd: 18.1, risk: 'عالي', signal: 'شراء' },
    { id: 'misr', name: 'صندوق مصر النقدي', provider: 'بنك مصر', type: 'أسواق نقد', nav: null as string | null, ytd: 21.0, risk: 'منخفض جداً', signal: 'احتفاظ' },
    { id: 'agri', name: 'صندوق المتوازن (البنك الزراعي)', provider: 'البنك الزراعي المصري', type: 'متوازن', nav: null as string | null, ytd: 12.3, risk: 'متوسط', signal: 'تراكم' },
  ]);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchLiveNav = async (id: string, name: string) => {
    setLoadingId(id);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `أنت مساعد مالي في مصر. قم بالبحث الفوري لتحديد آخر سعر معلن لوثيقة صندوق الاستثمار: "${name}" لليوم الحالي من خلال بحث جوجل. فقط وحصرياً أعد السعر كرقم ثم العملة (مثال: "35.5 ج.م"). لا تكتب أي تفاصيل أخرى أو نصوص إضافية.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setFunds(prev => prev.map(f => f.id === id ? { ...f, nav: response.text || 'غير متوفر' } : f));
    } catch (err: any) {
      console.error(err);
      let errMsg = 'خطأ بالخدمة';
      if (err.message?.includes('429') || err.message?.includes('quota')) errMsg = 'تجاوزت الحد';
      setFunds(prev => prev.map(f => f.id === id ? { ...f, nav: errMsg } : f));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">تحليل وتوصيات صناديق الاستثمار</h2>
        <p className="text-slate-500 mt-1">تابع أداء صناديق الاستثمار المصرية المتنوعة مع توصيات الخبراء المبنية على العوائد والمخاطر والمؤشرات الكلية.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
        <Info className="shrink-0 mt-0.5" size={20} />
        <div className="text-sm leading-relaxed">
          <strong>استعلام حي للأسعار:</strong> لضمان دقة الأسعار وعدم الاعتماد على بيانات مسجلة، يمكنك الآن جلب السعر اللحظي لكل صندوق مباشرة. اضغط على زر <strong>&quot;استعلام حي&quot;</strong> تحت الصندوق وسيقوم مساعدنا الذكي بالبحث في موقع مدير الصندوق والبورصة للرد بالسعر الفعلي اليوم.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((f, i) => (
          <motion.div 
            key={f.id} 
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{delay: i*0.1}} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{f.name}</h3>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{f.type}</span>
                     <span className="text-xs text-slate-400">{f.provider}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold leading-tight ${
                  f.signal === 'شراء' ? 'bg-emerald-100 text-emerald-700' : 
                  f.signal === 'جني أرباح' ? 'bg-rose-100 text-rose-700' : 
                  f.signal === 'تراكم' ? 'bg-blue-100 text-blue-700' : 
                  'bg-slate-100 text-slate-700'}`}>
                  {f.signal}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-4 mb-4">
                <div className="text-center sm:text-right col-span-1">
                   <div className="text-[10px] sm:text-xs text-slate-400 mb-1">عائد العام YTD</div>
                   <div className={`font-mono font-bold text-sm ${f.ytd >= 20 ? 'text-emerald-600' : 'text-emerald-500'}`}>+{f.ytd}%</div>
                </div>
                <div className="text-center sm:text-right col-span-2 border-r border-slate-100 pr-2">
                   <div className="text-[10px] sm:text-xs text-slate-400 mb-2">سعر الوثيقة (NAV)</div>
                   {f.nav !== null ? (
                     <div className="font-bold text-slate-800 text-sm whitespace-pre-wrap">{f.nav}</div>
                   ) : (
                     <button 
                       onClick={() => fetchLiveNav(f.id, f.name)}
                       disabled={loadingId === f.id}
                       className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 w-full disabled:opacity-50 h-8"
                     >
                       {loadingId === f.id ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span></span> : <span><Search size={12} className="inline mr-0.5" /> استعلام حي بالذكاء</span>}
                     </button>
                   )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex gap-4 mt-6">
        <Landmark className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-800 mb-1">رؤية Brights Pro لقطاع الصناديق</h3>
          <p className="text-sm text-blue-700/80 leading-relaxed">
            في ظل دورات التيسير النقدي المتوقعة، نُوصي بزيادة الأوزان في الشريحة الاستثمارية المتوازنة وأسواق الأسهم. صناديق أسواق النقد لا تزال خياراً ممتازاً للكاش الاحتياطي مع تحقيق سيولة يومية وعائد يفوق الـ 20%، بينما يوفر صندوق الذهب (AZG.CA) أداة قوية للتحوط ضد تقلبات العملة الممكنة.
          </p>
        </div>
      </div>
    </div>
  );
}

function NewsView() {
  const news = [
    { title: 'البنك المركزي يثبت أسعار الفائدة في اجتماعه الأخير', time: 'منذ ساعتين', type: 'macro', sentiment: 'neutral', excerpt: 'قررت لجنة السياسة النقدية للبنك المركزي المصري الإبقاء على سعري عائد الإيداع والإقراض لليلة واحدة وسعر العملية الرئيسية للبنك المركزي.' },
    { title: 'أرباح البنك التجاري الدولي (CIB) ترتفع بنسبة 25% في الربع الأول', time: 'منذ 5 ساعات', type: 'company', sentiment: 'bullish', excerpt: 'أعلن البنك التجاري الدولي عن تحقيق نمو قوي في صافي الأرباح مدفوعاً بزيادة صافي الدخل من العائد.' },
    { title: 'توقعات بزيادة الاستثمارات الأجنبية في قطاع العقارات', time: 'منذ يوم', type: 'sector', sentiment: 'bullish', excerpt: 'تقارير تتحدث عن اهتمام متزايد من صناديق استثمار خليجية بضخ سيولة في كبرى شركات التطوير العقاري المصرية.' },
    { title: 'تراجع أسعار الأسمدة عالمياً يضغط على أرباح قطاع البتروكيماويات', time: 'منذ يومين', type: 'sector', sentiment: 'bearish', excerpt: 'انخفاض متوسط أسعار تصدير اليوريا عالمياً مما قد يؤثر على أرباح شركات الأسمدة المدرجة في البورصة.' },
  ];

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">أخبار ورؤى السوق</h2>
        <p className="text-slate-500 mt-1">تغطية ذكية لأهم الأخبار الاقتصادية وتأثيرها المتوقع على أسهمك بالإضافة إلى الأجندة الاقتصادية (الماكرو).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className={`absolute top-0 right-0 w-1.5 h-full ${item.sentiment === 'bullish' ? 'bg-emerald-500' : item.sentiment === 'bearish' ? 'bg-rose-500' : 'bg-slate-400'}`}></div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-slate-800 leading-snug text-lg flex-1">{item.title}</h3>
                {item.sentiment === 'bullish' ? (
                   <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl shrink-0"><TrendingUp size={20} /></div>
                ) : item.sentiment === 'bearish' ? (
                   <div className="bg-rose-100 text-rose-700 p-2 rounded-xl shrink-0"><TrendingUp size={20} className="rotate-180" /></div>
                ) : (
                   <div className="bg-slate-100 text-slate-600 p-2 rounded-xl shrink-0"><Info size={20} /></div>
                )}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{item.excerpt}</p>
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                 <span className="flex items-center gap-1.5"><Newspaper size={14} /> أخبار {item.type === 'macro' ? 'الاقتصاد الكلي' : item.type === 'company' ? 'الشركات' : 'القطاعات'}</span>
                 <span>{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
             <Calendar className="text-indigo-600" size={24} />
             <h3 className="font-bold text-slate-800 text-lg">الأجندة الاقتصادية</h3>
          </div>
          <div className="space-y-5">
             <div className="relative pl-4 border-r-2 border-indigo-500 mr-2 pr-4 space-y-1">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -right-[23px] top-1 ring-4 ring-slate-50"></div>
                <div className="text-xs font-bold text-indigo-600">غداً، 10:00 صباحاً</div>
                <div className="font-bold text-slate-800">بيانات التضخم (الجهاز المركزي للتعبئة العامة والإحصاء)</div>
                <div className="text-xs text-slate-500">التوقع: استقرار عند 32% - ينعكس على قطاع الاستهلاك.</div>
             </div>
             <div className="relative pl-4 border-r-2 border-slate-300 mr-2 pr-4 space-y-1 opacity-70">
                <div className="absolute w-3 h-3 bg-slate-300 rounded-full -right-[23px] top-1 ring-4 ring-slate-50"></div>
                <div className="text-xs font-bold text-slate-500">الخميس القادم</div>
                <div className="font-bold text-slate-700">اجتماع لجنة السياسة النقدية (CBE)</div>
                <div className="text-xs text-slate-500">الأهمية: قصوى - تحديد اتجاه أسعار الفائدة.</div>
             </div>
             <div className="relative pl-4 border-r-2 border-slate-300 mr-2 pr-4 space-y-1 opacity-70">
                <div className="absolute w-3 h-3 bg-slate-300 rounded-full -right-[23px] top-1 ring-4 ring-slate-50"></div>
                <div className="text-xs font-bold text-slate-500">الأسبوع القادم</div>
                <div className="font-bold text-slate-700">مراجعة صندوق النقد الدولي (IMF)</div>
                <div className="text-xs text-slate-500">إقرار الشريحة الجديدة من التمويل.</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeatmapView({ marketData, setMarketData }: { marketData: any[], setMarketData: React.Dispatch<React.SetStateAction<any[]>> }) {
  const [loading, setLoading] = useState(false);

  const fetchLiveHeatmap = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `أنت محلل مالي. قم بالبحث لجلب نسبة التغير المئوية (Change %) اليومية لأسهم البورصة المصرية التالية لليوم الحالي. الأسهم: COMI.CA, TMGH.CA, ABUK.CA, EAST.CA, FWRY.CA, SWDY.CA, MNHD.CA, HELI.CA, HRHO.CA, AMOC.CA, MFPC.CA, CLHO.CA, JUFO.CA, ORAS.CA, ESRS.CA, DOMT.CA, CCAP.CA, ADIB.CA, ISPH.CA, EKHOA.CA.
استخرج النسبة كـ رقم عشري، إذا كان النزول هبوطاً اجعله سالباً، وإذا صعوداً موجباً.
أعد فقط وفقط مصفوفة JSON صالحة كالتالي: [{"symbol": "COMI.CA", "change": 1.2}, {"symbol": "TMGH.CA", "change": -0.5}] لا تضف أي نص آخر أو مقدمات.`,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1
        }
      });
      const text = response.text || '';
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        let liveChanges = [];
        try {
          liveChanges = JSON.parse(match[0]);
        } catch (e) { console.error('Failed to parse JSON', e); }
        
        if (liveChanges.length > 0) {
          setMarketData(prev => prev.map(stock => {
            const live = liveChanges.find((l: any) => l.symbol === stock.symbol);
            if (live && typeof live.change === 'number') {
              return { ...stock, change: live.change };
            }
            return stock;
          }));
        }
      }
    } catch (err) {
      console.error(err);
      alert('نعتذر، حدثت مشكلة أثناء تحديث خريطة السوق المباشرة.');
    } finally {
      setLoading(false);
    }
  };

  const sectors = marketData.reduce((acc, stock) => {
    if (!acc[stock.sector]) acc[stock.sector] = [];
    acc[stock.sector].push(stock);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6 pb-16 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">الخريطة الحرارية (Heatmap)</h2>
          <p className="text-slate-500 mt-1">توضح أداء القطاعات والأسهم في السوق المصري بناءً على التغير اللحظي وتتحرك الألوان حسب نسبة التغير.</p>
        </div>
        <button
          onClick={fetchLiveHeatmap}
          disabled={loading}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shrink-0 shadow-sm"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-emerald-400 rounded-full animate-bounce"></span>
              <span>جاري التحليل...</span>
            </div>
          ) : (
            <>
              <Sparkles size={18} className="text-emerald-400" />
              <span>تحديث حي للسوق بالذكاء</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-slate-900 rounded-2xl p-4 md:p-6 shadow-inner border border-slate-800">
        <div className="flex flex-col gap-6">
          {(Object.entries(sectors) as [string, any[]][]).map(([sector, stocks], idx) => {
            const avgChange = stocks.reduce((sum, s) => sum + s.change, 0) / stocks.length;
            return (
              <motion.div 
                key={sector} 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: idx * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-300 text-lg">{sector}</h3>
                  <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${avgChange > 0 ? 'bg-emerald-500/20 text-emerald-400' : avgChange < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'}`}>
                    {avgChange > 0 ? '+' : ''}{avgChange.toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {stocks.sort((a, b) => b.marketCap - a.marketCap).map((s) => {
                    const changeAbs = Math.abs(s.change);
                    let baseColor = 'bg-slate-700'; 
                    if (s.change > 0) {
                      if (changeAbs > 4) baseColor = 'bg-emerald-500';
                      else if (changeAbs > 1.5) baseColor = 'bg-emerald-600';
                      else baseColor = 'bg-emerald-700';
                    } else if (s.change < 0) {
                      if (changeAbs > 4) baseColor = 'bg-rose-500';
                      else if (changeAbs > 1.5) baseColor = 'bg-rose-600';
                      else baseColor = 'bg-rose-700';
                    }
                    const isGiant = s.marketCap > 100000000000;

                    return (
                      <div 
                        key={s.symbol} 
                        className={`${baseColor} ${isGiant ? 'col-span-2 row-span-2 min-h-[120px]' : 'col-span-1 min-h-[80px]'} rounded-lg p-3 flex flex-col justify-between transition-colors duration-500 shadow-sm cursor-pointer hover:ring-2 hover:ring-white/50 group`}
                      >
                         <div className="flex justify-between items-start">
                           <span className={`font-bold ${isGiant ? 'text-lg' : 'text-sm'} text-white group-hover:drop-shadow-md`}>{s.symbol}</span>
                           <span className={`text-[10px] sm:text-xs text-white/80 font-mono`}>{s.price.toFixed(2)}</span>
                         </div>
                         <div className="flex justify-between items-end mt-auto pt-2">
                           <span className="text-[10px] text-white/50 truncate max-w-[60%] leading-tight" title={s.name}>{s.name}</span>
                           <span className={`font-mono font-bold ${isGiant ? 'text-base' : 'text-[11px] sm:text-xs'} text-white`}>
                             {s.change > 0 ? '+' : ''}{s.change.toFixed(2)}%
                           </span>
                         </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
