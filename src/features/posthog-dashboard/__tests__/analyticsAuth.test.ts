// @vitest-environment jsdom
// The usage-analytics API checks the user's login token (JWT) on every request; every FM-repo analytics
// client (FM, Pulse, Club, Vi, Calendar, Accounting, PATM) takes it from here.
import { beforeEach, describe, expect, it } from 'vitest';
import { analyticsAuthHeaders, analyticsToken } from '../api/analyticsAuth';

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });

describe('analyticsToken', () => {
  it('is the token the login saved, else access_token', () => {
    localStorage.setItem('access_token', 'old.access.token');
    localStorage.setItem('token', 'login.jwt.token');
    expect(analyticsToken()).toBe('login.jwt.token');
    localStorage.removeItem('token');
    expect(analyticsToken()).toBe('old.access.token');
    expect(analyticsAuthHeaders()).toEqual({ Authorization: 'Bearer old.access.token' });
  });
  it('sends nothing when signed out', () => {
    expect(analyticsToken()).toBe('');
    expect(analyticsAuthHeaders()).toEqual({});
  });
});
