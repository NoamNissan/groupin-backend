var { makeExecutableSchema } = require('graphql-tools');
var errors = require('./api_schema_errors').errorName;

function strip_null(obj) {
    Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
    return obj;
}

function check_auth(user) {
    if (!user) {
        throw new Error(errors.UNLOGGED_USER);
    }
}

// Don't return more than MAX_SESSIONS_COUNT sessions in a single request!
const MAX_SESSIONS_COUNT = 50;

function check_sessions_count(count) {
    if (count > MAX_SESSIONS_COUNT) {
        throw new Error(errors.COUNT_TOO_HIGH);
    }
}

// IDK if User needs to export more stuff, fit it to your needs (OAuth)
const schema = makeExecutableSchema({
    typeDefs: [
        `
scalar Date

type UserDetailed {
    id: ID!
    email: String!
    display_name: String!
    is_admin: String
    is_premium: String
    img_source: String
}

type User {
    id: ID!
    display_name: String!
    img_source: String
}

enum Platform {
    ZOOM
}

type Session {
    id: ID!
    user_id: ID!
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
    user_id: ID!
}

type Query {
    hello: String
    User(id: ID!): User
    UserDetailed: UserDetailed
    Session(id: ID!): Session
    FrontSessions(start: Int!, count: Int!): [Session!]!
    Categories: [Category!]!
    SessionsByCategory(category: ID!, start: Int!, count: Int!): [Session!]
    SessionsByUser(user_id: ID!, start: Int!, count: Int!): [Session!]
    ResessionsByCategory(category: ID!, start: Int!, count: Int!): [Resession!]
    ResessionsByUser(user_id: ID!, start: Int!, count: Int!): [Resession!]
}

type Mutation {
    createSession(title: String!, category: ID!): Session
    editSession(session_id: ID!, title: String, description: String, category: ID, tags: String, start_date: Date, end_date: Date, 
                 capacity: Int, attendees: Int, platform: Platform, platform_media_id: String, img_source: String): Boolean
    deleteSession(session_id: ID): Boolean
}
`
    ],
    resolvers: {
        Query: {
            // A Stub, currently, fix when implementing login / register
            User: (parent, { id }, { db }, info) => {
                return db.User.findByPk(id);
            },
            UserDetailed: (parent, args, { user }, info) => {
                check_auth(user);

                return user;
            },
            Session: (parnet, { id }, { db }, info) => db.Session.findByPk(id),
            Categories: (parent, args, { db }, info) => db.Category.findAll(),
            FrontSessions: (parent, { start, count }, { db }, info) => {
                check_sessions_count(count);
                return db.Session.findAll({ offset: start, limit: count });
            },
            SessionsByUser: (parent, { id, start, count }, { db }, info) => {
                check_sessions_count(count);
                return db.Session.findAll({
                    where: { user_id: id },
                    limit: count
                });
            },
            SessionsByCategory: (
                parent,
                { category, start, count },
                { db },
                info
            ) => {
                check_sessions_count(count);
                return db.Session.findAll({
                    where: { category: category },
                    limit: count
                });
            },
            ResessionsByUser: (
                parent,
                { user_id, start, count },
                { db },
                info
            ) => {
                check_sessions_count(count);
                return db.Resession.findAll({
                    where: { user_id: user_id },
                    limit: count
                });
            },
            ResessionsByCategory: (
                parent,
                { category, start, count },
                { db },
                info
            ) => {
                check_sessions_count(count);
                return db.Resession.findAll({
                    where: { category: category },
                    limit: count
                });
            }
        },
        Mutation: {
            createSession: (
                parent,
                { title, category },
                { db, user },
                info
            ) => {
                check_auth(user);

                const tomorrow = new Date();
                tomorrow.setDate(new Date().getDate() + 1);
                return db.Session.create({
                    user_id: user.id,
                    title: title,
                    category: category,
                    start_date: tomorrow,
                    end_date: tomorrow
                });
            },
            editSession: async (
                parent,
                {
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
                    img_source
                },
                { db, user },
                info
            ) => {
                // TODO: sanitize the date (end > start)
                check_auth(user);

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
                            img_source: img_source
                        }),
                        {
                            where: { id: session_id, user_id: user.id }
                        }
                    )
                )[0];

                return affected_rows === 1;
            }

            // TODO: Implement resession
            // No planned front end support for now
            // editResession: (parent, args, { db }, info) => true,
            // editResession: (parent, args, { db }, info) => true,

            // TODO: Implement deletion (decide on a deleted bit vs different table)
            // This is not important enough for the demo
            // deleteSession: (parent, args, { db }, info) => true,
            // deleteResession: (parent, args, { db }, info) => true,
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
            }
        }
    }
});

module.exports = schema;
