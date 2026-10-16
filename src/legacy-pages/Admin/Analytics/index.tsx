'use client'

import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  AlertCircle,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../../../services/api';

interface AnalyticsSummary {
  totalVisitors: number;
  totalPropertyViews: number;
  totalInquiries: number;
  totalViewings: number;
  totalListings: number;
  totalValuations: number;
  conversionRate: number;
  averageSessionDuration: number;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  trafficSources: { source: string; count: number; percentage: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  conversionFunnel: {
    visitors: number;
    propertyViews: number;
    inquiries: number;
    viewings: number;
    listings: number;
  };
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30days');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      // Note: Backend analytics endpoints exist but need to be added to adminApi
      // For now, we'll show placeholder data
      const mockData: AnalyticsData = {
        summary: {
          totalVisitors: 0,
          totalPropertyViews: 0,
          totalInquiries: 0,
          totalViewings: 0,
          totalListings: 0,
          totalValuations: 0,
          conversionRate: 0,
          averageSessionDuration: 0,
        },
        trafficSources: [],
        deviceBreakdown: [],
        conversionFunnel: {
          visitors: 0,
          propertyViews: 0,
          inquiries: 0,
          viewings: 0,
          listings: 0,
        },
      };
      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const StatCard = ({
    label,
    value,
    icon: Icon,
    color,
  }: {
    label: string;
    value: number | string;
    icon: typeof TrendingUp;
    color: string;
  }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
          <div>
            <p className="font-semibold text-rose-900">Analytics unavailable</p>
            <p className="mt-1 text-sm text-rose-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Track visitor engagement, property views, and conversion metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
          <div className="flex-1">
            <p className="font-medium text-amber-900">Analytics feature not yet fully implemented</p>
            <p className="mt-1 text-sm text-amber-700">
              The backend analytics infrastructure exists, but the frontend integration is pending. 
              Once event tracking is implemented in the public website, this dashboard will display real-time metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Visitors"
          value={data?.summary.totalVisitors || 0}
          icon={Users}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Property Views"
          value={data?.summary.totalPropertyViews || 0}
          icon={Eye}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Inquiries"
          value={data?.summary.totalInquiries || 0}
          icon={MousePointerClick}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Conversion Rate"
          value={`${data?.summary.conversionRate || 0}%`}
          icon={TrendingUp}
          color="bg-amber-50 text-amber-600"
        />
      </section>

      {/* Conversion Funnel */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Conversion Funnel</h2>
        <p className="mt-1 text-sm text-slate-500">Track user journey from visitors to conversions.</p>
        <div className="mt-6 space-y-4">
          {[
            { label: 'Visitors', value: data?.conversionFunnel.visitors || 0, color: 'bg-blue-500' },
            { label: 'Property Views', value: data?.conversionFunnel.propertyViews || 0, color: 'bg-emerald-500' },
            { label: 'Inquiries', value: data?.conversionFunnel.inquiries || 0, color: 'bg-purple-500' },
            { label: 'Viewing Requests', value: data?.conversionFunnel.viewings || 0, color: 'bg-amber-500' },
            { label: 'Listing Requests', value: data?.conversionFunnel.listings || 0, color: 'bg-rose-500' },
          ].map((step, index) => {
            const maxValue = Math.max(...(data ? [
              data.conversionFunnel.visitors,
              data.conversionFunnel.propertyViews,
              data.conversionFunnel.inquiries,
              data.conversionFunnel.viewings,
              data.conversionFunnel.listings,
            ] : [1]));
            const width = maxValue > 0 ? (step.value / maxValue) * 100 : 0;
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{step.label}</span>
                  <span className="font-semibold text-slate-900">{step.value.toLocaleString()}</span>
                </div>
                <div className="mt-2 h-8 overflow-hidden rounded-lg bg-slate-100">
                  <div
                    className={`h-full ${step.color} transition-all duration-500`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Empty State for Traffic Sources */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Traffic Sources</h2>
        <p className="mt-1 text-sm text-slate-500">Where your visitors are coming from.</p>
        <div className="mt-6 rounded-lg bg-slate-50 px-4 py-8 text-center">
          <MousePointerClick className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-medium text-slate-600">No traffic data yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Traffic source data will appear once tracking is implemented.
          </p>
        </div>
      </section>

      {/* Empty State for Device Breakdown */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Device Breakdown</h2>
        <p className="mt-1 text-sm text-slate-500">Visitor devices and platforms.</p>
        <div className="mt-6 rounded-lg bg-slate-50 px-4 py-8 text-center">
          <Users className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 font-medium text-slate-600">No device data yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Device breakdown data will appear once tracking is implemented.
          </p>
        </div>
      </section>
    </div>
  );
}
