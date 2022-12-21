const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan')


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');
const signout = require('./controllers/signout')



const db = knex({
  // connect to your own database here:
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();
console.log('hello')

app.use(cors())
app.use(morgan('combined'))
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!

app.get('/', (req, res) => { res.send('ITS WORKING') })
app.post('/signin', signin.signInAuthentication(db, bcrypt))

// we can write it like this or how its shown below using dependency injection 
// - this way looks clearner but FOR ME the other way i am able to conceppualize it bc i see it 


app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

app.post('/profile/:id', auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, db)
})

app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })
app.put('/signout', (req, res) => {
  signout.handleSignOut(req, res)
})

app.listen(3000, () => {
  console.log('app is running on port 3000');
})