const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const apiUrl = (path: string) =>
  `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;

export async function requestJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message ?? 'Request failed');
  }

  return data as T;
}
