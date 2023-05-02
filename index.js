const express = require('express')
const schema = require('./src/graphql/server')
const mongoDbService = require('./src/modules/database/mongodb.service');
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { ApolloServer } = require('@apollo/server');
const http = require('http');
const cors = require('cors');
const { userTypeDefs, userResolvers } = require('./src/modules/user/user.controller');
const bodyParser = require('body-parser')
const app = express()
const httpServer = http.createServer(app);
const port = 3000

async function startServer() {

    const typeDefs = `#graphql
        type Query {
            hello(value:String!): String
            good: String!
        }
        type Mutation {
            createHello(value:String!): String
        }
    `;


    const exmp = ['1', "2", "4"]
    const resolvers = {
        Query: {
            hello: (parent, args) => {
                return exmp.find(el => el == args.value)
            },
            good: (parent, args) => {
                return 'test string'
            }
        },
        Mutation: {
            createHello: (parent, args) => {
                return args.value
            }
        }
    };

    const apolloServer = new ApolloServer({
        typeDefs: userTypeDefs,
        resolvers: userResolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await apolloServer.start()

    const context = (ctx) => ctx;
    app.use(
        bodyParser.json(),
        cors({ origin: 'http://localhost:3001' }),
        expressMiddleware(apolloServer, { context })
    )

    mongoDbService.initDataBase()

    httpServer.listen(port, () => {
        console.log(`Server has been started on port ${port}`)
    })
}

startServer()