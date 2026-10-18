import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import NewArticle from '../index'
import { adminApi } from '@/services/api'

const mockPush = jest.fn()

jest.mock('@/navigation/legacy-router', () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode, to: string }) => <a href={to} {...props}>{children}</a>,
  useNavigate: () => mockPush,
}))

jest.mock('@/services/api', () => ({
  adminApi: {
    getArticleCategories: jest.fn(),
    getUsers: jest.fn(),
    createArticle: jest.fn(),
  },
}))

const mockedAdminApi = adminApi as jest.Mocked<typeof adminApi>

describe('NewArticle', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockedAdminApi.getArticleCategories.mockResolvedValue({ data: [{ id: 'market-id', name: 'Property Market Updates', slug: 'property-market-updates', isActive: true }] })
    mockedAdminApi.getUsers.mockResolvedValue({ data: [] })
    mockedAdminApi.createArticle.mockResolvedValue({ data: { id: 'article-id' } })
  })

  it('loads article categories, generates a slug, and posts the selected category ID', async () => {
    render(<NewArticle />)
    const category = await screen.findByRole('option', { name: 'Property Market Updates' })
    expect(mockedAdminApi.getArticleCategories).toHaveBeenCalledTimes(1)

    fireEvent.change(screen.getByPlaceholderText('Article title'), { target: { value: 'Buying Guide 1' } })
    expect(screen.getByPlaceholderText('e.g., my-article-title')).toHaveValue('buying-guide-1')
    fireEvent.change(screen.getByPlaceholderText('Article content (you can use Markdown or HTML)'), { target: { value: 'Article body' } })
    fireEvent.change(category.parentElement as HTMLSelectElement, { target: { value: 'market-id' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Article' }))

    await waitFor(() => expect(mockedAdminApi.createArticle).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Buying Guide 1', slug: 'buying-guide-1', categoryId: 'market-id', content: 'Article body',
    })))
    expect(mockPush).toHaveBeenCalledWith('/admin/articles')
  })
})
