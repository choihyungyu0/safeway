import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { HomeHeader } from '@/features/home/components/HomeHeader'
import { LoginPage } from '@/pages/LoginPage'

vi.stubGlobal('alert', vi.fn())

const renderLoginPage = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<div>admin route reached</div>} />
      </Routes>
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

  it('renders the submit button and admin demo button', () => {
    renderLoginPage()

    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '관리자 대시보드로 이동' })).toBeInTheDocument()
  })

  it('validates missing ID or email', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('비밀번호'), 'demo-password')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByText('아이디 또는 이메일을 입력해 주세요.')).toBeInTheDocument()
  })

  it('validates missing password', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByLabelText('아이디 또는 이메일'), 'safe@example.com')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByText('비밀번호를 입력해 주세요.')).toBeInTheDocument()
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

  it('navigates to admin without triggering login validation', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: '관리자 대시보드로 이동' }))

    expect(screen.getByText('admin route reached')).toBeInTheDocument()
    expect(screen.queryByText('아이디 또는 이메일을 입력해 주세요.')).not.toBeInTheDocument()
    expect(screen.queryByText('비밀번호를 입력해 주세요.')).not.toBeInTheDocument()
  })
})

describe('HomeHeader auth links', () => {
  it('keeps login and signup links available', () => {
    render(
      <MemoryRouter>
        <HomeHeader />
      </MemoryRouter>,
    )

    const links = screen.getAllByRole('link')

    expect(links.some((link) => link.getAttribute('href') === '/login')).toBe(true)
    expect(links.some((link) => link.getAttribute('href') === '/signup')).toBe(true)
  })
})
