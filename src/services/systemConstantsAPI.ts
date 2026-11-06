import { getToken } from '@/utils/auth';

export async function fetchSystemConstants(params: Record<string, string>) {
  const token = getToken();
  if (!token) throw new Error('No access token found');

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const url = new URL(`${baseUrl}/system_constants.json`);

  // Add query params
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch system constants');
  return response.json();
}
