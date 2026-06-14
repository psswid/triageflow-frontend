import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../../features/marketing/pages/LandingPage'
import '../../i18n'

function renderLanding() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  )
}

describe('LandingPage', () => {
  it('renders hero CTA button linking to register', () => {
    renderLanding()
    const cta = screen.getByRole('link', { name: /Try the Demo/i })
    expect(cta).toBeDefined()
    expect(cta.getAttribute('href')).toBe('/register')
  })

  it('renders secondary CTA linking to how it works', () => {
    renderLanding()
    const secondary = screen.getByRole('link', { name: /See How It Works/i })
    expect(secondary).toBeDefined()
    expect(secondary.getAttribute('href')).toBe('/how-it-works')
  })

  it('renders demo mode disclaimer', () => {
    renderLanding()
    expect(screen.getByText(/Do not use for actual medical advice/i, { selector: '.text-amber-700' })).toBeDefined()
  })

  it('renders 4 feature cards', () => {
    renderLanding()
    const features = [
      /AI-Powered Triage/i,
      /Full-Stack Architecture/i,
      /Synthetic Case Generator/i,
      /Observability & Monitoring/i,
    ]
    for (const pattern of features) {
      expect(screen.getByRole('heading', { name: pattern, level: 3 })).toBeDefined()
    }
  })
})
