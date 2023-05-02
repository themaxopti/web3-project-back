const UserModel = require("./models/User.model")
const jwt = require('jsonwebtoken')
const { tokenService } = require("./token.service")

class UserService {
    async getByWallet(wallet, token) {
        const user = await UserModel.findOne({ wallet: wallet })
        if (!user) {
            throw new Error("User is not exist")
        }
        try {
            const userToken = await tokenService.checkUserToken(token, user)
            if (!userToken) {
                throw new Error('Token is not valid')
            }
        } catch (e) {
            throw new Error('Token is not valid')
        }
        return user
    }

    async createNonce() {
        const nonce = new Date().getTime()
        const address = req.query.address

        const tempToken = jwt.sign({ nonce, address }, jwtSecret, { expiresIn: '1d' }) //todo:change
        const message = getSignMessage(address, nonce)

        return { tempToken: message.tempToken, message: message.message }
    }

    async createUser(user) {
        const isUserExist = await UserModel.findOne({ email: user.email })
        if (isUserExist) {
            throw new Error(
                "User with this email is already exist",
            );
        }

        const isUserNameExist = await UserModel.findOne({ userName: user.userName })
        if (isUserNameExist) {
            throw new Error(
                "User with this username is already exist",
            );
        }

        const isUserWalletExist = await UserModel.findOne({ wallet: user.wallet.toLowerCase() })
        if (isUserWalletExist) {
            throw new Error(
                "User with this wallet is already exist",
            );
        }

        const newUser = await UserModel.create({
            wallet: user.wallet.toLowerCase(),
            email: user.email,
            userName: user.userName
        })
        await newUser.save()
        return newUser
    }

    async IsExist(wallet) {
        const user = await UserModel.findOne({ wallet: wallet })
        if (user) {
            return true
        }
        return false
    }
}

const userService = new UserService()
module.exports = { userService }