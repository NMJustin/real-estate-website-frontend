import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function PropertyValuationRequest() {
	const [form, setForm] = useState({ 
		name: '', 
		email: '', 
		phone: '', 
		propertyType: 'RESIDENTIAL', 
		location: '', 
		propertySize: '', 
		purpose: '', 
		additionalInfo: '' 
	});
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	
	const submit = async (event: FormEvent) => { 
		event.preventDefault(); 
		setError('');
		try { 
			await api.createValuation(form); 
			setMessage('Your valuation request was sent. Our team will contact you shortly.'); 
		} catch { 
			setError('Unable to send your request. Please try again.'); 
		} 
	};
	
	return (
		<main className="bg-slate-50 py-12 sm:py-16">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link to="/services/property-valuation" className="text-emerald-600 hover:underline text-sm font-medium">
						← Back to Property Valuation
					</Link>
				</div>
				
				<h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Request a Property Valuation</h1>
				
				<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
					<form onSubmit={submit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
								<input 
									required
									type="text" 
									value={form.name} 
									onChange={(event) => setForm({ ...form, name: event.target.value })} 
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
								<input 
									required
									type="tel" 
									value={form.phone} 
									onChange={(event) => setForm({ ...form, phone: event.target.value })} 
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
								<input 
									required
									type="email" 
									value={form.email} 
									onChange={(event) => setForm({ ...form, email: event.target.value })} 
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Property Type *</label>
								<select 
									required
									value={form.propertyType} 
									onChange={(event) => setForm({ ...form, propertyType: event.target.value })} 
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
								>
									<option value="RESIDENTIAL">Residential</option>
									<option value="COMMERCIAL">Commercial</option>
									<option value="LAND">Land</option>
									<option value="APARTMENTS">Apartments</option>
									<option value="HOUSES">Houses</option>
									<option value="OFFICES">Offices</option>
									<option value="WAREHOUSES">Warehouses</option>
								</select>
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-slate-700 mb-1">Property Location *</label>
								<input 
									required
									type="text" 
									value={form.location} 
									onChange={(event) => setForm({ ...form, location: event.target.value })} 
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
									placeholder="e.g., Kigali, Gasabo District"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Approximate Property Size *</label>
								<input 
									required
									type="text" 
									value={form.propertySize} 
									onChange={(event) => setForm({ ...form, propertySize: event.target.value })} 
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
									placeholder="e.g., 150 sqm"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Purpose of Valuation *</label>
								<select 
									required
									value={form.purpose} 
									onChange={(event) => setForm({ ...form, purpose: event.target.value })} 
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
								>
									<option value="">Select purpose</option>
									<option value="sale">For Sale</option>
									<option value="purchase">For Purchase</option>
									<option value="refinancing">Refinancing</option>
									<option value="investment">Investment</option>
									<option value="insurance">Insurance</option>
									<option value="other">Other</option>
								</select>
							</div>
							<div className="md:col-span-2">
								<label className="block text-sm font-medium text-slate-700 mb-1">Additional Information</label>
								<textarea 
									rows={4}
									value={form.additionalInfo} 
									onChange={(event) => setForm({ ...form, additionalInfo: event.target.value })} 
									className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
									placeholder="Any additional details about your property..."
								/>
							</div>
						</div>
						
						<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
							<p className="text-amber-800 text-sm">
								<strong>Important Notice:</strong> This online request does not itself constitute an official property valuation. 
								Our team will contact you to arrange a professional valuation assessment.
							</p>
						</div>
						
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
								<p className="text-red-800 text-sm">{error}</p>
							</div>
						)}
						
						{message && (
							<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
								<p className="text-emerald-800 text-sm">{message}</p>
							</div>
						)}
						
						<button 
							type="submit" 
							className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
						>
							Submit Valuation Request
						</button>
					</form>
				</div>
			</div>
		</main>
	);
}
