const redisClient = require('./signin').redisClient;



const handleSignOut = (req, res) => {
    if (req.body) {
        try {
            const { authorization } = req.headers
            redisClient.del(authorization, (err, reply) => {
                if (reply === 1) {
                    res.json('success ready to delete window session')
                } else {
                    res.status(400).json('cannot delete in database')
                }
            })
        }
        catch (err) {
            if (err) {
                res.status(400).json('error with request')
            }
        }
    }
    return

}

module.exports = {
    handleSignOut: handleSignOut
}