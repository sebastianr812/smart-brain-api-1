const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);
// when registering a user we must give them a jwt token
// and add it to our database

const signToken = (email) => {
  const jwtPayload = { email }

  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

const createSession = (user) => {
  // create jwt token and reuturn user data with the token as well
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token: token }
    })
    .catch(console.log)

}





const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password, age, pet } = req.body;
  if (!email || !name || !password || !age || !pet) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);





  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
            // loginEmail[0] --> this used to return the email
            // TO
            // loginEmail[0].email --> this now returns the email
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
            age: age,
            pet: pet
          })
          .then(userFromDb => {
            if (userFromDb && userFromDb[0].id) {
              return createSession(userFromDb[0])
            }
          })
          .then(session => res.json(session))

      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => {
      console.log(err)
      res.status(400).json('unable to register')
    })




}

module.exports = {
  handleRegister: handleRegister
};


