export interface PasswordComplexityConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

export interface PasswordRulesBreakdown {
  minLength: boolean;
  maxLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  rules: PasswordRulesBreakdown;
  score: number; // 0 to 100
  strengthLabel: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  strengthColor: string;
}

export const SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

export const DEFAULT_PASSWORD_CONFIG: PasswordComplexityConfig = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

/**
 * Retrieves the stored password policy from localStorage, with fallback to standard defaults.
 */
export const getStoredPasswordPolicy = (): PasswordComplexityConfig => {
  if (typeof window === 'undefined') return DEFAULT_PASSWORD_CONFIG;

  try {
    const raw = localStorage.getItem('site_security_settings');
    if (!raw) return DEFAULT_PASSWORD_CONFIG;
    const parsed = JSON.parse(raw);

    const minLength = Number(parsed.minPasswordLength ?? parsed.min_password_length);
    const maxLength = Number(parsed.maxPasswordLength ?? parsed.max_password_length);

    return {
      minLength: Number.isFinite(minLength) && minLength > 0 ? minLength : DEFAULT_PASSWORD_CONFIG.minLength,
      maxLength: Number.isFinite(maxLength) && maxLength > 0 ? maxLength : DEFAULT_PASSWORD_CONFIG.maxLength,
      requireUppercase: parsed.requireUppercase !== undefined ? Boolean(parsed.requireUppercase) : DEFAULT_PASSWORD_CONFIG.requireUppercase,
      requireLowercase: parsed.requireLowercase !== undefined ? Boolean(parsed.requireLowercase) : DEFAULT_PASSWORD_CONFIG.requireLowercase,
      requireNumbers: parsed.requireNumbers !== undefined ? Boolean(parsed.requireNumbers) : DEFAULT_PASSWORD_CONFIG.requireNumbers,
      requireSpecialChars: parsed.requireSpecialChars !== undefined ? Boolean(parsed.requireSpecialChars) : DEFAULT_PASSWORD_CONFIG.requireSpecialChars,
    };
  } catch {
    return DEFAULT_PASSWORD_CONFIG;
  }
};

/**
 * Validates a password against standard complexity requirements and calculates strength.
 */
export const validatePassword = (
  password: string,
  config: Partial<PasswordComplexityConfig> = {}
): PasswordValidationResult => {
  const merged: PasswordComplexityConfig = {
    ...DEFAULT_PASSWORD_CONFIG,
    ...config,
  };

  const pwd = typeof password === 'string' ? password : '';
  const errors: string[] = [];

  const rules: PasswordRulesBreakdown = {
    minLength: pwd.length >= merged.minLength,
    maxLength: pwd.length <= merged.maxLength,
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecialChar: SPECIAL_CHARACTERS_REGEX.test(pwd),
  };

  if (!rules.minLength) {
    errors.push(`At least ${merged.minLength} characters required.`);
  }
  if (!rules.maxLength) {
    errors.push(`Cannot exceed ${merged.maxLength} characters.`);
  }
  if (merged.requireUppercase && !rules.hasUppercase) {
    errors.push('At least one uppercase letter (A-Z) required.');
  }
  if (merged.requireLowercase && !rules.hasLowercase) {
    errors.push('At least one lowercase letter (a-z) required.');
  }
  if (merged.requireNumbers && !rules.hasNumber) {
    errors.push('At least one numeric digit (0-9) required.');
  }
  if (merged.requireSpecialChars && !rules.hasSpecialChar) {
    errors.push('At least one special character (!@#$%^&*...) required.');
  }

  // Calculate score & strength
  let score = 0;
  if (pwd.length >= merged.minLength) score += 20;
  if (pwd.length >= merged.minLength + 4) score += 15;
  if (pwd.length >= merged.minLength + 8) score += 10;
  if (rules.hasUppercase) score += 15;
  if (rules.hasLowercase) score += 10;
  if (rules.hasNumber) score += 15;
  if (rules.hasSpecialChar) score += 15;
  score = Math.min(100, Math.max(0, score));

  let strengthLabel: PasswordValidationResult['strengthLabel'] = 'Very Weak';
  let strengthColor = 'bg-rose-500';

  if (score >= 85) {
    strengthLabel = 'Very Strong';
    strengthColor = 'bg-emerald-500';
  } else if (score >= 70) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-600';
  } else if (score >= 50) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
  } else if (score >= 30) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-orange-500';
  }

  return {
    isValid: errors.length === 0,
    errors,
    rules,
    score,
    strengthLabel,
    strengthColor,
  };
};
