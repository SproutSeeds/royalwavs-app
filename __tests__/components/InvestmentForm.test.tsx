import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InvestmentForm } from '@/components/InvestmentForm'

// Mock fetch
global.fetch = jest.fn()

// Mock window.location
delete (window as any).location
window.location = { href: '' } as any

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('InvestmentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders investment form with available amount', () => {
    render(<InvestmentForm songId="song1" availableAmount={500} />)

    expect(screen.getByLabelText('Investment Amount ($)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter amount to invest')).toBeInTheDocument()
    expect(screen.getByText('Max: $500')).toBeInTheDocument()
  })

  it('displays quick select buttons for valid amounts', () => {
    render(<InvestmentForm songId="song1" availableAmount={500} />)

    expect(screen.getByText('$10')).toBeInTheDocument()
    expect(screen.getByText('$25')).toBeInTheDocument()
    expect(screen.getByText('$50')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  it('filters quick select buttons based on available amount', () => {
    render(<InvestmentForm songId="song1" availableAmount={30} />)

    expect(screen.getByText('$10')).toBeInTheDocument()
    expect(screen.getByText('$25')).toBeInTheDocument()
    expect(screen.queryByText('$50')).not.toBeInTheDocument()
    expect(screen.queryByText('$100')).not.toBeInTheDocument()
  })

  it('allows user to enter custom investment amount', async () => {
    const user = userEvent.setup()
    render(<InvestmentForm songId="song1" availableAmount={500} />)

    const input = screen.getByPlaceholderText('Enter amount to invest')
    await user.type(input, '150')

    expect(input).toHaveValue(150)
  })

  it('shows ownership percentage preview', async () => {
    const user = userEvent.setup()
    render(<InvestmentForm songId="song1" availableAmount={500} />)

    const input = screen.getByPlaceholderText('Enter amount to invest')
    await user.type(input, '100')

    // 100 / (500 + 100) * 100 = 16.67%
    expect(screen.getByText(/16\.67%/)).toBeInTheDocument()
    expect(screen.getByText(/You'll own/)).toBeInTheDocument()
  })

  it('quick select button updates input value', async () => {
    const user = userEvent.setup()
    render(<InvestmentForm songId="song1" availableAmount={500} />)

    await user.click(screen.getByText('$50'))

    const input = screen.getByPlaceholderText('Enter amount to invest')
    expect(input).toHaveValue(50)
  })

  it('submits investment and redirects to checkout', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_123' }),
    } as Response)

    render(<InvestmentForm songId="song1" availableAmount={500} />)

    const input = screen.getByPlaceholderText('Enter amount to invest')
    await user.type(input, '100')

    const submitButton = screen.getByRole('button', { name: /Invest \$100/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/investments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          songId: 'song1',
          amount: 100,
        }),
      })
    })

    expect(window.location.href).toBe('https://checkout.stripe.com/pay/cs_test_123')
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Insufficient funds' }),
    } as Response)

    render(<InvestmentForm songId="song1" availableAmount={500} />)

    const input = screen.getByPlaceholderText('Enter amount to invest')
    await user.type(input, '100')

    const submitButton = screen.getByRole('button', { name: /Invest \$100/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Insufficient funds')
    })

    alertSpy.mockRestore()
  })

  it('disables form when fully funded', () => {
    render(<InvestmentForm songId="song1" availableAmount={0} />)

    const input = screen.getByPlaceholderText('Enter amount to invest')
    const submitButton = screen.getByRole('button', { name: 'Fully Funded' })

    expect(input).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('validates amount does not exceed available', async () => {
    const user = userEvent.setup()
    render(<InvestmentForm songId="song1" availableAmount={100} />)

    const input = screen.getByPlaceholderText('Enter amount to invest')
    await user.type(input, '150') // Exceeds available

    const submitButton = screen.getByRole('button', { name: /Invest/ })
    expect(submitButton).toBeDisabled()
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<InvestmentForm songId="song1" availableAmount={500} />)

    const input = screen.getByPlaceholderText('Enter amount to invest')
    await user.type(input, '100')

    const submitButton = screen.getByRole('button', { name: /Invest \$100/ })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })
  })
})