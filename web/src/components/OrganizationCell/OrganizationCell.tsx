import { Text } from '@chakra-ui/react'
import type {
  FindOrganizationQuery,
  FindOrganizationQueryVariables
} from 'types/graphql'

import type { CellFailureProps, CellSuccessProps } from '@redwoodjs/web'

export const QUERY = gql`
  query FindOrganizationQuery($organizationCode: String!) {
    organization: organization(organizationCode: $organizationCode) {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindOrganizationQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  organization,
}: CellSuccessProps<FindOrganizationQuery, FindOrganizationQueryVariables>) => {
  return <Text fontSize="lg">{organization.name}</Text>
}
