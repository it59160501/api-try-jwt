const jwt = require("jsonwebtoken")
const jwtKey = process.env.JWT_KEY

const auth = async (req, res, next) => {
    let token = req.header('Authorization')
    let decoded
    
    try{
        decoded = await jwt.verify(token, jwtKey)
        req.decoded = decoded
        next()
    }catch(err){
        console.log(`Invalid token : ${err}`)
        res.status(401).send({error:err})
        return
    }
}

module.exports = auth