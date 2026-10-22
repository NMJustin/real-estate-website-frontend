'use client'

import { useState } from 'react'
import { Calculator, Info } from 'lucide-react'

interface MortgageCalculatorProps {
  propertyPrice?: number
  propertyCurrency?: string
}

export default function MortgageCalculator({ propertyPrice, propertyCurrency = 'RWF' }: MortgageCalculatorProps) {
  const [principal, setPrincipal] = useState(propertyPrice || 0)
  const [downPayment, setDownPayment] = useState(20) // percentage
  const [interestRate, setInterestRate] = useState(15) // annual percentage
  const [loanTerm, setLoanTerm] = useState(20) // years
  const [showDetails, setShowDetails] = useState(false)

  const calculateMortgage = () => {
    const downPaymentAmount = (principal * downPayment) / 100
    const loanAmount = principal - downPaymentAmount
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    if (monthlyRate === 0) {
      return {
        monthlyPayment: loanAmount / numberOfPayments,
        totalPayment: loanAmount,
        totalInterest: 0,
        downPaymentAmount,
        loanAmount,
      }
    }

    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - loanAmount

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      downPaymentAmount,
      loanAmount,
    }
  }

  const mortgage = calculateMortgage()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: propertyCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Calculator className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Mortgage Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Property Price */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Property Price ({propertyCurrency})
          </label>
          <input
            type="number"
            value={principal || ''}
            onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Enter property price"
          />
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Down Payment: {downPayment}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span className="font-medium text-emerald-600">{formatCurrency(mortgage.downPaymentAmount)}</span>
            <span>100%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Annual Interest Rate: {interestRate}%
          </label>
          <input
            type="range"
            min="1"
            max="30"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1%</span>
            <span>30%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Loan Term: {loanTerm} years
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-1">Estimated Monthly Payment</p>
          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(mortgage.monthlyPayment)}</p>
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
            <span className="text-slate-600">Loan Amount</span>
            <span className="font-medium text-slate-900">{formatCurrency(mortgage.loanAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Down Payment</span>
            <span className="font-medium text-slate-900">{formatCurrency(mortgage.downPaymentAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total Interest</span>
            <span className="font-medium text-slate-900">{formatCurrency(mortgage.totalInterest)}</span>
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-slate-200">
            <span className="text-slate-700 font-medium">Total Payment</span>
            <span className="font-bold text-emerald-600">{formatCurrency(mortgage.totalPayment)}</span>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-slate-500 text-center">
        * This is an estimate. Actual mortgage terms may vary based on your credit score,
        income, and lender requirements. Consult with a financial advisor for accurate calculations.
      </p>
    </div>
  )
}
