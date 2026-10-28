import { validatePassword, DEFAULT_PASSWORD_CONFIG } from '../passwordValidation';

describe('Frontend Password Validation Utility', () => {
  it('should validate standard strong passwords correctly', () => {
    const res = validatePassword('Rwanda@2026!');
    expect(res.isValid).toBe(true);
    expect(res.errors).toHaveLength(0);
    expect(res.rules.hasUppercase).toBe(true);
    expect(res.rules.hasLowercase).toBe(true);
    expect(res.rules.hasNumber).toBe(true);
    expect(res.rules.hasSpecialChar).toBe(true);
    expect(res.rules.minLength).toBe(true);
    expect(res.score).toBeGreaterThanOrEqual(70);
  });

  it('should flag missing uppercase', () => {
    const res = validatePassword('rwanda@2026');
    expect(res.isValid).toBe(false);
    expect(res.rules.hasUppercase).toBe(false);
    expect(res.errors).toContain('At least one uppercase letter (A-Z) required.');
  });

  it('should flag missing numbers', () => {
    const res = validatePassword('Rwanda@Security');
    expect(res.isValid).toBe(false);
    expect(res.rules.hasNumber).toBe(false);
    expect(res.errors).toContain('At least one numeric digit (0-9) required.');
  });

  it('should flag missing special characters', () => {
    const res = validatePassword('Rwanda2026Pass');
    expect(res.isValid).toBe(false);
    expect(res.rules.hasSpecialChar).toBe(false);
    expect(res.errors).toContain('At least one special character (!@#$%^&*...) required.');
  });

  it('should handle custom minimum lengths', () => {
    const res = validatePassword('Rw@1', { minLength: 10 });
    expect(res.isValid).toBe(false);
    expect(res.rules.minLength).toBe(false);
    expect(res.errors).toContain('At least 10 characters required.');
  });
});
