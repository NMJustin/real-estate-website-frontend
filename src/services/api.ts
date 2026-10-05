const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

type QueryValue = string | number | boolean | undefined;

const buildQuery = (query: Record<string, QueryValue> = {}) => {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined) params.set(key, String(value));
	});
	const search = params.toString();
	return search ? `?${search}` : '';
};

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
};

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
	const headers = new Headers(options.headers);
	if (typeof options.body === 'string' && !headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json');
	}
	const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
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
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers || {}),
		},
	});
};

const uploadPropertyMedia = async (file: File) => {
	const token = getToken();
	const formData = new FormData();
	formData.append('file', file);
	const response = await fetch(`${API_BASE_URL}/admin/properties/media`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData });
	const body = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(body.message || 'Media upload failed.');
	return body as { data: { url: string; mediaType: 'IMAGE' | 'VIDEO' } };
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
	getAgents: (query?: Record<string, QueryValue>) => request(`/agents${buildQuery(query)}`),
	getAgent: (slug: string) => request(`/agents/${encodeURIComponent(slug)}`),
	getServices: () => request('/services'),
	getArticles: (category: string) => request(`/articles${buildQuery({ category })}`),
	getArticle: (slug: string) => request(`/articles/${encodeURIComponent(slug)}`),
	getFaqs: () => request('/faqs'),
	getCategories: () => request('/categories'),
	createContact: (data: unknown) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),
	createInquiry: (data: unknown) => request('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
	createListing: (data: FormData) => request('/listings', { method: 'POST', body: data }),
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
	uploadPropertyMedia,

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
	getAdminCategories: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/categories${buildQuery(query)}`),
	getAdminCategory: (id: string) =>
		authRequest(`/admin/categories/${id}`),
	createCategory: (data: Record<string, unknown>) =>
		authRequest('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
	updateCategory: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteCategory: (id: string) =>
		authRequest(`/admin/categories/${id}`, { method: 'DELETE' }),
	deleteAdminCategory: (id: string) =>
		authRequest(`/admin/categories/${id}`, { method: 'DELETE' }),

	// Agents
	getAgents: () => authRequest('/admin/agents'),
	getAdminAgents: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/agents${buildQuery(query)}`),
	getAdminAgent: (id: string) => authRequest(`/admin/agents/${id}`),
	createAgent: (data: Record<string, unknown>) =>
		authRequest('/admin/agents', { method: 'POST', body: JSON.stringify(data) }),
	updateAgent: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/agents/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteAgent: (id: string) =>
		authRequest(`/admin/agents/${id}`, { method: 'DELETE' }),
	deleteAdminAgent: (id: string) =>
		authRequest(`/admin/agents/${id}`, { method: 'DELETE' }),

	// Inquiries
	getInquiries: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/inquiries${buildQuery(query)}`),
	getInquiry: (id: string) =>
		authRequest(`/admin/inquiries/${id}`),
	updateInquiry: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteAdminInquiry: (id: string) =>
		authRequest(`/admin/inquiries/${id}`, { method: 'DELETE' }),

	// Property listing requests
	getListingRequests: () => authRequest('/admin/listings'),
	approveListingRequest: (id: string) =>
		authRequest(`/admin/listings/${id}/approve`, { method: 'PATCH' }),
	rejectListingRequest: (id: string) =>
		authRequest(`/admin/listings/${id}/reject`, { method: 'PATCH' }),

	// Viewings
	getViewings: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/viewings${buildQuery(query)}`),
	getViewing: (id: string) =>
		authRequest(`/admin/viewings/${id}`),
	updateViewing: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/viewings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteViewing: (id: string) =>
		authRequest(`/admin/viewings/${id}`, { method: 'DELETE' }),

	// Valuations
	getValuations: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/valuations${buildQuery(query)}`),
	getValuation: (id: string) =>
		authRequest(`/admin/valuations/${id}`),
	updateValuation: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/valuations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteValuation: (id: string) =>
		authRequest(`/admin/valuations/${id}`, { method: 'DELETE' }),

	// Services
	getAdminServices: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/services${buildQuery(query)}`),
	getAdminService: (id: string) =>
		authRequest(`/admin/services/${id}`),
	createService: (data: Record<string, unknown>) =>
		authRequest('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
	updateService: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/services/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteService: (id: string) =>
		authRequest(`/admin/services/${id}`, { method: 'DELETE' }),

	// Articles
	getArticles: () => authRequest('/admin/articles'),
	getAdminArticles: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/articles${buildQuery(query)}`),
	getAdminArticle: (id: string) =>
		authRequest(`/admin/articles/${id}`),
	createArticle: (data: Record<string, unknown>) =>
		authRequest('/admin/articles', { method: 'POST', body: JSON.stringify(data) }),
	updateArticle: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/articles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteArticle: (id: string) =>
		authRequest(`/admin/articles/${id}`, { method: 'DELETE' }),
	deleteAdminArticle: (id: string) =>
		authRequest(`/admin/articles/${id}`, { method: 'DELETE' }),

	// FAQs
	getFaqs: () => authRequest('/admin/faqs'),
	getAdminFaqs: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/faqs${buildQuery(query)}`),
	getAdminFaq: (id: string) =>
		authRequest(`/admin/faqs/${id}`),
	createFaq: (data: Record<string, unknown>) =>
		authRequest('/admin/faqs', { method: 'POST', body: JSON.stringify(data) }),
	updateFaq: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/faqs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteFaq: (id: string) =>
		authRequest(`/admin/faqs/${id}`, { method: 'DELETE' }),
	deleteAdminFaq: (id: string) =>
		authRequest(`/admin/faqs/${id}`, { method: 'DELETE' }),

	// Testimonials
	getTestimonials: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/testimonials${buildQuery(query)}`),
	getAdminTestimonial: (id: string) =>
		authRequest(`/admin/testimonials/${id}`),
	createTestimonial: (data: Record<string, unknown>) =>
		authRequest('/admin/testimonials', { method: 'POST', body: JSON.stringify(data) }),
	updateTestimonial: (id: string, data: Record<string, unknown>) =>
		authRequest(`/admin/testimonials/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
	deleteTestimonial: (id: string) =>
		authRequest(`/admin/testimonials/${id}`, { method: 'DELETE' }),

	// Users
	getUsers: (query?: Record<string, QueryValue>) =>
		authRequest(`/admin/users${buildQuery(query)}`),
	getRoles: () => authRequest('/admin/roles'),
	updateUserMediaPermission: (id: string, canUploadPropertyMedia: boolean) =>
		authRequest(`/admin/users/${id}/media-permission`, {
			method: 'PATCH',
			body: JSON.stringify({ canUploadPropertyMedia }),
		}),
	updateUserRole: (id: string, roleId: number) =>
		authRequest(`/admin/users/${id}/role`, {
			method: 'PATCH',
			body: JSON.stringify({ roleId }),
		}),

	// Settings
	getSettings: () => authRequest('/admin/settings'),
	updateSettings: (data: Record<string, unknown>) =>
		authRequest('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export default api;
