const express = require("express")
const mongodb = require('mongodb')

const app = express()
const port = process.env.PORT
const MongoClient = mongodb.MongoClient
const MongoURL = process.env.MONGODB_URL
const options = { useNewUrlParser : true, useUnifiedTopology : true}
const database = "buu"
const collection = "users"

app.use(express.json())

app.post('/register', async (req, res)=>{
    let name = req.body.name
    let email = req.body.email
    let studentId = req.body.studentId
    let password = req.body.password

    const o = {
        name:name,
        email:email,
        studentId:studentId
    }

    const client = await MongoClient.connect( MongoURL, options ).catch((err) => {
        console.log(`Cannot connect to Mongo  ${err}`)
        res.status(500).json({error:err})
        return
    })

    let db = client.db(database)
    let result = await db.collection(collection).insertOne(o).catch(err => {
        console.log(`Cannot insert data to users collection : ${err}`)
        res.status(500).json({error:err})
        return
    })

    res.status(201).json(o)
})


app.listen(3000, () => {
    console.log(`API start at port ${port}`)
})