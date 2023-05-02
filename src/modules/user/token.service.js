const UserModel = require("./models/User.model")
const jwt = require('jsonwebtoken')
const Web3 = require('web3')
const web3 = new Web3('https://cloudflare-eth.com/')
const jwtSecret = 'some very secret value'
const bcrypt = require('bcryptjs')


class TokenService {
    async checkUserToken(token, user) {
        try {
            if (!token) {
                throw new Error('User is not exist')
            }
            const userData = await jwt.verify(token, jwtSecret)
            const isTokenFit = await bcrypt.compare(token, user.token)
            if (!isTokenFit) {
                throw new Error('Unauthorized')
            }
            return true
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async updateUserToken(user) {
        try {
            const token = jwt.sign({ nonce, address }, jwtSecret, { expiresIn: '1d' })
            user.token = bcrypt.hash(token, 12)
            await user.save()
        } catch (e) {
            throw new Error('Unauthorized')
        }
    }

    async createNonce(address) {
        const nonce = new Date().getTime()

        const tempToken = jwt.sign({ nonce, address }, jwtSecret, { expiresIn: '1d' })
        const message = this.getSignMessage(address, nonce)

        return { tempToken, message }
    }

    async verifyToken(signature, tempToken) {
        if (tempToken === null) throw new Error('Not found')
        const userData = await jwt.verify(tempToken, jwtSecret)
        const nonce = userData.nonce
        const address = userData.address
        const message = this.getSignMessage(address, nonce)
        const verifiedAddress = await web3.eth.accounts.recover(message, signature)
        console.log(verifiedAddress);
        if (verifiedAddress.toLowerCase() == address.toLowerCase()) {
            const token = jwt.sign({ verifiedAddress }, jwtSecret, { expiresIn: '60s' })
            const user = await UserModel.findOne({ wallet: verifiedAddress.toLowerCase() })
            if (user) {
                user.token = await bcrypt.hash(token, 12)
                await user.save()
            }
            return token
        } else {
            throw new Error('error')
        }
    }

    getSignMessage = (address, nonce) => {
        return `Please sign this message for address ${address}:\n\n${nonce}`
    }

}

const tokenService = new TokenService()
module.exports = { tokenService }