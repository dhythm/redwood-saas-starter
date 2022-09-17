import { atom } from 'recoil'

export const selectedOrganizationCodeState = atom<string | undefined>({
  key: 'selectedOrganizationCode',
  default: undefined,
})
