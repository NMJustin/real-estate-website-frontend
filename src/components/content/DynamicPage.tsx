'use client'

import { useEffect, useState } from 'react'
import { api } from '@/services/api'

interface DynamicPageProps {
	slug: string
}

interface PageResponse {
	success: boolean
	data: {
		id: string
		title: string
		slug: string
		content: string
		metaTitle?: string
		metaDescription?: string
		isPublished: boolean
	}
}

export default function DynamicPage({ slug }: DynamicPageProps) {
	const [page, setPage] = useState<PageResponse['data'] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		const loadPage = async () => {
			try {
				const response = await api.getPageBySlug(slug) as PageResponse
				if (response?.success && response?.data) {
					setPage(response.data)
					// Update document title for SEO
					if (response.data.metaTitle || response.data.title) {
						document.title = response.data.metaTitle || response.data.title
					}
					// Update meta description
					if (response.data.metaDescription) {
						const metaDescription = document.querySelector('meta[name="description"]')
						if (metaDescription) {
							metaDescription.setAttribute('content', response.data.metaDescription)
						} else {
							const newMeta = document.createElement('meta')
							newMeta.name = 'description'
							newMeta.content = response.data.metaDescription
							document.head.appendChild(newMeta)
						}
					}
				} else {
					setError('Page not found')
				}
			} catch (err) {
				setError('Failed to load page')
			} finally {
				setLoading(false)
			}
		}
		loadPage()
	}, [slug])

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-slate-500">Loading...</div>
			</div>
		)
	}

	if (error || !page) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-slate-500">{error || 'Page not found'}</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold text-slate-900">{page.title}</h1>
				{page.content && (
					<div
						className="mt-8 prose prose-slate max-w-none"
						dangerouslySetInnerHTML={{ __html: page.content }}
					/>
				)}
			</div>
		</div>
	)
}
