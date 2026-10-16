/**
 * Centralized API Configuration
 * All API requests should use this configuration to ensure consistent base URL across the application.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Sanitize URL to avoid double slashes when concatenating base URL and path
 * Example: sanitizeUrl('https://api.com/api/v1', '/auth/login') -> 'https://api.com/api/v1/auth/login'
 */
export const sanitizeUrl = (baseUrl: string, path: string): string => {
	const trimmedBase = baseUrl.replace(/\/+$/, '');
	const trimmedPath = path.replace(/^\/+/, '');
	return `${trimmedBase}/${trimmedPath}`;
};

/**
 * Get the API base URL
 * In production, this should be set via NEXT_PUBLIC_API_URL environment variable
 * In development, it falls back to localhost:5000
 */
export const getApiBaseUrl = (): string => API_BASE_URL;

/**
 * Validate that the API base URL is properly configured for production
 * Returns true if configuration looks valid, false otherwise
 */
export const isApiConfigValid = (): boolean => {
	// In production, we should not be using localhost
	if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
		if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
			console.error('⚠️ API Configuration Error: Using localhost in production environment');
			console.error('Current API_BASE_URL:', API_BASE_URL);
			console.error('Please set NEXT_PUBLIC_API_URL environment variable in Vercel');
			return false;
		}
	}
	return true;
};

export default API_BASE_URL;
