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

function check_auth(token) {
  if (USER_AUTHENTICATED) {
    // TODO: switch to the real user id
    return "1";
  }

  throw new Error(errors.UNAUTHORIZED);
}

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
    default_img: String
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
    User(id: ID): User
    FrontSessions(start: Int!, count: Int!): [Session!]!
    Categories: [Category!]!
    SessionsByCategory(category: ID!, start: Int!, count: Int!): [Session!]
    SessionsByUser(username: String!, start: Int!, count: Int!): [Session!]
    ResessionsByCategory(category: ID!, start: Int!, count: Int!): [Resession!]
    ResessionsByUser(username: String!, start: Int!, count: Int!): [Resession!]
}

type Mutation {
    createSession(user_token: ID!, title: String!, category: ID!): Session
    createResession(user_token: ID!, title: String): Session
    editSession(user_token: ID!, session_id: ID!, title: String, description: String, category: ID, tags: String, start_date: Date, end_date: Date, 
                 capacity: Int, attendees: Int, platform: Platform, platform_media_id: String, img_source: String, resession_id: ID): Session
    editResession(user_token: ID!, resession_id: ID!, title: String, description: String, recurrence_freq: ReccurenceFreq): Session
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
      User: () => ({
        id: "5",
        name: "Johnny Test",
        email: "billgates@google.com",
      }),
      Categories: (parent, args, { db }, info) => db.Category.findAll(),
      FrontSessions: (parent, { start, count }, { db }, info) => {
        if (count > MAX_SESSIONS_COUNT) {
          throw new Error(errors.COUNT_TOO_HIGH);
        }
        return db.Session.findAll({ offset: start, limit: count });
      },
      SessionsByUser: (parent, { username, start, count }, { db }, info) => {
        if (count > MAX_SESSIONS_COUNT) {
          throw new Error(errors.COUNT_TOO_HIGH);
        }
        return db.Session.findAll({
          where: { username: { [Op.eq]: username } },
        });
      },
      SessionsByCategory: (
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
      ResessionsByUser: (parent, { username, start, count }, { db }, info) => {
        if (count > MAX_SESSIONS_COUNT) {
          throw new Error(errors.COUNT_TOO_HIGH);
        }
        return db.Resession.findAll({
          where: { username: { [Op.eq]: username } },
        });
      },
      ResessionsByCategory: (
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
      createSession: (
        parent,
        { user_token, title, category },
        { db },
        info
      ) => {
        const user_id = check_auth(user_token);
        const tomorrow = new Date();
        tomorrow.setDate(new Date().getDate() + 1);
        return db.Session.create({
          user_id: user_id,
          title: title,
          category: category,
          start_date: tomorrow,
          end_date: tomorrow,
        });
      },
      editSession: (parent, args, { db }, info) => true,

      // TODO: Implement
      editResession: (parent, args, { db }, info) => true,
      editResession: (parent, args, { db }, info) => true,

      // TODO: Implement deletion (decide on a deleted bit vs different table)
      // This is not important enough for the demo
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
