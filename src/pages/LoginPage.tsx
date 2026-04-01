import { PageHelmet } from '@/components/seo/PageHelmet'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { AUTH_LOGIN_COPY } from '@/constants/auth'

export function LoginPage() {
  return (
    <>
      <PageHelmet
        title="Đăng nhập"
        description="Đăng nhập vào Tacho để tiếp tục hành trình học tiếng Nhật của bạn."
      />
      <AuthLayout
        heading={AUTH_LOGIN_COPY.heading}
        subheading={AUTH_LOGIN_COPY.subheading}
        kanjiStrip="学習記憶成長継続"
        quoteJp="継続は力なり"
        quoteVn="Kiên trì là sức mạnh."
        decorativeImage="/images.jfif"
      >
        <LoginForm />
      </AuthLayout>
    </>
  )
}