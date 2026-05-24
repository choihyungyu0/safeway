import { z } from 'zod'

export const loginSchema = z.object({
  emailOrId: z.string().trim().min(1, '아이디 또는 이메일을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

export type LoginSchemaValues = z.infer<typeof loginSchema>
