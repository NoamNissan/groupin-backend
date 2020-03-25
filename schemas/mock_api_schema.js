var { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
type User {
    id: ID!
    name: String
    email: String
}

type Session {
    id: ID!
    title: String!
    author: ID
}

input LoginToken {
    token: ID!
}

type Category {
    name: String!
}

type Query {
    hello: String
    user(id: ID): User
    getFrontSessions: [Session]!
    getCategories: [Category]!
    getSessionsByCategory(category: String!): [Category]!
    getSessionsByUser(user: ID!): [Category]!
    login(username: String!, password: String!): ID!
}

type Mutation {
    subscribe(user_token: LoginToken!, session_id: ID): Boolean
    unsubscribe(user_token: LoginToken!, session_id: ID): Boolean
    createSession(user_token: LoginToken!, title: String): Boolean
    createResession(user_token: LoginToken!, title: String): Boolean
    deleteSession(user_token: LoginToken!, session_id: ID): Boolean
    deleteResession(user_token: LoginToken!, resession_id: ID): Boolean
    register(username: String!, password: String!): Boolean
}
`);

var resolver = {
  hello: () => {
    return "Hello world!";
  },
  subscribe: () => {
    return true;
  },
  unsubsribe: () => {
    return true;
  },
  createSession: () => {
    return true;
  },
  createResession: () => {
    return true;
  },
  deleteSession: () => {
    return true;
  },
  deleteResession: () => {
    return true;
  },
  register: () => {
    return true;
  },
  user: () => {
    return { id: "5", name: "Johnny Test", email: "billgates@google.com" };
  },
  getFrontSessions: () => {
    return [];
  },
  getCategories: () => {
    return [{ name: "Fun" }, { name: "Gaming" }, { name: "Education" }];
  },
  getSessionsByUser: () => {
    return [];
  },
  getSessionsByCategory: () => {
    return [];
  },
  login: () => {
    return "5";
  },
};

module.exports = { mockSchema: schema, mockResolver: resolver };
