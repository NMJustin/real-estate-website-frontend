import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Articles from '../index'
import api from '@/services/api'

jest.mock('@/navigation/legacy-router', () => ({
  Link: ({ children, to, ...props }: { children: React.ReactNode, to: string }) => <a href={to} {...props}>{children}</a>,
}))

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    getArticles: jest.fn(),
  },
}))

const mockedApi = api as jest.Mocked<typeof api>

describe('Articles', () => {
  beforeEach(() => {
    mockedApi.getArticles.mockResolvedValue({ data: [] })
  })

  it('uses category slugs when fetching filtered articles', async () => {
    render(<Articles />)
    await screen.findByRole('button', { name: 'Property Market Updates' })
    fireEvent.click(screen.getByRole('button', { name: 'Property Market Updates' }))
    await waitFor(() => expect(mockedApi.getArticles).toHaveBeenLastCalledWith('property-market-updates'))
  })
})
