import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AboutPage from '../../features/marketing/pages/AboutPage'
import '../../i18n'

function renderAbout() {
  return render(
    <MemoryRouter>
      <AboutPage />
    </MemoryRouter>
  )
}

describe('AboutPage', () => {
  it('renders page title', () => {
    renderAbout()
    expect(screen.getByRole('heading', { name: /About This Project/i, level: 1 })).toBeDefined()
  })

  it('renders developer name', () => {
    renderAbout()
    expect(screen.getByText('Piotr Świderski')).toBeDefined()
  })

  it('renders disclaimer header', () => {
    renderAbout()
    expect(screen.getByText(/Important Disclaimer/i)).toBeDefined()
  })

  it('renders tech decisions section', () => {
    renderAbout()
    expect(screen.getByRole('heading', { name: /Technical Decisions/i, level: 2 })).toBeDefined()
  })
})
