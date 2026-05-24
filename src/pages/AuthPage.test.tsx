import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { HomeHeader } from '@/features/home/components/HomeHeader'
import { LoginPage } from '@/pages/LoginPage'
import { SignUpPage } from '@/pages/SignUpPage'

vi.stubGlobal('alert', vi.fn())

const renderLoginPage = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginPage />
    </MemoryRouter>,
  )

describe('LoginPage', () => {
  it('renders the login title', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { name: '로그인', level: 1 })).toBeInTheDocument()
  })

  it('renders login fields', () => {
    renderLoginPage()

    expect(screen.getByLabelText('아이디 또는 이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    renderLoginPage()

    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('validates missing ID or email', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('비밀번호'), 'demo-password')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByText('아이디 또는 이메일을 입력해주세요.')).toBeInTheDocument()
  })

  it('validates missing password', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('아이디 또는 이메일'), 'safe@example.com')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByText('비밀번호를 입력해주세요.')).toBeInTheDocument()
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    const passwordInput = screen.getByLabelText('비밀번호')

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: '비밀번호 보기' }))

    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('points the card signup link to /signup', () => {
    renderLoginPage()

    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup')
  })
})

describe('SignUpPage', () => {
  it('renders the signup screen separately from login', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <SignUpPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '로그인', level: 1 })).not.toBeInTheDocument()
  })
})

describe('HomeHeader auth links', () => {
  it('points login and signup links to auth routes', () => {
    render(
      <MemoryRouter>
        <HomeHeader />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /로그인/ })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: '회원가입' })).toHaveAttribute('href', '/signup')
  })
})
