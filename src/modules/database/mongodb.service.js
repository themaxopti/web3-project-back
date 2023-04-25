const mongoose = require("mongoose");

class MongodbService {
    initDataBase() {
        try {
            mongoose.connect("mongodb+srv://themaxopti:kJgKLiCWBny7DIWf@cluster0.cg41usv.mongodb.net/?retryWrites=true&w=majority")
            console.log("Connected to MongoDB...");
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    }
}

const mongoDbService = new MongodbService()
module.exports = mongoDbService
