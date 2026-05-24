import { userTypes, type UserTypeOption } from '@/entities/user/types'
import { userTypeDescriptions, userTypeLabels } from '@/shared/constants/labels'

export const userTypeOptions: UserTypeOption[] = userTypes.map((type) => ({
  type,
  label: userTypeLabels[type],
  description: userTypeDescriptions[type],
}))
