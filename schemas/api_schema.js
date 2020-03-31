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

function strip_null(obj) {
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
  return obj;
}

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
    User(id: ID!): User
    Session(id: ID!): Session
    FrontSessions(start: Int!, count: Int!): [Session!]!
    Categories: [Category!]!
    SessionsByCategory(category: ID!, start: Int!, count: Int!): [Session!]
    SessionsByUser(username: String!, start: Int!, count: Int!): [Session!]
    ResessionsByCategory(category: ID!, start: Int!, count: Int!): [Resession!]
    ResessionsByUser(username: String!, start: Int!, count: Int!): [Resession!]
}

type Mutation {
    createSession(user_token: ID!, title: String!, category: ID!): Session
    editSession(user_token: ID!, session_id: ID!, title: String, description: String, category: ID, tags: String, start_date: Date, end_date: Date, 
                 capacity: Int, attendees: Int, platform: Platform, platform_media_id: String, img_source: String): Boolean!
    deleteSession(user_token: ID!, session_id: ID): Boolean!
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
      Session: (parnet, { id }, { db }, info) => db.Session.findByPk(id),
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
      editSession: async (
        parent,
        {
          user_token,
          session_id,
          title,
          description,
          category,
          tags,
          start_date,
          end_date,
          capacity,
          attendees,
          platform,
          platform_media_id,
          img_source,
        },
        { db },
        info
      ) => {
        // TODO: sanitize the date (end > start)
        const user_id = check_auth(user_token);
        const affected_rows = (
          await db.Session.update(
            strip_null({
              title: title,
              description: description,
              category: category,
              tags: tags,
              start_date: start_date,
              end_date: end_date,
              capacity: capacity,
              attendees: attendees,
              platform: platform,
              platform_media_id: platform_media_id,
              img_source: img_source,
            }),
            {
              where: { id: session_id, user_id: user_id },
            }
          )
        )[0];

        return affected_rows === 1;
      },

      // TODO: Implement resession
      // No planned front end support for now
      // editResession: (parent, args, { db }, info) => true,
      // editResession: (parent, args, { db }, info) => true,

      // TODO: Implement deletion (decide on a deleted bit vs different table)
      // This is not important enough for the demo
      // deleteSession: (parent, args, { db }, info) => true,
      // deleteResession: (parent, args, { db }, info) => true,

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
