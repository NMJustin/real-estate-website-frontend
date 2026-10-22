/**
 * Tests for session-expiry redirect logic in api.ts.
 *
 * Part 1 – pure function tests for `getLoginRedirectForRole`:
 *   admin role  → /admin
 *   agent | property_manager | content_editor  → /portal/login
 *   no stored role + admin URL context  → /admin
 *   no stored role + portal/other URL context  → /portal/login
 *   unknown/future role falls back to URL context
 *   role string is case-insensitive
 *
 * Part 2 – integration tests via `authRequest` path:
 *   HTTP 401 clears auth data and throws 'Session expired'
 *   HTTP 403 does NOT redirect — surfaces permission error inline
 */

jest.mock('@/config/api', () => ({
  getApiBaseUrl: () => 'http://localhost:4000/api/v1',
  sanitizeUrl: (_base: string, path: string) => `http://localhost:4000/api/v1${path}`,
  isApiConfigValid: () => true,
}));

import { getLoginRedirectForRole } from '../api';

// ─── Part 1: pure redirect-destination logic ──────────────────────────────────

describe('getLoginRedirectForRole – role-based destination', () => {
  it('routes admin to /admin', () => {
    expect(getLoginRedirectForRole('admin', '/admin/dashboard')).toBe('/admin');
  });

  it('routes agent to /portal/login', () => {
    expect(getLoginRedirectForRole('agent', '/portal/agent/dashboard')).toBe('/portal/login');
  });

  it('routes property_manager to /portal/login', () => {
    expect(getLoginRedirectForRole('property_manager', '/portal/property-manager/properties')).toBe('/portal/login');
  });

  it('routes content_editor to /portal/login', () => {
    expect(getLoginRedirectForRole('content_editor', '/portal/content-editor/articles')).toBe('/portal/login');
  });

  it('is case-insensitive for role strings', () => {
    expect(getLoginRedirectForRole('ADMIN', '/admin/dashboard')).toBe('/admin');
    expect(getLoginRedirectForRole('Agent', '/portal/agent/dashboard')).toBe('/portal/login');
  });

  it('falls back to /admin for admin URL when role is null', () => {
    expect(getLoginRedirectForRole(null, '/admin/properties')).toBe('/admin');
  });

  it('falls back to /portal/login for portal URL when role is null', () => {
    expect(getLoginRedirectForRole(null, '/portal/agent/viewings')).toBe('/portal/login');
  });

  it('falls back to /portal/login for non-admin URL when role is unknown', () => {
    expect(getLoginRedirectForRole('unknown_future_role', '/portal/some-new-page')).toBe('/portal/login');
  });

  it('falls back to /admin for admin URL when role is unknown', () => {
    expect(getLoginRedirectForRole('unknown_role', '/admin/something')).toBe('/admin');
  });

  it('defaults to /portal/login when no role and no clear path context', () => {
    expect(getLoginRedirectForRole(null, '/')).toBe('/portal/login');
    expect(getLoginRedirectForRole(null, '/some/public/page')).toBe('/portal/login');
  });
});

// ─── Part 2: authRequest side-effects ─────────────────────────────────────────

describe('authRequest – 401/403 handling', () => {
  let fetchMock: jest.Mock;

  const makeResponse = (status: number, body: Record<string, unknown>) =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    } as Response);

  beforeEach(() => {
    localStorage.clear();
    fetchMock = jest.fn();
    global.fetch = fetchMock;
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('clears admin_token, user_role, and inactivity_logout on 401', async () => {
    localStorage.setItem('admin_token', 'expired.jwt.token');
    localStorage.setItem('user_role', JSON.stringify('agent'));
    localStorage.setItem('inactivity_logout', JSON.stringify({ logoutTime: Date.now() + 60_000 }));

    fetchMock.mockImplementationOnce(() =>
      makeResponse(401, { message: 'Invalid or expired token. Please log in again.' }),
    );

    const { adminApi } = await import('../api');
    await expect(adminApi.getDashboard()).rejects.toThrow('Session expired');

    expect(localStorage.getItem('admin_token')).toBeNull();
    expect(localStorage.getItem('user_role')).toBeNull();
    expect(localStorage.getItem('inactivity_logout')).toBeNull();
  });

  it('throws "Session expired" error message on 401', async () => {
    localStorage.setItem('admin_token', 'expired.jwt.token');
    fetchMock.mockImplementationOnce(() =>
      makeResponse(401, { message: 'Invalid or expired token.' }),
    );

    const { adminApi } = await import('../api');
    await expect(adminApi.getDashboard()).rejects.toThrow('Session expired. Redirecting to login...');
  });

  it('does NOT clear auth data on 403', async () => {
    localStorage.setItem('admin_token', 'valid.jwt.token');
    localStorage.setItem('user_role', JSON.stringify('agent'));

    fetchMock.mockImplementationOnce(() =>
      makeResponse(403, { message: 'Forbidden: insufficient permissions' }),
    );

    const { adminApi } = await import('../api');
    await expect(adminApi.getDashboard()).rejects.toThrow(/permission/i);

    // Token and role must NOT be cleared on 403
    expect(localStorage.getItem('admin_token')).toBe('valid.jwt.token');
    expect(localStorage.getItem('user_role')).toBe(JSON.stringify('agent'));
  });

  it('surfaces the backend permission message on 403', async () => {
    localStorage.setItem('admin_token', 'valid.jwt.token');
    fetchMock.mockImplementationOnce(() =>
      makeResponse(403, { message: 'Forbidden: insufficient permissions' }),
    );

    const { adminApi } = await import('../api');
    await expect(adminApi.getDashboard()).rejects.toThrow('Forbidden: insufficient permissions');
  });
});
