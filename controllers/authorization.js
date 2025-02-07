const redisClient = require('./signin').redisClient;


const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('unauthorizied')
    }
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('unauthorizied')
        }
        console.log('passing onto other function')
        return next()
    })
}


module.exports = {
    requireAuth: requireAuth
}