'use client'

import { useState } from 'react'
import { TrendingUp, Info } from 'lucide-react'

interface RentalYieldCalculatorProps {
  propertyPrice?: number
  propertyCurrency?: string
}

export default function RentalYieldCalculator({ propertyPrice, propertyCurrency = 'RWF' }: RentalYieldCalculatorProps) {
  const [purchasePrice, setPurchasePrice] = useState(propertyPrice || 0)
  const [monthlyRent, setMonthlyRent] = useState(0)
  const [purchaseCosts, setPurchaseCosts] = useState(5) // percentage of purchase price
  const [annualExpenses, setAnnualExpenses] = useState(0)
  const [showDetails, setShowDetails] = useState(false)

  const calculateYield = () => {
    const totalPurchaseCost = purchasePrice + (purchasePrice * purchaseCosts) / 100
    const annualRent = monthlyRent * 12
    const netAnnualIncome = annualRent - annualExpenses

    const grossYield = (annualRent / purchasePrice) * 100
    const netYield = (netAnnualIncome / totalPurchaseCost) * 100

    const cashFlow = monthlyRent - (annualExpenses / 12)
    const paybackPeriod = totalPurchaseCost / netAnnualIncome

    return {
      grossYield,
      netYield,
      annualRent,
      annualExpenses,
      netAnnualIncome,
      totalPurchaseCost,
      cashFlow,
      paybackPeriod: paybackPeriod > 0 ? paybackPeriod : 0,
    }
  }

  const yieldData = calculateYield()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: propertyCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const getYieldColor = (yieldValue: number) => {
    if (yieldValue >= 8) return 'text-emerald-600'
    if (yieldValue >= 5) return 'text-amber-600'
    return 'text-red-600'
  }

  const getYieldLabel = (yieldValue: number) => {
    if (yieldValue >= 8) return 'Excellent'
    if (yieldValue >= 6) return 'Good'
    if (yieldValue >= 4) return 'Moderate'
    return 'Low'
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Rental Yield Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Purchase Price ({propertyCurrency})
          </label>
          <input
            type="number"
            value={purchasePrice || ''}
            onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Enter purchase price"
          />
        </div>

        {/* Monthly Rent */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Expected Monthly Rent ({propertyCurrency})
          </label>
          <input
            type="number"
            value={monthlyRent || ''}
            onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Enter expected monthly rent"
          />
        </div>

        {/* Purchase Costs */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Purchase Costs: {purchaseCosts}%
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={purchaseCosts}
            onChange={(e) => setPurchaseCosts(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span className="font-medium text-emerald-600">{formatCurrency((purchasePrice * purchaseCosts) / 100)}</span>
            <span>20%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Includes legal fees, taxes, agent fees, etc.
          </p>
        </div>

        {/* Annual Expenses */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Annual Expenses ({propertyCurrency})
          </label>
          <input
            type="number"
            value={annualExpenses || ''}
            onChange={(e) => setAnnualExpenses(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Insurance, maintenance, property tax, etc."
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-sm text-slate-600 mb-1">Gross Yield</p>
          <p className={`text-2xl font-bold ${getYieldColor(yieldData.grossYield)}`}>
            {formatPercentage(yieldData.grossYield)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{getYieldLabel(yieldData.grossYield)}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-slate-600 mb-1">Net Yield</p>
          <p className={`text-2xl font-bold ${getYieldColor(yieldData.netYield)}`}>
            {formatPercentage(yieldData.netYield)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{getYieldLabel(yieldData.netYield)}</p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
      >
        <Info className="w-4 h-4" />
        {showDetails ? 'Hide Details' : 'View Details'}
      </button>

      {showDetails && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Annual Rental Income</span>
            <span className="font-medium text-slate-900">{formatCurrency(yieldData.annualRent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Annual Expenses</span>
            <span className="font-medium text-slate-900">{formatCurrency(yieldData.annualExpenses)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Net Annual Income</span>
            <span className="font-medium text-emerald-600">{formatCurrency(yieldData.netAnnualIncome)}</span>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-slate-200">
            <span className="text-slate-700 font-medium">Total Investment</span>
            <span className="font-bold text-slate-900">{formatCurrency(yieldData.totalPurchaseCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Monthly Cash Flow</span>
            <span className={`font-medium ${yieldData.cashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(yieldData.cashFlow)}
            </span>
          </div>
          {yieldData.paybackPeriod > 0 && yieldData.paybackPeriod < 100 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Payback Period</span>
              <span className="font-medium text-slate-900">
                {yieldData.paybackPeriod.toFixed(1)} years
              </span>
            </div>
          )}
        </div>
      )}

      {/* Yield Guide */}
      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm font-medium text-amber-800 mb-2">Rental Yield Guide</p>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• 8%+ : Excellent investment opportunity</li>
          <li>• 6-8% : Good investment</li>
          <li>• 4-6% : Moderate returns</li>
          <li>• Below 4% : Low returns, consider alternatives</li>
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-slate-500 text-center">
        * This is an estimate. Actual rental yields may vary based on vacancy rates,
        maintenance costs, market conditions, and other factors. Consult with a real estate
        professional for accurate analysis.
      </p>
    </div>
  )
}
