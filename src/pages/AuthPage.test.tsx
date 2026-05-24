import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { HomeHeader } from '@/features/home/components/HomeHeader'
import { AuthPage } from '@/pages/AuthPage'

vi.stubGlobal('alert', vi.fn())

const renderAuthPage = () =>
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <AuthPage />
    </MemoryRouter>,
  )

describe('AuthPage', () => {
  it('renders the signup title', () => {
    renderAuthPage()

    expect(screen.getByRole('heading', { name: '회원가입' })).toBeInTheDocument()
  })

  it('renders all signup fields', () => {
    renderAuthPage()

    expect(screen.getByLabelText('이름')).toBeInTheDocument()
    expect(screen.getByLabelText('이메일 또는 아이디')).toBeInTheDocument()
    expect(screen.getByLabelText('휴대폰 번호')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호 확인')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    renderAuthPage()

    expect(screen.getByRole('button', { name: '가입하기' })).toBeInTheDocument()
  })

  it('validates required terms', async () => {
    const user = userEvent.setup()
    renderAuthPage()

    await user.type(screen.getByLabelText('이름'), '홍길동')
    await user.type(screen.getByLabelText('이메일 또는 아이디'), 'safe@example.com')
    await user.type(screen.getByLabelText('휴대폰 번호'), '01012345678')
    await user.type(screen.getByLabelText('비밀번호'), 'Safeway!1')
    await user.type(screen.getByLabelText('비밀번호 확인'), 'Safeway!1')
    await user.click(screen.getByRole('button', { name: '가입하기' }))

    expect(screen.getByText('필수 약관에 동의해주세요.')).toBeInTheDocument()
  })

  it('validates password mismatch', async () => {
    const user = userEvent.setup()
    renderAuthPage()

    await user.type(screen.getByLabelText('이름'), '홍길동')
    await user.type(screen.getByLabelText('이메일 또는 아이디'), 'safe@example.com')
    await user.type(screen.getByLabelText('휴대폰 번호'), '01012345678')
    await user.type(screen.getByLabelText('비밀번호'), 'Safeway!1')
    await user.type(screen.getByLabelText('비밀번호 확인'), 'Safeway!2')
    await user.click(screen.getByLabelText('[필수] 서비스 이용약관 동의'))
    await user.click(screen.getByLabelText('[필수] 개인정보 수집 및 이용 동의'))
    await user.click(screen.getByRole('button', { name: '가입하기' }))

    expect(screen.getByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument()
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
}
)
