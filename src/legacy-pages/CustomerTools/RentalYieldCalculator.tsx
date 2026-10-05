'use client'

import { useState } from 'react';

export default function RentalYieldCalculator() {
  const [value, setValue] = useState(''); const [rent, setRent] = useState(''); const [costs, setCosts] = useState('');
  const annualIncome = Number(rent) * 12 - Number(costs); const yieldValue = Number(value) ? (annualIncome / Number(value)) * 100 : 0;
  return <main className="max-w-xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-brand-navy mb-6">Rental Yield Calculator</h1><div className="space-y-4"><label>Property value<input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="search-input" /></label><label>Monthly rent<input type="number" value={rent} onChange={(e) => setRent(e.target.value)} className="search-input" /></label><label>Annual costs<input type="number" value={costs} onChange={(e) => setCosts(e.target.value)} className="search-input" /></label><p className="text-xl font-semibold text-brand-emerald">Estimated annual rental yield: {yieldValue.toFixed(2)}%</p></div></main>;
}