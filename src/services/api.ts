const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

type QueryValue = string | number | boolean | undefined;

const buildQuery = (query: Record<string, QueryValue> = {}) => {
	const params = new URLSearchParams();

	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined) params.set(key, String(value));
	});

	const search = params.toString();
	return search ? `?${search}` : '';
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
		...options,
	});

	const body = await response.json();
	if (!response.ok) throw new Error(body.message || 'API request failed');
	return body;
};

export const api = {
	getProperties: (query?: Record<string, QueryValue>) => request(`/properties${buildQuery(query)}`),
	getPropertiesByTransaction: (transactionType: string) => request(`/properties${buildQuery({ transactionType })}`),
	getPropertiesByType: (propertyType: string) => request(`/properties${buildQuery({ propertyType })}`),
	getProperty: (slug: string) => request(`/properties/${encodeURIComponent(slug)}`),
	getAgents: () => request('/agents'),
	getAgent: (slug: string) => request(`/agents/${encodeURIComponent(slug)}`),
	getServices: () => request('/services'),
	getArticles: (category: string) => request(`/articles${buildQuery({ category })}`),
	getFaqs: () => request('/faqs'),
	createContact: (data: unknown) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
	createListing: (data: unknown) => request('/listings', { method: 'POST', body: JSON.stringify(data) }),
	createViewing: (data: unknown) => request('/viewings', { method: 'POST', body: JSON.stringify(data) }),
	createValuation: (data: unknown) => request('/valuations', { method: 'POST', body: JSON.stringify(data) }),
};

export default api;
