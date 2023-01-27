const { buildSchema } = require('graphql');

const schema = buildSchema(`
type Query {
  users: [User]

  
}
type User {
  id: Int
  email:String
  name:String
}
type Mutation {
  addUser(email: String!, name: String!): User
  updateUser(id: ID!, email: String, name: String): User
  delete(id: Int!): Boolean
}
`);
module.exports=schema;