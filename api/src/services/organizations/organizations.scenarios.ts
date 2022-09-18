import type { Prisma, Organization } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: {
      data: {
        updatedAt: '2022-09-18T01:16:28Z',
        organizationCode: 'String4220949',
        name: 'String',
      },
    },
    two: {
      data: {
        updatedAt: '2022-09-18T01:16:28Z',
        organizationCode: 'String6772241',
        name: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Organization, 'organization'>
