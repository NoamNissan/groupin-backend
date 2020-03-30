var { makeExecutableSchema } = require("graphql-tools");
var FormatError = require("easygraphql-format-error");

// Don't return more than MAX_SESSIONS_COUNT sessions in a single request!
const MAX_SESSIONS_COUNT = 50;

const errors = new FormatError([
  {
    name: "COUNT_TOO_HIGH",
    message: "The passed count value is too high",
    statusCode: 400,
  },
]).errorName;

// TODO: remove when login is implemented
// TODO: all instances of user_token should be swapped with some real login auth token
const USER_AUTHENTICATED = true;

const schema = makeExecutableSchema({
  typeDefs: [
    `
scalar Date

type User {
    username: String!
    email: String
    display_name: String
    is_admin: String
    is_premium: String
}

enum Platform {
    ZOOM
    FACEBOO
}

type Session {
    id: ID!
    username: String!
    title: String!
    description: String
    category: ID!
    tags: String!
    start_date: Date!
    end_date: Date!
    capacity: Int
    attendees: Int
    platform: Platform!
    platform_media_id: String!
    img_source: String
    resession_id: ID
}

type Category {
    id: ID!
    name: String!
    default_img: String!
}

enum ReccurenceFreq {
    DAILY
    WEEKLY
    MONTHLY
}

type Resession {
    id: ID!
    title: String!
    description: String
    recurrence_freq: ReccurenceFreq
    username: String!
}

type Query {
    hello: String
    user(id: ID): User
    getFrontSessions(start: Int!, count: Int!): [Session!]!
    getCategories: [Category!]!
    getSessionsByCategory(category: ID!, start: Int!, count: Int!): [Session!]
    getSessionsByUser(username: String!, start: Int!, count: Int!): [Session!]
    getResessionsByCategory(category: ID!, start: Int!, count: Int!): [Resession!]
    getResessionsByUser(username: String!, start: Int!, count: Int!): [Resession!]
}

type Mutation {
    createSession(user_token: ID!, title: String!, categiry: ID!): ID
    createResession(user_token: ID!, title: String): ID
    editSession(user_token: ID!, session_id: ID!, title: String, description: String, category: ID, tags: String, start_date: Date, end_date: Date, 
                 capacity: Int, attendees: Int, platform: Platform, platform_media_id: String, img_source: String, resession_id: ID): Boolean
    editResession(user_token: ID!, resession_id: ID!, title: String, description: String, recurrence_freq: ReccurenceFreq): Boolean
    deleteSession(user_token: ID!, session_id: ID): Boolean!
    deleteResession(user_token: ID!, resession_id: ID): Boolean!
}
`,
  ],
  resolvers: {
    Query: {
      // Hello is left for sanity, TODO remove when saner
      hello: () => "Hello world!",
      // A Stub, currently, fix when implementing login / register
      user: () => ({
        id: "5",
        name: "Johnny Test",
        email: "billgates@google.com",
      }),
      getCategories: (parent, args, { db }, info) => db.Category.findAll(),
      getFrontSessions: (parent, { start, count }, { db }, info) => {
        if (count > MAX_SESSIONS_COUNT) {
          throw new Error(errors.COUNT_TOO_HIGH);
        }
        return db.Session.findAll({ offset: start, limit: count });
      },
      getSessionsByUser: (parent, { username, start, count }, { db }, info) => {
        if (count > MAX_SESSIONS_COUNT) {
          throw new Error(errors.COUNT_TOO_HIGH);
        }
        return db.Session.findAll({
          where: { username: { [Op.eq]: username } },
        });
      },
      getSessionsByCategory: (
        parent,
        { category, start, count },
        { db },
        info
      ) => {
        if (count > MAX_SESSIONS_COUNT) {
          throw new Error(errors.COUNT_TOO_HIGH);
        }
        return db.Session.findAll({
          where: { category: { [Op.eq]: category } },
        });
      },
      getResessionsByUser: (
        parent,
        { username, start, count },
        { db },
        info
      ) => {
        if (count > MAX_SESSIONS_COUNT) {
          throw new Error(errors.COUNT_TOO_HIGH);
        }
        return db.Resession.findAll({
          where: { username: { [Op.eq]: username } },
        });
      },
      getResessionsByCategory: (
        parent,
        { category, start, count },
        { db },
        info
      ) => {
        if (count > MAX_SESSIONS_COUNT) {
          throw new Error(errors.COUNT_TOO_HIGH);
        }
        return db.Resession.findAll({
          where: { category: { [Op.eq]: category } },
        });
      },
      // TODO: Implement login
      // login: () => {
      //   return "5";
      // },
    },
    Mutation: {
      createSession: (parent, args, { db }, info) => true,
      createResession: (parent, args, { db }, info) => true,
      deleteSession: (parent, args, { db }, info) => true,
      deleteResession: (parent, args, { db }, info) => true,
      // TODO: Implement register
      // register: (parent, args, { db }, info) => {
      //   return true;
      // },
    },
    Date: {
      __parseValue(value) {
        return new Date(value); // value from the client
      },
      __serialize(value) {
        return value.getTime(); // value sent to the client
      },
      __parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }
        return null;
      },
    },
  },
});

module.exports = { schema };
