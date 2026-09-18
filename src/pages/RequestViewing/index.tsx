import { FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';

export default function RequestViewing() {
	const [params] = useSearchParams();
	const [form, setForm] = useState({ propertyId: params.get('propertyId') || '', name: '', email: '', phone: '', preferredDate: '', preferredTime: '', message: '' });
	const [message, setMessage] = useState('');
	const submit = async (event: FormEvent) => { event.preventDefault(); try { await api.createViewing(form); setMessage('Your viewing request was sent.'); } catch { setMessage('Unable to send your request.'); } };
	return <main className="max-w-2xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-brand-navy mb-6">Request a Property Viewing</h1><form onSubmit={submit} className="space-y-4">{(['propertyId', 'name', 'email', 'phone', 'preferredDate', 'preferredTime', 'message'] as const).map((field) => <label key={field} className="block text-brand-charcoal capitalize">{field.replace(/([A-Z])/g, ' $1')}<input required={['propertyId', 'name', 'email'].includes(field)} type={field === 'preferredDate' ? 'date' : field === 'email' ? 'email' : field === 'message' ? 'text' : 'text'} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="search-input" /></label>)}<button className="bg-brand-emerald text-brand-white rounded-lg px-6 py-3">Send request</button>{message && <p className="text-brand-emerald">{message}</p>}</form></main>;
}
