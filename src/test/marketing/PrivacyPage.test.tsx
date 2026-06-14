import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PrivacyPage from '../../features/marketing/pages/PrivacyPage'
import '../../i18n'

function renderPrivacy() {
  return render(
    <MemoryRouter>
      <PrivacyPage />
    </MemoryRouter>
  )
}

describe('PrivacyPage', () => {
  it('renders page title', () => {
    renderPrivacy()
    expect(screen.getByRole('heading', { name: /Privacy Policy/i, level: 1 })).toBeDefined()
  })

  it('renders last updated date', () => {
    renderPrivacy()
    expect(screen.getByText(/Last Updated/i)).toBeDefined()
  })

  it('renders contact email section', () => {
    renderPrivacy()
    expect(screen.getByText('contact@triageflow.dev')).toBeDefined()
  })

  it('renders ToC navigation with "On this page" label', () => {
    renderPrivacy()
    expect(screen.getByText('On this page')).toBeDefined()
  })
})
