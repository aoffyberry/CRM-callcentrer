import React, { useState, useEffect, useMemo } from 'react';
import { Login } from './components/Login';
import { FollowUpModal } from './components/FollowUpModal';
import { User, Customer, Branch, FollowUpStatus, StatData } from './types';
import { getCustomers, updateCustomerStatus, syncFromSheets } from './services/dataService';
import { STATUS_COLORS } from './constants';
import { 
  LogOut, 
  Search, 
  RefreshCw, 
  Calendar, 
  Phone, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  User as UserIcon 
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FollowUpStatus | 'All'>('All');
  
  // Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load User from session storage on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem('clinic_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch Data when user is logged in
  useEffect(() => {
    if (user) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const data = await getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    sessionStorage.setItem('clinic_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('clinic_user');
    setCustomers([]);
  };

  const handleSync = async () => {
    setLoading(true);
    const data = await syncFromSheets();
    setCustomers(data);
    setLoading(false);
  };

  const openModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveFollowUp = async (id: string, status: FollowUpStatus, notes: string) => {
    const updatedList = await updateCustomerStatus(id, status, notes);
    setCustomers(updatedList);
  };

  // Filter Logic
  const filteredCustomers = useMemo(() => {
    if (!user) return [];
    
    // Check if user is HQ or Admin (All)
    const isSuperUser = user.branch === Branch.HQ || user.branch === Branch.All || user.branch === 'HQ';

    return customers.filter(c => {
      // 1. Branch Filter
      if (!isSuperUser && c.branch !== user.branch) return false;
      
      // 2. Search Filter
      const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.phone.includes(searchTerm);
      if (!matchesSearch) return false;

      // 3. Status Filter
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;

      return true;
    });
  }, [customers, user, searchTerm, statusFilter]);

  // Statistics
  const stats: StatData[] = useMemo(() => {
    if (!filteredCustomers.length) return [];
    
    const counts = filteredCustomers.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<FollowUpStatus, number>);

    return Object.values(FollowUpStatus).map(status => ({
      name: status,
      value: counts[status] || 0,
      color: STATUS_COLORS[status]
    })).filter(item => item.value > 0);
  }, [filteredCustomers]);


  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 text-white p-2 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-tight">Clinic CRM</h1>
              <p className="text-xs text-gray-500">สาขา: {user.branch}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <span className="text-xs text-teal-600">{user.email}</span>
             </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อ หรือ เบอร์โทร..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none w-full sm:w-64"
                />
             </div>
             
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as FollowUpStatus | 'All')}
               className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-gray-700"
             >
               <option value="All">ทุกสถานะ</option>
               {Object.values(FollowUpStatus).map(s => (
                 <option key={s} value={s}>{s}</option>
               ))}
             </select>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
             <span className="text-sm text-gray-500 hidden sm:inline">
               ลูกค้า {filteredCustomers.length} ราย
             </span>
             <button 
                onClick={handleSync} 
                disabled={loading}
                className="flex items-center gap-1 text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
             >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Sync Sheet
             </button>
          </div>
        </div>

        {/* Layout: Grid of Cards (Mobile) / Table (Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Stats */}
          <div className="lg:col-span-1 space-y-4">
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-gray-700 font-semibold mb-4 text-sm">ภาพรวมสถานะ</h3>
               <div className="h-48 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats}
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}}/>
                    </PieChart>
                 </ResponsiveContainer>
               </div>
             </div>
             
             {/* Info Box */}
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                <h4 className="font-bold flex items-center gap-2 mb-2">
                   <UserIcon size={16}/> ทีม {user.branch}
                </h4>
                <p>
                  {user.branch === Branch.HQ || user.branch === 'HQ' || user.branch === Branch.All
                    ? 'คุณมีสิทธิ์เข้าถึงข้อมูลลูกค้าของ "ทุกสาขา" (HQ Privilege)'
                    : `คุณมีสิทธิ์เข้าถึงข้อมูลลูกค้าของสาขา ${user.branch} เท่านั้น`
                  }
                </p>
             </div>
          </div>

          {/* Right Column: Customer List */}
          <div className="lg:col-span-3">
             {loading ? (
               <div className="flex justify-center items-center h-64">
                 <RefreshCw className="animate-spin text-teal-600" size={32} />
               </div>
             ) : filteredCustomers.length === 0 ? (
               <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400 border border-dashed border-gray-300">
                  <UserIcon size={48} className="mx-auto mb-3 opacity-20" />
                  <p>ไม่พบข้อมูลลูกค้า</p>
               </div>
             ) : (
               <div className="space-y-4">
                 {/* Desktop Header (Hidden on Mobile) */}
                 <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-gray-200 text-gray-600 font-semibold text-xs uppercase tracking-wider rounded-t-lg">
                    <div className="col-span-3">ชื่อลูกค้า / เบอร์</div>
                    <div className="col-span-3">ทรีตเม้นท์ล่าสุด</div>
                    <div className="col-span-2 text-center">วันที่</div>
                    <div className="col-span-2 text-center">สถานะ</div>
                    <div className="col-span-2 text-right">จัดการ</div>
                 </div>

                 {/* List */}
                 {filteredCustomers.map((customer) => (
                   <div key={customer.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      {/* Mobile Layout */}
                      <div className="md:hidden flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                           <div>
                             <h3 className="font-bold text-gray-800 text-lg">{customer.name}</h3>
                             <a href={`tel:${customer.phone}`} className="flex items-center gap-1 text-teal-600 mt-1">
                               <Phone size={14} /> {customer.phone}
                             </a>
                           </div>
                           <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                             customer.status === FollowUpStatus.Pending ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                             customer.status === FollowUpStatus.Booked ? 'bg-green-50 text-green-700 border-green-200' :
                             customer.status === FollowUpStatus.NotInterested ? 'bg-red-50 text-red-700 border-red-200' :
                             'bg-blue-50 text-blue-700 border-blue-200'
                           }`}>
                             {customer.status}
                           </span>
                        </div>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                           <div className="flex items-center gap-2 mb-1">
                              <MapPin size={14} className="text-gray-400"/>
                              <span>{customer.branch} - {customer.lastTreatment}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400"/>
                              <span>{customer.serviceDate}</span>
                           </div>
                        </div>
                         {customer.notes && (
                            <div className="text-xs text-gray-500 italic border-l-2 border-gray-300 pl-2">
                              "{customer.notes}"
                            </div>
                         )}
                        <button 
                           onClick={() => openModal(customer)}
                           className="w-full mt-2 bg-teal-600 text-white py-2 rounded-lg font-medium text-sm flex justify-center items-center gap-2 active:bg-teal-700"
                        >
                          <FileText size={16} /> อัพเดทผล
                        </button>
                      </div>

                      {/* Desktop Layout (Grid Row) */}
                      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                         <div className="col-span-3">
                            <div className="font-bold text-gray-800">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                         </div>
                         <div className="col-span-3 text-sm text-gray-700">
                            <span className="text-xs text-gray-400 block">{customer.branch}</span>
                            {customer.lastTreatment}
                         </div>
                         <div className="col-span-2 text-center text-sm text-gray-500">
                            {customer.serviceDate}
                         </div>
                         <div className="col-span-2 text-center">
                            <span 
                              className="inline-block px-2 py-1 rounded-full text-xs font-semibold"
                              style={{ 
                                backgroundColor: `${STATUS_COLORS[customer.status]}20`, 
                                color: STATUS_COLORS[customer.status] 
                              }}
                            >
                             {customer.status}
                            </span>
                         </div>
                         <div className="col-span-2 text-right">
                            <button 
                               onClick={() => openModal(customer)}
                               className="text-teal-600 hover:text-teal-800 hover:bg-teal-50 p-2 rounded-lg transition-colors font-medium text-sm"
                            >
                               Update
                            </button>
                         </div>
                         {customer.notes && (
                           <div className="col-span-12 mt-2 text-xs text-gray-500 pl-4 border-l-2 border-gray-200">
                             Note: {customer.notes}
                           </div>
                         )}
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </main>

      <FollowUpModal 
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFollowUp}
      />
    </div>
  );
}

export default App;