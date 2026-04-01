import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .email('Email không hợp lệ.'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu.')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
})

export const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Vui lòng nhập tên hiển thị.')
    .min(3, 'Tên hiển thị phải có ít nhất 3 ký tự.')
    .max(50, 'Tên hiển thị tối đa 50 ký tự.'),
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .email('Email không hợp lệ.'),
  password: z
    .string()
    .min(1, 'Vui lòng nhập mật khẩu.')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email.')
    .email('Email không hợp lệ.'),
})

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu mới.')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu hiện tại.')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
    newPassword: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu mới.')
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
    confirmNewPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmNewPassword'],
  })

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Vui lòng nhập tên hiển thị.')
    .min(3, 'Tên hiển thị phải có ít nhất 3 ký tự.')
    .max(50, 'Tên hiển thị tối đa 50 ký tự.'),
  avatarUrl: z
    .string()
    .url('URL không hợp lệ.')
    .max(512, 'URL tối đa 512 ký tự.')
    .optional()
    .or(z.literal('')),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>
