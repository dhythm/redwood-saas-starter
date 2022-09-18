export const schema = gql`
  type Organization {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    organizationCode: String!
    name: String!
  }

  type Query {
    organizations: [Organization!]! @requireAuth
    organization(organizationCode: String!): Organization @requireAuth
  }

  input CreateOrganizationInput {
    organizationCode: String!
    name: String!
  }

  input UpdateOrganizationInput {
    organizationCode: String
    name: String
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization!
      @requireAuth
    updateOrganization(
      organizationCode: String!
      input: UpdateOrganizationInput!
    ): Organization! @requireAuth
    deleteOrganization(organizationCode: String!): Organization! @requireAuth
  }
`
