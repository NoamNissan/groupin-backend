var { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var resolver = {
  hello: () => {
    return "Hello world!";
  },
};

module.exports = { mockSchema: schema, mockResolver: resolver };
