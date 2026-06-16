import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import HowItWorksPage from '../../features/marketing/pages/HowItWorksPage'
import '../../i18n'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider><MemoryRouter>{children}</MemoryRouter></HelmetProvider>
)

describe('HowItWorksPage', () => {
  it('renders page title', () => {
    render(<HowItWorksPage />, { wrapper })
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
  })

  it('renders 4 step cards', () => {
    render(<HowItWorksPage />, { wrapper })
    const steps = screen.getAllByRole('heading', { level: 2 })
    expect(steps.length).toBe(4)
  })

  it('renders CTA link to register', () => {
    render(<HowItWorksPage />, { wrapper })
    const cta = screen.getByRole('link', { name: /try/i })
    expect(cta.getAttribute('href')).toBe('/register')
  })

  it('renders demo disclaimer', () => {
    render(<HowItWorksPage />, { wrapper })
    expect(screen.getByText(/demo/i)).toBeDefined()
  })
})
