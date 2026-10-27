'use client'

import { FormEvent, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Save, X } from 'lucide-react';
import { adminApi } from '@/services/api';
import { rwandaDistricts, getSectors } from '@/data/rwandaDistricts';

type PropertyRecord = Record<string, any>;
type MediaItem = { url: string; mediaType: 'IMAGE' | 'VIDEO' };
const initialForm: PropertyRecord = { title: '', description: '', categoryId: '', agentId: '', propertyManagerId: '', developmentId: '', propertyType: 'RESIDENTIAL', transactionType: 'SALE', price: '', currency: 'RWF', location: '', district: '', sector: '', address: '', latitude: '', longitude: '', bedrooms: '', bathrooms: '', size: '', sizeUnit: 'sqm', furnishingStatus: '', status: 'AVAILABLE', publicationStatus: 'DRAFT', isFeatured: false, isNewDevelopment: false, images: [] };

export default function PropertyForm({ propertyId }: { propertyId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<PropertyRecord>(initialForm);
  const [categories, setCategories] = useState<PropertyRecord[]>([]);
  const [agents, setAgents] = useState<PropertyRecord[]>([]);
  const [propertyManagers, setPropertyManagers] = useState<PropertyRecord[]>([]);
  const [developments, setDevelopments] = useState<PropertyRecord[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(!!propertyId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const editing = Boolean(propertyId);

  useEffect(() => {
    Promise.all([
      adminApi.getCategories(),
      adminApi.getAgents(),
      adminApi.getAssignablePropertyManagers(),
      adminApi.getDevelopments(),
      propertyId ? adminApi.getProperty(propertyId) : Promise.resolve(null)
    ])
      .then(([categoryRes, agentRes, propertyManagersRes, developmentsRes, propertyRes]: any[]) => {
        setCategories(categoryRes.data || []);
        setAgents(agentRes.data || []);
        setPropertyManagers(propertyManagersRes.data || []);
        setDevelopments(developmentsRes.data || []);
        if (propertyRes?.data) {
          const p = propertyRes.data;
          setForm({
            ...initialForm,
            ...p,
            description: p.description ?? '',
            categoryId: p.categoryId || '',
            agentId: p.agentId || '',
            propertyManagerId: p.propertyManagerId || '',
            developmentId: p.developmentId || '',
            price: p.price?.toString() || '',
            size: p.size?.toString() || ''
          });
          setMedia((p.propertyImages || []).map((image: PropertyRecord) => ({
            url: image.imageUrl,
            mediaType: image.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE'
          })));
          if (p.district) {
            setAvailableSectors(getSectors(p.district));
          }
        }
      })
      .catch((err) => setError(err.message || 'Unable to load property form.'))
      .finally(() => setLoading(false));
  }, [propertyId]);

  const update = (name: string, value: unknown) => {
    setForm((current: PropertyRecord) => ({ ...current, [name]: value }));
    if (name === 'district') {
      setAvailableSectors(getSectors(value as string));
      setForm((current) => ({ ...current, sector: '' }));
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = { ...form, images: media };
      if (editing) {
        await adminApi.updateAdminProperty(propertyId!, data);
      } else {
        await adminApi.createAdminProperty(data);
      }
      router.push('/admin/properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save property.');
    } finally {
      setSaving(false);
    }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }
    console.log('Files selected:', files.length);
    const selected = Array.from(files);
    if (selected.some((file) => !/^image\/(jpeg|png|webp|gif)$|^video\/(mp4|webm|quicktime)$/.test(file.type) || file.size > 100 * 1024 * 1024)) {
      return setError('Use JPG, PNG, WebP, GIF, MP4, WebM, or MOV files up to 100 MB.');
    }
    try {
      setUploading(true);
      setError('');
      console.log('Starting upload for', selected.length, 'files');
      const results = await Promise.all(selected.map((file) => adminApi.uploadPropertyMedia(file)));
      console.log('Upload successful:', results);
      setMedia((items) => [...items, ...results.map((result) => result.data)]);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Unable to upload media.');
    } finally {
      setUploading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  const removeMedia = (index: number) => setMedia((items) => items.filter((_, i) => i !== index));
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); const files = e.dataTransfer.files; if (files.length > 0) uploadFiles(files); };

  if (loading) return <div className="py-16 text-center text-slate-500">Loading property...</div>;

  const input = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';
  const field = (label: string, name: string, type = 'text', required = false) => (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input className={input} type={type} required={required} value={form[name] ?? ''} onChange={(e) => update(name, e.target.value)} />
    </label>
  );
  const select = (label: string, name: string, options: [string, string][]) => (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select className={input} value={form[name] ?? ''} onChange={(e) => update(name, e.target.value)}>
        {options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
      </select>
    </label>
  );

  const districtOptions = Object.values(rwandaDistricts).flatMap(provinceDistricts =>
    Object.keys(provinceDistricts).map(district => [district, district] as [string, string])
  ).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/properties" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600">
            <ArrowLeft className="h-4 w-4" />Back to properties
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{editing ? 'Edit Property' : 'Add Property'}</h1>
        </div>
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
          <Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save Property'}
        </button>
      </div>
      {error && <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="h-5 w-5 shrink-0" />{error}</div>}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Listing details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {field('Title', 'title', 'text', true)}
          {select('Property type', 'propertyType', [['RESIDENTIAL','Residential'],['COMMERCIAL','Commercial'],['APARTMENTS','Apartments'],['HOUSES','Houses'],['VILLA','Villa'],['LAND','Land & plots'],['OFFICES','Offices'],['WAREHOUSES','Warehouses'],['NEW_DEVELOPMENTS','New Developments']])}
          {select('Transaction type', 'transactionType', [['SALE','For Sale'],['RENT','For Rent'],['LEASE','For Lease']])}
          <label className="block text-sm font-medium text-slate-700">
            Category<span className="text-xs text-slate-500 ml-1">(Optional - e.g., Luxury, Budget)</span>
            <select className={input} value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
              <option value="">Uncategorised</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700 md:col-span-2">
            Description
            <textarea className={input} rows={5} value={form.description} onChange={(e) => update('description', e.target.value)} />
          </label>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Price and location</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {field('Price', 'price', 'number')}
          {select('Currency', 'currency', [['RWF', 'Rwandan franc (RWF)']])}
          {field('Location', 'location')}
          {select('District', 'district', districtOptions)}
          {select('Sector', 'sector', availableSectors.length > 0 ? availableSectors.map(s => [s, s] as [string, string]) : [['', 'Select district first']])}
          {field('Address', 'address')}
          {field('Latitude', 'latitude', 'number')}
          {field('Longitude', 'longitude', 'number')}
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Property details</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {field('Bedrooms', 'bedrooms', 'number')}
          {field('Bathrooms', 'bathrooms', 'number')}
          {field('Size', 'size', 'number')}
          {select('Size unit', 'sizeUnit', [['sqm','Square metres'],['acres','Acres'],['hectares','Hectares']])}
          {select('Furnishing', 'furnishingStatus', [['','Not specified'],['FURNISHED','Furnished'],['SEMI_FURNISHED','Semi-furnished'],['UNFURNISHED','Unfurnished']])}
          <label className="block text-sm font-medium text-slate-700">
            Development<span className="text-xs text-slate-500 ml-1">(Optional)</span>
            <select className={input} value={form.developmentId} onChange={(e) => update('developmentId', e.target.value)}>
              <option value="">None</option>
              {developments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Assigned agent
            <select className={input} value={form.agentId} onChange={(e) => update('agentId', e.target.value)}>
              <option value="">Unassigned</option>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Property manager
            <select className={input} value={form.propertyManagerId} onChange={(e) => update('propertyManagerId', e.target.value)}>
              <option value="">Unassigned</option>
              {propertyManagers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name || manager.email} {manager.role?.name ? `(${manager.role.name})` : ''}</option>)}
            </select>
          </label>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Publishing</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {select('Availability', 'status', [['AVAILABLE','Available'],['RESERVED','Reserved'],['SOLD','Sold'],['RENTED','Rented'],['LEASED','Leased'],['ARCHIVED','Archived']])}
          {select('Publication status', 'publicationStatus', [['DRAFT','Draft'],['PUBLISHED','Published'],['ARCHIVED','Archived']])}
          <div className="flex flex-wrap items-end gap-5 pb-2">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} />Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.isNewDevelopment} onChange={(e) => update('isNewDevelopment', e.target.checked)} />New development
            </label>
          </div>
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Property Media</h2>
        <div className="mt-4">
          <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-emerald-400'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="text-sm font-medium text-slate-700 mb-2">Drag and drop files here</p>
              <p className="text-xs text-slate-500 mb-4">or click to browse</p>
              <input type="file" multiple accept="image/*,video/*" onChange={(e) => uploadFiles(e.target.files)} className="hidden" disabled={uploading} ref={fileInputRef} />
              <button type="button" onClick={handleFileButtonClick} disabled={uploading} className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">Select Files</button>
              <p className="text-xs text-slate-400 mt-3">JPG, PNG, WebP, GIF, MP4, WebM, MOV up to 100MB</p>
            </div>
          </div>
          {uploading && <div className="mt-3 text-sm text-slate-500 flex items-center gap-2"><div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>Uploading...</div>}
          {media.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {media.map((item, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                    {item.mediaType === 'VIDEO' ? (
                      <video src={item.url} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={item.url} alt="Property media" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <button type="button" onClick={() => removeMedia(index)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <div className="flex justify-end gap-3">
        <Link href="/admin/properties" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</Link>
        <button disabled={saving} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update Property' : 'Create Property'}</button>
      </div>
    </form>
  );
}
