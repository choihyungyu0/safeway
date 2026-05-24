export const userTypes = [
  'GENERAL',
  'SENIOR',
  'CHILD',
  'PREGNANT',
  'DISABLED',
  'OUTDOOR_WORKER',
] as const

export type UserType = (typeof userTypes)[number]

export type UserTypeOption = {
  type: UserType
  label: string
  description: string
}
