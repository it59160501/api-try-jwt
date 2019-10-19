const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const MongoURL = process.env.MONGODB_URL
const options = { useNewUrlParser : true, useUnifiedTopology : true}
const database = "buu"
const collection = "users"

module.exports = (async () =>{
    const client = await MongoClient.connect( MongoURL, options )

    return client
})()