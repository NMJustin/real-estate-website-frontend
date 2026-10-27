'use client'

import { useState } from 'react';

export default function MortgageCalculatorContent() {
  const [amount, setAmount] = useState(''); const [rate, setRate] = useState(''); const [years, setYears] = useState('');
  const months = Number(years) * 12; const monthlyRate = Number(rate) / 100 / 12; const payment = months && monthlyRate ? Number(amount) * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1) : Number(amount) / (months || 1);
  return <main className="max-w-xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-brand-navy mb-6">Mortgage Affordability Calculator</h1><div className="space-y-4"><label>Loan amount<input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="search-input" /></label><label>Annual interest rate (%)<input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="search-input" /></label><label>Term (years)<input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="search-input" /></label><p className="text-xl font-semibold text-brand-emerald">Estimated monthly payment: {payment ? payment.toFixed(2) : '0.00'}</p></div></main>;
}
