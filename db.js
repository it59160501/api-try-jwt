const mongodb = require('mongodb')
const { MongoURL } = require('./config')

const MongoClient = mongodb.MongoClient
const options = { useNewUrlParser : true, useUnifiedTopology : true}


module.exports = (async () =>{
    const client = await MongoClient.connect( MongoURL, options )

    return client
})()