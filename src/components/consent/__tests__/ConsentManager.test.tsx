import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ConsentManager } from '../ConsentManager'
import { COOKIE_POLICY_VERSION, TERMS_POLICY_VERSION } from '@/utils/consent'

jest.mock('next/link', () => ({ __esModule: true, default: ({ children, href }: { children: React.ReactNode, href: string }) => <a href={href}>{children}</a> }))

const termsDecision = () => ({ decision: 'accepted', policyVersion: TERMS_POLICY_VERSION, decidedAt: '2026-10-18T00:00:00.000Z' })

describe('ConsentManager', () => {
  beforeEach(() => localStorage.clear())

  it('shows terms first, then stores an accept-all cookie choice', async () => {
    render(<ConsentManager />)
    expect(await screen.findByRole('heading', { name: 'Terms & Conditions' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Accept terms' }))
    expect(await screen.findByRole('heading', { name: 'Cookie consent' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Accept all' }))
    await waitFor(() => expect(screen.queryByRole('heading', { name: 'Cookie consent' })).not.toBeInTheDocument())
    expect(JSON.parse(localStorage.getItem('ingata_cookie_preferences') || '{}')).toMatchObject({ necessary: true, analytics: true, marketing: true, policyVersion: COOKIE_POLICY_VERSION })
  })

  it('records a decline and still presents the separate cookie choice', async () => {
    render(<ConsentManager />)
    fireEvent.click(await screen.findByRole('button', { name: 'Decline' }))
    expect(JSON.parse(localStorage.getItem('ingata_terms_decision') || '{}')).toMatchObject({ decision: 'declined', policyVersion: TERMS_POLICY_VERSION })
    expect(await screen.findByRole('heading', { name: 'Cookie consent' })).toBeInTheDocument()
  })

  it('saves necessary-only and custom preferences', async () => {
    localStorage.setItem('ingata_terms_decision', JSON.stringify(termsDecision()))
    const { unmount } = render(<ConsentManager />)
    fireEvent.click(await screen.findByRole('button', { name: 'Necessary only' }))
    expect(JSON.parse(localStorage.getItem('ingata_cookie_preferences') || '{}')).toMatchObject({ analytics: false, marketing: false })
    unmount()

    render(<ConsentManager />)
    window.dispatchEvent(new Event('ingata-open-cookie-settings'))
    expect(await screen.findByRole('heading', { name: 'Choose your preferences' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('checkbox', { name: /Analytics/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Save preferences' }))
    expect(JSON.parse(localStorage.getItem('ingata_cookie_preferences') || '{}')).toMatchObject({ analytics: true, marketing: false })
  })
})
