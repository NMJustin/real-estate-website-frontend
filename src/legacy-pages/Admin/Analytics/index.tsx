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
  totalPageViews: number;
  uniquePageViews: number;
  totalPropertyViews: number;
  totalInquiries: number;
  totalViewings: number;
  totalListings: number;
  totalContacts: number;
  totalSearches: number;
  totalClicks: number;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  comparison: {
    pageViewsChange: number;
    propertyViewsChange: number;
    clicksChange: number;
    inquiriesChange: number;
    viewingsChange: number;
  };
  clickBreakdown: {
    CTA: number;
    PHONE: number;
    EMAIL: number;
    WHATSAPP: number;
    LINK: number;
    BUTTON: number;
  };
  pageViewTrend: { date: string; count: number }[];
  popularProperties: { propertyId: string; title: string; thumbnailUrl: string | null; viewCount: number }[];
  trafficSources: { source: string; count: number }[];
  deviceBreakdown: Record<string, number>;
  conversionFunnel: {
    stage: string;
    count: number;
    rate: number;
    rateLabel?: string;
  }[];
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

      // Fetch all analytics data in parallel
      const [summary, sources, devices, funnel] = await Promise.all([
        adminApi.getAnalyticsSummary(period),
        adminApi.getAnalyticsSources(period),
        adminApi.getAnalyticsDevices(period),
        adminApi.getAnalyticsFunnel(period),
      ] as const);

      setData({
        summary: (summary as any).data.summary,
        comparison: (summary as any).data.comparison,
        clickBreakdown: (summary as any).data.clickBreakdown,
        pageViewTrend: (summary as any).data.pageViewTrend,
        popularProperties: (summary as any).data.popularProperties,
        trafficSources: (sources as any).data.sources,
        deviceBreakdown: (devices as any).data.breakdown,
        conversionFunnel: (funnel as any).data.funnel,
      });
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
    change,
  }: {
    label: string;
    value: number | string;
    icon: typeof TrendingUp;
    color: string;
  change?: number | null;
  }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {change !== undefined && change !== null && (
            <p className={`mt-1 text-xs ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}% vs previous period
            </p>
          )}
          {change === null && <p className="mt-1 text-xs text-slate-400">No prior-period baseline</p>}
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

      {/* Info Banner - only show if no data */}
      {data && data.summary.totalPageViews === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <p className="font-medium text-amber-900">No analytics data yet</p>
              <p className="mt-1 text-sm text-amber-700">
                Analytics tracking is active, but no data has been collected yet. 
                Visit the public website to generate page views and interactions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Page Views"
          value={data?.summary.totalPageViews || 0}
          icon={Users}
          color="bg-blue-50 text-blue-600"
          change={data?.comparison.pageViewsChange}
        />
        <StatCard
          label="Unique Visitors"
          value={data?.summary.uniquePageViews || 0}
          icon={Users}
          color="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          label="Property Views"
          value={data?.summary.totalPropertyViews || 0}
          icon={Eye}
          color="bg-emerald-50 text-emerald-600"
          change={data?.comparison.propertyViewsChange}
        />
        <StatCard
          label="Inquiries"
          value={data?.summary.totalInquiries || 0}
          icon={MousePointerClick}
          color="bg-purple-50 text-purple-600"
          change={data?.comparison.inquiriesChange}
        />
        <StatCard
          label="Viewing Requests"
          value={data?.summary.totalViewings || 0}
          icon={Calendar}
          color="bg-amber-50 text-amber-600"
          change={data?.comparison.viewingsChange}
        />
        <StatCard
          label="Property Searches"
          value={data?.summary.totalSearches || 0}
          icon={BarChart3}
          color="bg-indigo-50 text-indigo-600"
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <div><h2 className="text-lg font-semibold text-slate-900">Page-view trend</h2><p className="mt-1 text-sm text-slate-500">Public page views by day for the selected period.</p></div>
          <span className="text-sm font-semibold text-emerald-700">{data?.summary.totalPageViews.toLocaleString() || 0} total</span>
        </div>
        {data?.pageViewTrend.length ? (() => { const max = Math.max(...data.pageViewTrend.map((point) => point.count), 1); return <div className="mt-6 flex h-40 items-end gap-1" aria-label="Page-view trend chart">{data.pageViewTrend.map((point) => <div key={point.date} className="group relative flex h-full flex-1 items-end"><div className="w-full rounded-t bg-emerald-500/85 transition-colors group-hover:bg-emerald-600" style={{ height: `${Math.max((point.count / max) * 100, 3)}%` }} title={`${point.date}: ${point.count} views`} /><span className="sr-only">{point.date}: {point.count} page views</span></div>)}</div>; })() : <div className="mt-6 rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No public page views in this period.</div>}
      </section>

      {/* Conversion Funnel */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Conversion Funnel</h2>
        <p className="mt-1 text-sm text-slate-500">Track user journey from visitors to conversions.</p>
        <div className="mt-6 space-y-4">
          {data?.conversionFunnel.map((step, index) => {
            const maxValue = Math.max(...data.conversionFunnel.map(s => s.count), 1);
            const width = maxValue > 0 ? (step.count / maxValue) * 100 : 0;
            const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500'];
            return (
              <div key={step.stage}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{step.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{step.count.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">{step.rate.toFixed(1)}% {step.rateLabel || ''}</span>
                  </div>
                </div>
                <div className="mt-2 h-8 overflow-hidden rounded-lg bg-slate-100">
                  <div
                    className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          }) || (
            <div className="rounded-lg bg-slate-50 px-4 py-8 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-medium text-slate-600">No funnel data yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Traffic Sources */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Traffic Sources</h2>
        <p className="mt-1 text-sm text-slate-500">Where your visitors are coming from.</p>
        <div className="mt-6">
          {data?.trafficSources && data.trafficSources.length > 0 ? (
            <div className="space-y-3">
              {data.trafficSources.map((source, index) => {
                const maxCount = Math.max(...data.trafficSources.map(s => s.count), 1);
                const width = (source.count / maxCount) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{source.source}</span>
                      <span className="font-semibold text-slate-900">{source.count.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 px-4 py-8 text-center">
              <MousePointerClick className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-medium text-slate-600">No traffic data yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Traffic source data will appear once visitors arrive from different sources.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Device Breakdown */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Device Breakdown</h2>
        <p className="mt-1 text-sm text-slate-500">Visitor devices and platforms.</p>
        <div className="mt-6">
          {data?.deviceBreakdown && Object.keys(data.deviceBreakdown).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(data.deviceBreakdown).map(([device, count], index) => {
                const maxCount = Math.max(...Object.values(data.deviceBreakdown), 1);
                const width = (count / maxCount) * 100;
                const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500'];
                return (
                  <div key={device}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 capitalize">{device}</span>
                      <span className="font-semibold text-slate-900">{count.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full ${colors[index % colors.length]} transition-all duration-500`}
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 px-4 py-8 text-center">
              <Users className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-medium text-slate-600">No device data yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Device breakdown data will appear once visitors access the site.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Properties */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Popular Properties</h2>
        <p className="mt-1 text-sm text-slate-500">Most viewed properties this period.</p>
        <div className="mt-6">
          {data?.popularProperties && data.popularProperties.length > 0 ? (
            <div className="space-y-3">
              {data.popularProperties.map((property, index) => (
                <div
                  key={property.propertyId}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                      {index + 1}
                    </span>
                    {property.thumbnailUrl ? <img src={property.thumbnailUrl} alt="" className="h-10 w-12 rounded-md object-cover" /> : <div className="h-10 w-12 rounded-md bg-slate-200" aria-hidden="true" />}
                    <span className="truncate font-medium text-slate-700">{property.title}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{property.viewCount.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 px-4 py-8 text-center">
              <Eye className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-medium text-slate-600">No property data yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Popular properties will appear once visitors view property details.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Click Breakdown */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Click Events</h2>
        <p className="mt-1 text-sm text-slate-500">User interactions and engagement.</p>
        <div className="mt-6">
          {data?.clickBreakdown && Object.values(data.clickBreakdown).some(v => v > 0) ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Object.entries(data.clickBreakdown).map(([type, count]) => (
                <div
                  key={type}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-center"
                >
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{type}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 px-4 py-8 text-center">
              <MousePointerClick className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-medium text-slate-600">No click data yet</p>
              <p className="mt-1 text-sm text-slate-400">
                Click events will appear once visitors interact with buttons and links.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
