import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  MapPin,
  Package,
  Globe,
  Calendar,
  ArrowUpRight,
  DollarSign,
  Users,
} from 'lucide-react';

// ==========================================
// --- DATA: INTER (International Only) ---
// ==========================================

const interNationData = [
  { name: 'จีน (China)', value: 31843362 },
  { name: 'ไต้หวัน (Taiwan)', value: 10171028 },
  { name: 'สิงคโปร์ (Singapore)', value: 6179456 },
  { name: 'สหรัฐอเมริกา (USA)', value: 5264516 },
  { name: 'ลาว (Laos)', value: 5072094 },
  { name: 'พม่า (Myanmar)', value: 3718654 },
  { name: 'ฟิลิปปินส์ (Philippines)', value: 2056913 },
  { name: 'อินเดีย (India)', value: 1897446 },
  { name: 'UAE', value: 1650093 },
  { name: 'มาเลเซีย (Malaysia)', value: 1644390 },
].sort((a, b) => b.value - a.value);

const interProductData = [
  { name: 'Ulthera M', value: 11109757 },
  { name: 'Filler-L', value: 9120075 },
  { name: 'Thermage-M', value: 8556820 },
  { name: 'Botox L', value: 7147474 },
  { name: 'OLG-H', value: 6893962 },
  { name: 'MPT-M', value: 6338367 },
  { name: 'LHR-H', value: 5636225 },
  { name: 'IV-H', value: 4515667 },
  { name: 'Sculptra-L', value: 3999360 },
  { name: 'Botox M', value: 3977216 },
].sort((a, b) => b.value - a.value);

const interBranchData = [
  { name: 'สยาม (Siam)', value: 20604984 },
  { name: 'พระราม 9 (Rama 9)', value: 13060186 },
  { name: 'เอ็มควอเทียร์ (Emquartier)', value: 11401093 },
  { name: 'พัทยา (Pattaya)', value: 7241814 },
  { name: 'สีลม (Silom)', value: 6141227 },
  { name: 'One Bangkok', value: 4876702 },
  { name: 'CTW', value: 3675800 },
  { name: 'อโศก (Asoke)', value: 3051187 },
  { name: 'ทองหล่อ (Thonglor)', value: 2490381 },
  { name: 'เมกาบางนา (Mega Bangna)', value: 2135119 },
].sort((a, b) => b.value - a.value);

const interMonthlyData = [
  { name: 'Jan', value: 5153806 },
  { name: 'Feb', value: 5189075 },
  { name: 'Mar', value: 5943340 },
  { name: 'Apr', value: 5418735 },
  { name: 'May', value: 6356035 },
  { name: 'Jun', value: 6798464 },
  { name: 'Jul', value: 7039632 },
  { name: 'Aug', value: 8344921 },
  { name: 'Sep', value: 8406866 },
  { name: 'Oct', value: 10056601 },
  { name: 'Nov', value: 9649248 },
  { name: 'Dec', value: 10784368 },
];

// ==========================================
// --- DATA: ALL (Domestic + Inter) ---
// ==========================================

const allProductData = [
  { name: 'Ulthera-M', value: 92214979 },
  { name: 'PICO-H', value: 82914607 },
  { name: 'LHR-H', value: 80182956 },
  { name: 'OLG-H', value: 77562914 },
  { name: 'Filler-L', value: 77174624 },
  { name: 'MPT-M', value: 74818845 },
  { name: 'Botox-M', value: 53321549 },
  { name: 'IV-H', value: 52648264 },
  { name: 'Botox-L', value: 41571234 },
  { name: 'Sytfirm-M', value: 27938254 },
  { name: 'Sculptra-L', value: 25742470 },
  { name: 'Sanbooster M', value: 23460171 },
  { name: 'JuveLook-L', value: 21352452 },
  { name: 'Skin power-M', value: 18555866 },
  { name: 'HR+PICO-H', value: 17670271 },
  { name: 'Thermage-M', value: 17569913 },
  { name: 'UF-M', value: 12484763 },
  { name: 'Meso fat-H', value: 10670642 },
  { name: 'Anti Melasma-H', value: 10336081 },
  { name: 'Prothilo-L', value: 7365741 },
];

const allBranchData = [
  { name: 'สยาม (Siam)', value: 89474802 },
  { name: 'ฟิวเจอร์พาร์ครังสิต', value: 83918673 },
  { name: 'พระราม 9', value: 57659556 },
  { name: 'เมกาบางนา', value: 54170366 },
  { name: 'ลาดพร้าว', value: 50132972 },
  { name: 'เวสต์เกต', value: 49621401 },
  { name: 'พัทยา', value: 48452042 },
  { name: 'เอสพานาด', value: 44786816 },
  { name: 'พระราม 2', value: 40335968 },
  { name: 'ปิ่นเกล้า', value: 39317489 },
  { name: 'ศรีนครินทร์', value: 34046783 },
  { name: 'บางแค', value: 29239593 },
  { name: 'สีลม', value: 27949596 },
  { name: 'บางกะปิ', value: 26649727 },
  { name: 'แจ้งวัฒนะ', value: 21812987 },
].sort((a, b) => b.value - a.value);

const allMonthlyData = [
  { name: 'Jan', value: 57212193 },
  { name: 'Feb', value: 57732866 },
  { name: 'Mar', value: 66521430 },
  { name: 'Apr', value: 64062768 },
  { name: 'May', value: 64305243 },
  { name: 'Jun', value: 66682204 },
  { name: 'Jul', value: 73825602 },
  { name: 'Aug', value: 73173589 },
  { name: 'Sep', value: 76053629 },
  { name: 'Oct', value: 84167944 },
  { name: 'Nov', value: 78655811 },
  { name: 'Dec', value: 91663852 },
];

// Normalized Age Data
const allAgeProductData = [
  { name: 'Ulthera-M', range30: 9135431, range31_40: 41252603, range41_50: 29516804, range50: 11429352 },
  { name: 'PICO-H', range30: 30511192, range31_40: 36962356, range41_50: 12409335, range50: 2437911 },
  { name: 'LHR-H', range30: 38260709, range31_40: 30851554, range41_50: 9281724, range50: 1690579 },
  { name: 'OLG-H', range30: 20191141, range31_40: 37275533, range41_50: 15255994, range50: 4490226 },
  { name: 'Filler-L', range30: 18653143, range31_40: 30558807, range41_50: 19546417, range50: 8324118 },
  { name: 'Botox-M', range30: 11477687, range31_40: 24928884, range41_50: 12717964, range50: 4025114 },
  { name: 'IV-H', range30: 19253924, range31_40: 21041136, range41_50: 10056026, range50: 2204471 },
  { name: 'Botox-L', range30: 5723103, range31_40: 16825553, range41_50: 13252321, range50: 5698270 },
  { name: 'Sculptra-L', range30: 1663737, range31_40: 9414892, range41_50: 9404609, range50: 5219233 },
  { name: 'JuveLook-L', range30: 4916585, range31_40: 10367502, range41_50: 5043566, range50: 1022799 },
];

const AGE_COLORS = {
  range30: '#82ca9d', // < 30
  range31_40: '#8884d8', // 31-40
  range41_50: '#ffc658', // 41-50
  range50: '#ff8042', // > 50
};

// --- COMPONENTS ---

const Card = ({ title, value, icon: Icon, trend, subtext, colorClass = 'text-blue-600' }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon size={24} className={colorClass} />
      </div>
    </div>
    {(trend || subtext) && (
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <span className="text-emerald-500 font-medium flex items-center mr-2">
            <ArrowUpRight size={16} className="mr-1" />
            {trend}
          </span>
        )}
        {subtext && <span className="text-slate-400">{subtext}</span>}
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg border border-slate-700 z-50">
        <p className="font-semibold mb-1 border-b border-slate-600 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()} THB
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SalesDashboard() {
  const [mainTab, setMainTab] = useState('INTER'); // 'INTER' or 'ALL'
  const [subTab, setSubTab] = useState('overview'); // Managed dynamically based on mainTab

  // Reset subtab when switching main tab
  const handleMainTabChange = (tab) => {
    setMainTab(tab);
    setSubTab(tab === 'INTER' ? 'nation' : 'product_all');
  };

  const formatCurrency = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // --- RENDERERS ---

  const renderInterContent = () => {
    switch (subTab) {
      case 'nation':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <Globe className="mr-2 text-indigo-500" />
                  Top 10 International Customers (By Nation)
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={interNationData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" tickFormatter={formatCurrency} stroke="#94a3b8" />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]}>
                        {interNationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl shadow-lg text-white">
                <h4 className="text-indigo-100 font-medium mb-2">Dominant Market</h4>
                <div className="flex items-center mb-6">
                  <h2 className="text-4xl font-bold mr-3">35.6%</h2>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold">Share</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1 text-indigo-100">
                      <span>China</span>
                      <span>31.8M</span>
                    </div>
                    <div className="w-full bg-indigo-900/40 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: '36%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'product':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <Package className="mr-2 text-rose-500" />
                Inter: Best Selling Products
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interProductData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} stroke="#94a3b8" />
                    <YAxis tickFormatter={formatCurrency} stroke="#94a3b8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Revenue" radius={[4, 4, 0, 0]}>
                      {interProductData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index < 3 ? '#f43f5e' : '#fb7185'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'branch':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <MapPin className="mr-2 text-emerald-500" />
                Inter: Revenue by Branch
              </h3>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={interBranchData} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" tickFormatter={formatCurrency} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]} fill="#10b981" barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'monthly':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <TrendingUp className="mr-2 text-cyan-500" />
                Inter: Monthly Revenue Trend
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={interMonthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValueInter" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis tickFormatter={formatCurrency} stroke="#94a3b8" />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Revenue"
                      stroke="#06b6d4"
                      fillOpacity={1}
                      fill="url(#colorValueInter)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderAllContent = () => {
    switch (subTab) {
      case 'product_all':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <Package className="mr-2 text-purple-600" />
                Top 20 Best Selling Products (All)
              </h3>
              <div className="h-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={allProductData} margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" tickFormatter={formatCurrency} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]} barSize={20}>
                      {allProductData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index < 5 ? '#9333ea' : '#c084fc'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'branch_all':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <MapPin className="mr-2 text-teal-500" />
                  Total Revenue by Branch
                </h3>
                <div className="h-[600px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={allBranchData} margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" tickFormatter={formatCurrency} stroke="#94a3b8" />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Revenue" radius={[0, 4, 4, 0]} fill="#14b8a6" barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                  <h4 className="text-teal-800 text-sm font-medium mb-1">Top Branch (All)</h4>
                  <p className="text-2xl font-bold text-teal-900">สยาม (Siam)</p>
                  <p className="text-teal-600 font-medium text-lg mt-2">89.4M THB</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-100">
                  <h4 className="text-slate-500 text-sm font-medium mb-3">Key Insight</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    "สยาม" และ "ฟิวเจอร์พาร์ครังสิต" เป็น 2 สาขาหลักที่ทำรายได้สูงสุด รวมกันกว่า 173 ล้านบาท คิดเป็นสัดส่วนสำคัญของรายได้ทั้งหมด
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'monthly_all':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <TrendingUp className="mr-2 text-blue-600" />
                Total Monthly Revenue Trend (2025)
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={allMonthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValueAll" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis tickFormatter={formatCurrency} stroke="#94a3b8" />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      name="Revenue"
                      stroke="#2563eb"
                      fillOpacity={1}
                      fill="url(#colorValueAll)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-blue-500 text-xs font-bold uppercase">Peak Month</p>
                <p className="text-xl font-bold text-blue-900">December</p>
                <p className="text-sm text-blue-700">91.6M</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg text-center">
                <p className="text-slate-500 text-xs font-bold uppercase">Average / Month</p>
                <p className="text-xl font-bold text-slate-700">71.1M</p>
              </div>
            </div>
          </div>
        );
      case 'age_all':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                <Users className="mr-2 text-orange-500" />
                Revenue Breakdown: Age Range by Product
              </h3>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={allAgeProductData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} stroke="#94a3b8" />
                    <YAxis tickFormatter={formatCurrency} stroke="#94a3b8" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="range30" stackId="a" name="< 30 Years" fill={AGE_COLORS.range30} />
                    <Bar dataKey="range31_40" stackId="a" name="31-40 Years" fill={AGE_COLORS.range31_40} />
                    <Bar dataKey="range41_50" stackId="a" name="41-50 Years" fill={AGE_COLORS.range41_50} />
                    <Bar dataKey="range50" stackId="a" name="> 50 Years" fill={AGE_COLORS.range50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start">
              <div className="mr-4 mt-1 bg-orange-200 p-2 rounded-full text-orange-700">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-orange-900">Demographic Insights</h4>
                <ul className="text-sm text-orange-800 mt-2 space-y-1 list-disc list-inside">
                  <li>
                    <strong>Ulthera-M:</strong> ได้รับความนิยมสูงสุดในกลุ่มอายุ <strong>31-40 ปี</strong> และ{' '}
                    <strong>41-50 ปี</strong> (V-Shape lifting)
                  </li>
                  <li>
                    <strong>PICO-H:</strong> ฐานลูกค้าหลักคือกลุ่ม <strong>31-40 ปี</strong> และกลุ่ม{' '}
                    <strong>&lt; 30 ปี</strong> (Skin quality/acne scars)
                  </li>
                  <li>
                    <strong>LHR-H:</strong> มีสัดส่วนกลุ่มอายุน้อย <strong>&lt; 30 ปี</strong> สูงที่สุดเมื่อเทียบกับ Product อื่น
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // --- MAIN RENDER ---

  const activeDataTotal = mainTab === 'INTER' ? '89.3M' : '854.1M';

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      {/* Header Area */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sales Analytics 2025</h1>
            <p className="text-slate-500 mt-1">
              Comprehensive dashboard for {mainTab === 'INTER' ? 'International' : 'Total Company'} performance
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <Calendar size={18} className="text-slate-400 mr-2" />
            <span className="text-sm font-medium text-slate-600">Fiscal Year: 2025</span>
          </div>
        </div>

        {/* MAIN TAB SWITCHER */}
        <div className="flex space-x-4 border-b border-slate-200 mb-6">
          <button
            onClick={() => handleMainTabChange('INTER')}
            className={`pb-3 px-2 text-lg font-bold transition-all border-b-4 ${
              mainTab === 'INTER'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            INTER
          </button>
          <button
            onClick={() => handleMainTabChange('ALL')}
            className={`pb-3 px-2 text-lg font-bold transition-all border-b-4 ${
              mainTab === 'ALL'
                ? 'border-purple-600 text-purple-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            ALL (Grand Total)
          </button>
        </div>
      </header>

      {/* KPI Cards (Dynamic based on Tab) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card
          title="Total Revenue"
          value={activeDataTotal}
          icon={DollarSign}
          subtext={mainTab === 'INTER' ? 'International Only' : 'Company Wide'}
          colorClass={mainTab === 'INTER' ? 'text-indigo-600' : 'text-purple-600'}
        />
        <Card
          title={mainTab === 'INTER' ? 'Top Nation' : 'Top Branch'}
          value={mainTab === 'INTER' ? 'China' : 'Siam'}
          icon={mainTab === 'INTER' ? Globe : MapPin}
          subtext="Highest Contribution"
          colorClass="text-emerald-500"
        />
        <Card
          title="Best Product"
          value="Ulthera M"
          icon={Package}
          subtext="No.1 Best Seller"
          colorClass="text-rose-500"
        />
        <Card title="Peak Month" value="December" icon={TrendingUp} subtext="High Season" colorClass="text-cyan-600" />
      </div>

      {/* Sub-Tabs & Content */}
      <div className="flex flex-col space-y-6">
        {/* SUB TAB NAVIGATION */}
        <div className="flex overflow-x-auto space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-full md:w-fit">
          {mainTab === 'INTER' ? (
            <>
              {[
                { id: 'nation', label: 'Nation', icon: Globe },
                { id: 'product', label: 'Product', icon: Package },
                { id: 'branch', label: 'Branch', icon: MapPin },
                { id: 'monthly', label: 'Monthly', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    subTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </>
          ) : (
            <>
              {[
                { id: 'product_all', label: 'Top 20 Product', icon: Package },
                { id: 'branch_all', label: 'Branch Performance', icon: MapPin },
                { id: 'monthly_all', label: 'Monthly Breakdown', icon: TrendingUp },
                { id: 'age_all', label: 'Age Range', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    subTab === tab.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Content Area */}
        <main className="min-h-[500px]">{mainTab === 'INTER' ? renderInterContent() : renderAllContent()}</main>
      </div>
    </div>
  );
}
