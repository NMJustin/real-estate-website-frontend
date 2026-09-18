import { FormEvent, useState } from 'react';
import api from '../../services/api';

export default function PropertyValuationRequest() {
	const [form, setForm] = useState({ name: '', email: '', phone: '', propertyType: 'RESIDENTIAL', location: '', propertySize: '', bedrooms: '', bathrooms: '', description: '' });
	const [message, setMessage] = useState('');
	const submit = async (event: FormEvent) => { event.preventDefault(); try { await api.createValuation(form); setMessage('Your valuation request was sent.'); } catch { setMessage('Unable to send your request.'); } };
	return <main className="max-w-3xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-brand-navy mb-6">Request a Property Valuation</h1><form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">{Object.keys(form).map((field) => <label key={field} className="text-brand-charcoal capitalize">{field.replace(/([A-Z])/g, ' $1')}<input required={['name', 'email', 'location'].includes(field)} type={field === 'email' ? 'email' : 'text'} value={form[field as keyof typeof form]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="search-input" /></label>)}<button className="md:col-span-2 bg-brand-emerald text-brand-white rounded-lg px-6 py-3">Request valuation</button>{message && <p className="md:col-span-2 text-brand-emerald">{message}</p>}</form></main>;
}
