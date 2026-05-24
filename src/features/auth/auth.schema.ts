import { z } from 'zod'

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/

export const authSchema = z
  .object({
    name: z.string().trim().min(1, '이름을 입력해주세요.'),
    emailOrId: z.string().trim().min(1, '이메일 또는 아이디를 입력해주세요.'),
    phoneNumber: z
      .string()
      .trim()
      .min(1, '휴대폰 번호를 입력해주세요.')
      .refine((value) => /^\d+$/.test(value.replaceAll('-', '')), {
        message: '휴대폰 번호 형식을 확인해주세요.',
      }),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .min(8, '비밀번호는 8~20자여야 합니다.')
      .max(20, '비밀번호는 8~20자여야 합니다.')
      .regex(passwordPattern, '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호를 입력해주세요.'),
    serviceTerms: z.literal(true, {
      error: '필수 약관에 동의해주세요.',
    }),
    privacyTerms: z.literal(true, {
      error: '필수 약관에 동의해주세요.',
    }),
    marketingTerms: z.boolean(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  })

export type AuthSchemaValues = z.infer<typeof authSchema>
