'use client';

import React from 'react';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';
import {
  validatePassword,
  PasswordComplexityConfig,
} from '@/utils/passwordValidation';

interface PasswordComplexityRequirementsProps {
  password: string;
  config?: Partial<PasswordComplexityConfig>;
  showStrengthBar?: boolean;
  className?: string;
}

export function PasswordComplexityRequirements({
  password,
  config,
  showStrengthBar = true,
  className = '',
}: PasswordComplexityRequirementsProps) {
  const result = validatePassword(password, config);
  const minLength = config?.minLength ?? 8;
  const requireUppercase = config?.requireUppercase !== false;
  const requireLowercase = config?.requireLowercase !== false;
  const requireNumbers = config?.requireNumbers !== false;
  const requireSpecialChars = config?.requireSpecialChars !== false;

  const requirements = [
    {
      id: 'minLength',
      label: `At least ${minLength} characters`,
      met: result.rules.minLength,
      enabled: true,
    },
    {
      id: 'uppercase',
      label: 'One uppercase letter (A-Z)',
      met: result.rules.hasUppercase,
      enabled: requireUppercase,
    },
    {
      id: 'lowercase',
      label: 'One lowercase letter (a-z)',
      met: result.rules.hasLowercase,
      enabled: requireLowercase,
    },
    {
      id: 'number',
      label: 'One number (0-9)',
      met: result.rules.hasNumber,
      enabled: requireNumbers,
    },
    {
      id: 'specialChar',
      label: 'One special symbol (!@#$%^&*)',
      met: result.rules.hasSpecialChar,
      enabled: requireSpecialChars,
    },
  ].filter((item) => item.enabled);

  if (!password && !showStrengthBar) {
    return null;
  }

  return (
    <div className={`mt-2.5 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-xs ${className}`}>
      {showStrengthBar && password.length > 0 && (
        <div className="mb-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600">Password Strength:</span>
            <span
              className={`font-semibold ${
                result.score >= 70
                  ? 'text-emerald-700'
                  : result.score >= 50
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {result.strengthLabel}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full transition-all duration-300 ${result.strengthColor}`}
              style={{ width: `${result.score}%` }}
            />
          </div>
        </div>
      )}

      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
        Standard Complexity Requirements:
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {requirements.map((req) => {
          const isMet = req.met;
          return (
            <li
              key={req.id}
              className={`flex items-center gap-1.5 transition-colors ${
                isMet ? 'text-emerald-700 font-medium' : 'text-slate-500'
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  isMet
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isMet ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
              </span>
              <span>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
