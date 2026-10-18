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
    getUsers: jest.fn(),
    createArticle: jest.fn(),
  },
}))

const mockedAdminApi = adminApi as jest.Mocked<typeof adminApi>

describe('NewArticle', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockedAdminApi.getUsers.mockResolvedValue({ data: [] })
    mockedAdminApi.createArticle.mockResolvedValue({ data: { id: 'article-id' } })
  })

  it('generates a slug and posts the selected category ID', async () => {
    render(<NewArticle />)
    const category = await screen.findByRole('option', { name: 'Property Market Updates' })

    fireEvent.change(screen.getByPlaceholderText('Article title'), { target: { value: 'Buying Guide 1' } })
    expect(screen.getByPlaceholderText('e.g., my-article-title')).toHaveValue('buying-guide-1')
    fireEvent.change(screen.getByPlaceholderText('Article content (you can use Markdown or HTML)'), { target: { value: 'Article body' } })
    fireEvent.change(category.parentElement as HTMLSelectElement, { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Article' }))

    await waitFor(() => expect(mockedAdminApi.createArticle).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Buying Guide 1', slug: 'buying-guide-1', categoryId: '1', content: 'Article body',
    })))
    expect(mockPush).toHaveBeenCalledWith('/admin/articles')
  })
})
