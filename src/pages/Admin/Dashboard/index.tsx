interface RecentProperty {
  id: string;
  title: string;
  propertyType: string;
  transactionType: string;
  price: string | null;
  currency: string | null;
  status: string;
  publicationStatus: string;
  createdAt: string;
  agent: { name: string } | null;
}

interface RecentInquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
  property: { title: string; slug: string } | null;
}

interface DashboardData {
  stats: DashboardStats;
  recentProperties: RecentProperty[];
  recentInquiries: RecentInquiry[];
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    AVAILABLE: 'bg-emerald-100 text-emerald-700',
    SOLD: 'bg-blue-100 text-blue-700',
    RENTED: 'bg-purple-100 text-purple-700',
    ARCHIVED: 'bg-gray-100 text-gray-500',
    PUBLISHED: 'bg-emerald-100 text-emerald-700',
    DRAFT: 'bg-yellow-100 text-yellow-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const formatPrice = (price: string | null, currency: string | null) => {
  if (!price) return '—';
  const num = parseFloat(price);
  return `${currency || 'KES'} ${num.toLocaleString()}`;
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res: any) => setData(res.data))
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const s = data!.stats;

  const statCards = [
    { label: 'Total Properties', value: s.totalProperties, sub: `${s.publishedProperties} published`, icon: Home, color: 'bg-blue-500', light: 'bg-blue-50' },
    { label: 'Active Agents', value: s.totalAgents, sub: 'Team members', icon: Users, color: 'bg-emerald-500', light: 'bg-emerald-50' },
    { label: 'Pending Inquiries', value: s.pendingInquiries, sub: `${s.totalInquiries} total`, icon: MessageSquare, color: 'bg-amber-500', light: 'bg-amber-50' },
    { label: 'Pending Viewings', value: s.pendingViewings, sub: `${s.totalViewings} total`, icon: Calendar, color: 'bg-purple-500', light: 'bg-purple-50' },
    { label: 'Pending Valuations', value: s.pendingValuations, sub: 'Awaiting review', icon: TrendingUp, color: 'bg-rose-500', light: 'bg-rose-50' },
    { label: 'Total Users', value: s.totalUsers, sub: 'Registered accounts', icon: CheckCircle, color: 'bg-teal-500', light: 'bg-teal-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <Link
          to="/admin/properties/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{card.value}</p>
                <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
              </div>
              <div className={`w-11 h-11 ${card.light} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 text-${card.color.split('-')[1]}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Properties</h2>
            <Link to="/admin/properties" className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {data!.recentProperties.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No properties yet.</p>
            ) : (
              data!.recentProperties.map((p) => (
                <div key={p.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50/50 transition">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Home className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {p.propertyType} · {p.transactionType} · {formatPrice(p.price, p.currency)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">{statusBadge(p.status)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {data!.recentInquiries.length === 0 ? (
              <p className="px-5 py-8 text-center text-slate-400 text-sm">No inquiries yet.</p>
            ) : (
              data!.recentInquiries.map((inq) => (
                <div key={inq.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50/50 transition">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{inq.name}</p>
                    <p className="text-xs text-slate-500 truncate">{inq.property?.title ?? 'General inquiry'}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">{statusBadge(inq.status)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}