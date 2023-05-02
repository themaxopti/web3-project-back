const jwt = require('jsonwebtoken');
const { userService } = require('./userService');
const { tokenService } = require('./token.service');

const userTypeDefs = `#graphql

        type CreateNonceRes {
            tempToken:String!
            message:String!
        }
        type User {
            id:ID
            userName:String!
            wallet:String!
            email:String!
        }
        type Query {
            getUserByWallet(wallet:String!): User!
            checkIfUserExist(wallet:String!): Boolean!
            secret:String!
            nonce(address:String!):CreateNonceRes!
            verify(signature:String!):String!
        }
        type Mutation {
            createUser(user:UserInput!): User!
        }
        input UserInput {
            userName:String!
            email:String!
            wallet:String!
        }
    `;

const userResolvers = {
    Query: {
        getUserByWallet: async (parent, args, ctx) => {
            const authHeader = ctx.req.headers['authorization']
            const token = authHeader && authHeader.split(" ")[1]
            const user = await userService.getByWallet(args.wallet.toLowerCase(), token)
            return {
                id: user.id,
                userName: user.userName,
                wallet: user.wallet,
                email: user.email
            }
        },
        checkIfUserExist: async (parent, args) => {
            const user = await userService.getByWallet('111')
            return {
                id: '2',
                userName: 'hello',
                wallet: '1312312',
                email: 'email'
            }
        },
        secret: async ({ req }) => {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            const authData = await jwt.verify()
            return authData
        },
        nonce: async (parent, args) => {
            const nonce = await tokenService.createNonce(args.address)
            return nonce
        },
        verify: async (parent, args, ctx, an) => {
            const authHeader = ctx.req.headers['authorization']
            const tempToken = authHeader && authHeader.split(" ")[1]
            // console.log(tempToken, args.signature);
            const token = await tokenService.verifyToken(args.signature, tempToken)
            return token
        },

    },
    Mutation: {
        createUser: async (parent, args) => {
            const user = await userService.createUser(args.user)
            return {
                id: user.id,
                email: user.email,
                wallet: user.wallet,
                userName: user.userName
            }
        }
    }
};

module.exports = {
    userResolvers,
    userTypeDefs
}