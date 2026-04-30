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
  Loader2
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';

// --- Dynamic Recharts Components ---
const PortfolioChart = dynamic(() => import('../components/PortfolioChart'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-50 animate-pulse rounded-2xl" />
});

// Initialize Gemini - handled locally in AnalystView
// const ai = ...

import { useIsMobile } from '../hooks/use-mobile';

// --- Components ---

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
    { title: 'تقرير: قطاع العقارات يتصدر قيم التداول في البورصة المصرية للأسبوع الثالث', source: 'EGX News', time: 'منذ ساعتين' },
    { title: 'البنك المركزي المصري يثبت الفائدة عند 27.25% والجنيه يستقر', source: 'الشرق بلومبرج', time: 'منذ 5 ساعات' },
    { title: 'طلعت مصطفى تعلن عن نتائج أعمال قياسية بنمو 68% في الإيرادات', source: 'مباشر', time: 'منذ 3 ساعات' },
    { title: 'تحليل: سهم COMI يختبر مستويات تاريخية جديدة مع زيادة سيولة الأجانب', source: 'Brights Intelligence', time: 'منذ ساعة' },
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
      <button className="w-full mt-8 py-3 text-[10px] font-black text-slate-400 hover:text-slate-900 border-t border-slate-50 transition-colors">
        عرض كافة الأخبار
      </button>
    </div>
  );
}

function StockRadar() {
  const radarData = {
    gainers: [
      { name: 'بالم هيلز للتعمير', symbol: 'PHDC', change: '+7.8%', price: '4.25' },
      { name: 'طلعت مصطفى', symbol: 'TMGH', change: '+4.2%', price: '46.10' },
      { name: 'فوري لتكنولوجيا البنوك', symbol: 'FWRY', change: '+3.1%', price: '6.90' },
      { name: 'السويدي اليكتريك', symbol: 'SWDY', change: '+2.5%', price: '34.20' },
    ],
    losers: [
      { name: 'مصر للالومنيوم', symbol: 'EGAL', change: '-3.1%', price: '85.40' },
      { name: 'إي فاينانس', symbol: 'EFIH', change: '-2.4%', price: '21.80' },
    ],
    alerts: [
      { type: 'Support', stock: 'اختبار دعم COMI عند مستوى 80 ج.م', time: 'منذ 5 دقائق' },
      { type: 'Volume', stock: 'قفزة في سيولة EAST مع أخبار الاستحواذ', time: 'منذ 22 دقيقة' },
      { type: 'Breakout', stock: 'اختراق مقاومة TMGH عند 45 ج.م', time: 'منذ ساعة' },
    ]
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={18} />
              أعلى الرابحين (EGX)
            </h3>
            <div className="space-y-4">
              {radarData.gainers.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs font-black">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">{s.change}</p>
                    <p className="text-[10px] text-slate-400">{s.price} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
              <TrendingDown className="text-rose-500" size={18} />
              أعلى الخاسرين
            </h3>
            <div className="space-y-4">
              {radarData.losers.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs font-black">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-rose-600">{s.change}</p>
                    <p className="text-[10px] text-slate-400">{s.price} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-800 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
               <Activity size={300} />
            </div>
            <h3 className="text-sm font-black text-emerald-400 mb-6 flex items-center gap-2">
              <Zap size={18} />
              رادار السيولة والذكاء الاصطناعي
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {radarData.alerts.map((a, i) => (
                <div key={i} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex justify-between items-center group hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{a.stock}</p>
                    <p className="text-[10px] text-slate-500">{a.time}</p>
                  </div>
                  <span className={`text-[8px] font-black px-2 py-1 rounded uppercase ${a.type === 'Support' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {a.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <MarketNews />
        </div>
      </div>
    </div>
  );
}

function MacroBar() {
  const indicators = [
    { label: 'سعر الفائدة (CBE)', value: '27.25%', change: '0.0%', trend: 'neutral' },
    { label: 'التضخم (CPI)', value: '33.3%', change: '-0.4%', trend: 'down' },
    { label: 'USD/EGP', value: '47.85', change: '-0.10', trend: 'down' },
    { label: 'EGX30', value: '31,020', change: '+1.2%', trend: 'up' },
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

function PortfolioView() {
  const portfolio = [
    { name: 'البنك التجاري الدولي', symbol: 'COMI', shares: 500, avgPrice: '73.20', currentPrice: '82.50', total: 41250, profit: '+12.7%' },
    { name: 'طلعت مصطفى', symbol: 'TMGH', shares: 1200, avgPrice: '42.60', currentPrice: '45.10', total: 54120, profit: '+5.8%' },
    { name: 'النساجون الشرقيون', symbol: 'ORWE', shares: 300, avgPrice: '19.40', currentPrice: '18.90', total: 5670, profit: '-2.5%' },
    { name: 'القاهرة للاستثمار', symbol: 'CIRA', shares: 2000, avgPrice: '12.10', currentPrice: '14.50', total: 29000, profit: '+19.8%' },
  ];

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
              { name: '1', value: 120000 },
              { name: '5', value: 122000 },
              { name: '10', value: 118000 },
              { name: '15', value: 125000 },
              { name: '20', value: 128000 },
              { name: '25', value: 127000 },
              { name: '30', value: 130040 },
            ]} />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <PieChart className="text-blue-500" />
                مكونات المحفظة الذكية
              </h3>
            <div className="flex gap-2">
              <button className="text-[10px] font-black text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                تحميل التقرير PDF
              </button>
              <button className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 flex items-center gap-2">
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
                {portfolio.map((item, i) => (
                  <tr key={i} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 pr-4">
                      <p className="text-xs font-black">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{item.symbol}.CA</p>
                    </td>
                    <td className="py-4 text-xs font-bold text-slate-600">{item.shares}</td>
                    <td className="py-4 text-xs font-bold text-slate-400 font-mono tracking-tighter">{item.avgPrice}</td>
                    <td className="py-4 text-xs font-black text-slate-900 font-mono tracking-tighter">{item.currentPrice}</td>
                    <td className="py-4 pl-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded ${item.profit.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {item.profit}
                      </span>
                    </td>
                  </tr>
                ))}
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
              <h2 className="text-3xl font-black mb-6 font-mono tracking-tighter">130,040.00 <span className="text-sm uppercase mr-1">EGP</span></h2>
              <div className="flex items-center gap-2 mb-8">
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-2 py-1 rounded border border-emerald-500/20">اليوم: +1.8%</span>
                <span className="bg-slate-800 text-slate-400 text-[10px] font-black px-2 py-1 rounded border border-slate-700">الشهر: +12.4%</span>
              </div>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-emerald-50 transition-colors">
                أضف سهم جديد للمحفظة
              </button>
           </div>

           <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-500" />
                توصيات الذكاء الاصطناعي للمحفظة
              </h4>
              <div className="space-y-3">
                 <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-slate-900 mb-1">زيادة الوزن في قطاع البنوك</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">يتوقع الذكاء الاصطناعي تحسناً في هوامش الفائدة الصافية لـ COMI بناءً على تقارير CBE الأخيرة.</p>
                 </div>
                 <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-slate-900 mb-1">فرصة جني أرباح في TMGH</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">السهم يقترب من منطقة مقاومة تاريخية عند 48.50 ج.م، يُنصح بتخفيف المراكز.</p>
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
                    <span className="font-bold text-amber-600">مرتفع</span>
                 </div>
                 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[60%]" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function FundsView() {
  const funds = [
    { name: 'صندوق بنك مصر الثالث', type: 'أسهم', yield: '28.4%', risk: 'عالي', min: '100 ج.م' },
    { name: 'صندوق استثمار فيصل', type: 'إسلامي', yield: '24.1%', risk: 'متوسط', min: '500 ج.م' },
    { name: 'هيرميس ثروة', type: 'متوازن', yield: '19.8%', risk: 'منخفض', min: '1000 ج.م' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
      {funds.map((f, i) => (
        <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-indigo-200 transition-all">
          <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               <Globe size={24} />
             </div>
             <span className={`text-[8px] font-black px-2 py-1 rounded uppercase bg-slate-100 text-slate-500`}>{f.type}</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-2">{f.name}</h3>
          <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">العائد السنوي</p>
                <p className="text-lg font-black text-emerald-600">{f.yield}</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-2xl">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">المخاطرة</p>
                <p className="text-xs font-black text-slate-700">{f.risk}</p>
             </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-slate-400 px-2">
             <span>الحد الأدنى: {f.min}</span>
             <button className="text-indigo-600 font-black flex items-center gap-1 hover:gap-2 transition-all">
               إشترك الآن <ChevronRight size={10} />
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
      <div className="flex justify-start">
        <div className="max-w-[80%] p-5 rounded-[2rem] bg-slate-100 text-slate-900 rounded-tr-sm shadow-sm border border-slate-200/50">
          <p className="text-sm font-bold leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  // AI response - structure it
  const sections = content.split('###').filter(s => s.trim());

  if (sections.length < 2) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[90%] p-8 rounded-[2.5rem] bg-slate-900 text-white rounded-tl-sm shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-blue-500" />
          <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-p:text-slate-300">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
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
            <div 
              key={idx}
              className={`p-6 rounded-[2rem] shadow-lg border relative overflow-hidden ${
                isSimulation 
                  ? 'bg-emerald-950 border-emerald-500/30 text-white' 
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              {isSimulation && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
              )}
              <h4 className="flex items-center gap-3 text-sm font-black mb-4 pb-3 border-b border-white/10">
                {getIcon(title)}
                {title}
              </h4>
              <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-p:text-slate-300 prose-li:text-slate-300 font-medium">
                <ReactMarkdown>{body}</ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AnalystView() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'أهلاً بك. أنا Brights Pro، محللك المالي الذكي وخبير البورصة المصرية. كيف يمكنني مساعدتك في تحليل السوق المصري اليوم؟\n\nأنا الآن متصل بـ Google Search للحصول على أدق الأسعار اللحظية والأخبار الجوهرية.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'Speculation' | 'Investment'>('Speculation');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mountedClock, setMountedClock] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

    try {
      const prompt = `
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
`;

      const modelName = 'gemini-3-flash-preview';
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
      
      const result = await ai.models.generateContent({
        model: modelName,
        contents: userQuery,
        config: {
          systemInstruction: prompt,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tools: [{ googleSearch: {} }] as any
        }
      });
      
      const text = result?.text || 'عذراً، لم أتمكن من الحصول على رد حالياً.';
      setMessages(prev => [...prev, { role: 'ai', content: text }]);
    } catch (err: unknown) {
      console.error('Gemini API Error:', err);
      // Detailed error message for the UI if it's a known error type
      const errorMessage = err instanceof Error ? err.message : 'عذراً، حدث خطأ أثناء الوصول للبيانات الحالية للبورصة المصرية.';
      setMessages(prev => [...prev, { role: 'ai', content: `خطأ: ${errorMessage}` }]);
    } finally {
      setLoading(false);
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

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
        {messages.map((m, i) => (
          <FormattedMessage key={i} {...m} />
        ))}
        {loading && (
          <div className="flex justify-end">
             <div className="bg-slate-900 text-white p-6 rounded-[2rem] rounded-tl-sm flex items-center gap-4 shadow-xl border border-emerald-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent animate-pulse" />
                <Loader2 className="animate-spin text-emerald-400 shrink-0" size={24} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Brights Pro AI</span>
                  <span className="text-xs font-bold text-slate-300">جاري مسح بيانات جوجل ومحاكاة العوائد الصافية...</span>
                </div>
             </div>
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


// --- Main Page ---

export default function Page() {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) setIsCollapsed(true);
  }, [isMobile]);
  const [activeTab, setActiveTab] = useState('Analyst');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-slate-900 items-center justify-center">
        <Activity className="text-emerald-500 animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <main className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans rtl" dir="rtl">
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
          <NavItem icon={<Globe size={20} />} label="صناديق الاستثمار" active={activeTab === 'Funds'} onClick={() => setActiveTab('Funds')} isCollapsed={isCollapsed} />
          <NavItem icon={<History size={20} />} label="سجل التوصيات" active={activeTab === 'History'} onClick={() => setActiveTab('History')} isCollapsed={isCollapsed} />
        </nav>

        <div className="mt-auto p-4 space-y-1 border-t border-slate-50">
           <NavItem icon={<Settings size={20} />} label="الإعدادات" active={false} onClick={() => {}} isCollapsed={isCollapsed} />
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
            {[
              { s: 'EGX30', v: '31,020', c: '+1.2%' },
              { s: 'COMI', v: '82.50', c: '+0.4%' },
              { s: 'TMGH', v: '45.10', c: '+2.1%' },
              { s: 'FWRY', v: '6.90', c: '-0.3%' },
              { s: 'SWDY', v: '34.20', c: '+1.5%' },
              { s: 'PHDC', v: '4.25', c: '+7.8%' },
              { s: 'EAST', v: '24.80', c: '0.0%' },
              { s: 'ADIB', v: '38.40', c: '+0.8%' },
            ].map((stock, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] font-black">
                <span className="text-slate-400 font-mono tracking-tighter">{stock.s}</span>
                <span className="text-white font-mono tracking-tighter">{stock.v}</span>
                <span className={stock.c.startsWith('+') ? 'text-emerald-400' : stock.c.startsWith('-') ? 'text-rose-400' : 'text-slate-500'}>
                  {stock.c}
                </span>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              { s: 'EGX30', v: '31,020', c: '+1.2%' },
              { s: 'COMI', v: '82.50', c: '+0.4%' },
              { s: 'TMGH', v: '45.10', c: '+2.1%' },
              { s: 'FWRY', v: '6.90', c: '-0.3%' },
              { s: 'SWDY', v: '34.20', c: '+1.5%' },
              { s: 'PHDC', v: '4.25', c: '+7.8%' },
              { s: 'EAST', v: '24.80', c: '0.0%' },
              { s: 'ADIB', v: '38.40', c: '+0.8%' },
            ].map((stock, i) => (
              <div key={i+"-dup"} className="flex items-center gap-2 text-[10px] font-black">
                <span className="text-slate-400 font-mono tracking-tighter">{stock.s}</span>
                <span className="text-white font-mono tracking-tighter">{stock.v}</span>
                <span className={stock.c.startsWith('+') ? 'text-emerald-400' : stock.c.startsWith('-') ? 'text-rose-400' : 'text-slate-500'}>
                  {stock.c}
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
                <div className="flex-1 w-full h-full">
                  {activeTab === 'Analyst' && (
                    <div key="analyst" className="h-full">
                      <AnalystView />
                    </div>
                  )}
                  {activeTab === 'Dashboard' && (
                    <div key="dashboard">
                      <PortfolioView />
                    </div>
                  )}
                  {activeTab === 'Market' && (
                    <div key="market">
                      <StockRadar />
                    </div>
                  )}
                  {activeTab === 'Funds' && (
                    <div key="funds">
                      <FundsView />
                    </div>
                  )}
                  {activeTab === 'History' && (
                    <div key="placeholder" className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                      <Activity size={48} className="opacity-20 animate-pulse" />
                      <p className="font-medium text-center">سجل التوصيات قيد المزامنة مع خبير Brights AI...</p>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
