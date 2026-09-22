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

const getToken = () => localStorage.getItem('admin_token');

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
		...options,
	});
	const body = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(body.message || `API request failed (${response.status})`);
	return body;
};

// Authenticated request — injects Bearer token from localStorage
const authRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
	const token = getToken();
	return request<T>(path, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers || {}),
		},
	});
};

// ─── Public API ───────────────────────────────────────────────────────────────
export const api = {
	getProperties: (query?: Record<string, QueryValue>) => request(`/properties${buildQuery(query)}`),
	savePropertySearch: (data: Record<string, unknown>) => request('/property-searches', { method: 'POST', body: JSON.stringify(data) }),
	getPropertiesByTransaction: (transactionType: string) => request(`/properties${buildQuery({ transactionType })}`),
	getPropertiesByType: (propertyType: string) => request(`/properties${buildQuery({ propertyType })}`),
	getProperty: (slug: string) => request(`/properties/${encodeURIComponent(slug)}`),
	getFavorites: (userId: string) => request(`/favorites${buildQuery({ userId })}`),
	addFavorite: (userId: string, propertyId: string) => request('/favorites', { method: 'POST', body: JSON.stringify({ userId, propertyId }) }),
	removeFavorite: (id: string) => request(`/favorites/${encodeURIComponent(id)}`, { method: 'DELETE' }),
	getAgents: () => request('/agents'),
	getAgent: (slug: string) => request(`/agents/${encodeURIComponent(slug)}`),
	getServices: () => request('/services'),
	getArticles: (category: string) => request(`/articles${buildQuery({ category })}`),
	getFaqs: () => request('/faqs'),
	createContact: (data: unknown) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
	createInquiry: (data: unknown) => request('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
	createListing: (data: unknown) => request('/listings', { method: 'POST', body: JSON.stringify(data) }),
	createViewing: (data: unknown) => request('/viewings', { method: 'POST', body: JSON.stringify(data) }),
	createValuation: (data: unknown) => request('/valuations', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Admin API ─────────────────────────────────────────────────────────────────
export const adminApi = {
	// Auth
	login: (email: string, password: string) =>
		request('/auth/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
	getMe: () => authRequest('/auth/me'),

	// Dashboard
	getDashboard: () => authRequest('/admin/dashboard'),

	// Properties
	getProperties: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/properties${buildQuery(query)}`),
	getProperty: (id: string) => authRequest(`/admin/properties/${id}`),
	createProperty: (data: Record<string, unknown>) =>
		authRequest('/admin/properties', { method: 'POST', body: JSON.stringify(data) }),
	updateProperty: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/properties/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteProperty: (id: string) =>
		authRequest(`/admin/properties/${id}`, { method: 'DELETE' }),
	getAdminProperties: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/properties${buildQuery(query)}`),
	createAdminProperty: (data: Record<string, unknown>) =>
		authRequest('/admin/properties', { method: 'POST', body: JSON.stringify(data) }),
	updateAdminProperty: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/properties/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteAdminProperty: (id: string) =>
		authRequest(`/admin/properties/${id}`, { method: 'DELETE' }),

	// Categories
	getCategories: () => authRequest('/admin/categories'),
	createCategory: (data: Record<string, unknown>) =>
		authRequest('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
	updateCategory: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteCategory: (id: string) =>
		authRequest(`/admin/categories/${id}`, { method: 'DELETE' }),

	// Agents
	getAgents: () => authRequest('/admin/agents'),
	getAgent: (id: string) => authRequest(`/admin/agents/${id}`),
	createAgent: (data: Record<string, unknown>) =>
		authRequest('/admin/agents', { method: 'POST', body: JSON.stringify(data) }),
	updateAgent: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/agents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteAgent: (id: string) =>
		authRequest(`/admin/agents/${id}`, { method: 'DELETE' }),

	// Inquiries
	getInquiries: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/inquiries${buildQuery(query)}`),
	updateInquiry: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

	// Viewings
	getViewings: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/viewings${buildQuery(query)}`),
	updateViewing: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/viewings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

	// Articles
	getArticles: () => authRequest('/admin/articles'),
	createArticle: (data: Record<string, unknown>) =>
		authRequest('/admin/articles', { method: 'POST', body: JSON.stringify(data) }),
	updateArticle: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/articles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteArticle: (id: string) =>
		authRequest(`/admin/articles/${id}`, { method: 'DELETE' }),

	// FAQs
	getFaqs: () => authRequest('/admin/faqs'),
	createFaq: (data: Record<string, unknown>) =>
		authRequest('/admin/faqs', { method: 'POST', body: JSON.stringify(data) }),
	updateFaq: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/faqs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteFaq: (id: string) =>
		authRequest(`/admin/faqs/${id}`, { method: 'DELETE' }),

	// Testimonials
	getTestimonials: () => authRequest('/admin/testimonials'),

	// Users
	getUsers: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/users${buildQuery(query)}`),

	// Settings
	getSettings: () => authRequest('/admin/settings'),
	updateSettings: (data: Record<string, unknown>) =>
		authRequest('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export default api;
