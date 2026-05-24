export type AuthFormValues = {
  name: string
  emailOrId: string
  phoneNumber: string
  password: string
  confirmPassword: string
  serviceTerms: boolean
  privacyTerms: boolean
  marketingTerms: boolean
}

export type AuthFieldName = keyof AuthFormValues
