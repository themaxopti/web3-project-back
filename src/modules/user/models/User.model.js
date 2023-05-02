const { Schema, model, Types } = require('mongoose')


const schema = new Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    wallet: { type: String, required: true, unique: true },
    token: { type: String, required: false, default: null },
})

module.exports = model('User', schema) 