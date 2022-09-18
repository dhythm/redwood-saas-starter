import type {
  MutationResolvers, QueryResolvers
} from 'types/graphql'

import { db } from 'src/lib/db'

export const organizations: QueryResolvers['organizations'] = () => {
  return db.organization.findMany()
}

export const organization: QueryResolvers['organization'] = ({
  organizationCode,
}) => {
  return db.organization.findUnique({
    where: { organizationCode },
  })
}

export const createOrganization: MutationResolvers['createOrganization'] = ({
  input,
}) => {
  return db.organization.create({
    data: input,
  })
}

export const updateOrganization: MutationResolvers['updateOrganization'] = ({
  organizationCode,
  input,
}) => {
  return db.organization.update({
    data: input,
    where: { organizationCode },
  })
}

export const deleteOrganization: MutationResolvers['deleteOrganization'] = ({
  organizationCode,
}) => {
  return db.organization.delete({
    where: { organizationCode },
  })
}
