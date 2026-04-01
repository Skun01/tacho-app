import { PageHelmet } from '@/components/seo/PageHelmet'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { AUTH_REGISTER_COPY } from '@/constants/auth'

export function RegisterPage() {
  return (
    <>
      <PageHelmet
        title="Tạo tài khoản"
        description="Tạo tài khoản Tacho miễn phí và bắt đầu hành trình học tiếng Nhật ngay hôm nay."
      />
      <AuthLayout
        heading={AUTH_REGISTER_COPY.heading}
        subheading={AUTH_REGISTER_COPY.subheading}
        kanjiStrip="挑戦探索発見理解"
        quoteJp="一歩一歩"
        quoteVn="Từng bước một."
        decorativeImage="/images.jfif"
      >
        <RegisterForm />
      </AuthLayout>
    </>
  )
}