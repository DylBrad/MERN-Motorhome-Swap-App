const express = require('express')
const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
require('dotenv').config()

const uri = process.env.URI
const PORT = 8000
const app = express()
app.use(cors())
app.use(express.json())

app.get(('/'), (req, res) => {
  res.json('Hello world')
})

// Make post request on handleSubmit() in Auth.js component
app.post(('/signup'), async (req, res) => {
  const client = new MongoClient(uri)  
  const { email, password } = req.body
  const generatedUserId = uuidv4()
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const existingUser = await users.findOne({email})
    if (existingUser) {
      return res.status(409).send('This email is already in use.')
    }

    const sanitisedEmail = email.toLowerCase()

    const data = {
      user_id: generatedUserId,
      email: sanitisedEmail,
      hashed_password: hashedPassword
    }
    const insertedUser = await users.insertOne(data)

    const token = jwt.sign(insertedUser, sanitisedEmail, {
      expiresIn: 60 * 24
    })

    res.status(201).json({ token, userId: generatedUserId })

  } catch (err) {
    console.log(err)
  }
})

app.post('/login', async (req, res) => {
  const client = new MongoClient(uri)  
  const {email, password} = req.body

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const user = await users.findOne({ email })

    const correctPassword = await bcrypt.compare(password, user.hashed_password)

    if (user && correctPassword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24
      })
      res.status(201).json({ token, userId: user.user_id })
    } 
    res.status(400).send('Whoops! Login details incorrect.')
  } catch(err) {
    console.log(err)
  }
})

// get logged in user by UserId 
app.get('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const userId = req.query.userId

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = {user_id: userId}
    const user = await users.findOne(query)
    res.send(user)
  } finally {
    await client.close()
  }
})

app.get('/users', async (req, res) => {
  const client = new MongoClient(uri)
  let userIdsParsed = []
  //const userIdsParsed = await JSON.parse(req.query.userIds)

  //console.log('not parsed', req.query.userIds)

  // wait for actual data to be passed, prevents app crashing. 
   if (req.query.userIds !== undefined) {
    userIdsParsed = JSON.parse(req.query.userIds)
  }  
  
  //console.log('query parsed', userIdsParsed) 

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

     const pipeline = [
      {
        '$match': {
          'user_id': {
            '$in': userIdsParsed
          }
        }
      }
    ]
    const foundUsers = await users.aggregate(pipeline).toArray()

    //console.log('users', foundUsers)

    res.send(foundUsers)  

  } finally {
    await client.close()
  } 
})

// query users based on users location interest. Display corresponding users on dashboard
app.get('/users-location', async (req, res) => {
  const client = new MongoClient(uri)
  const usersLocation = req.query.usersLocation

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = {location: { $eq: usersLocation }}
    const foundUsers = await users.find(query).toArray()

    res.send(foundUsers)
  } finally {
    await client.close()
  }
})

// Query existing user locations in to display in React Select onboarding menu 
app.get('/existing-locations', async (req, res) => {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const foundUsers = await users.find().toArray()
    const locationsArray = foundUsers.map(a => a.location)
    const uniqueLocations = [...new Set(locationsArray)]
    const newArr = []
    // convert user locations array to an array of objects for React Select input
    const obj4 = uniqueLocations.reduce((accumulator, value, index) => {
      newArr.push({...accumulator, [`value`]: value, ['label']: value});
    }, {});

    res.send(newArr)
  } finally {
    await client.close()
  }
})

// update user on onboarding  
app.put('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const formData = req.body.formData

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    
    const query = { user_id: formData.user_id }
    const updateDocument = {
      $set: {
        user_name: formData.user_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        location: formData.location,
        location_interest: formData.location_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches
      },
    }

    const insertedUser = await users.updateOne(query, updateDocument)
    
    res.send(insertedUser)

  } finally {
    await client.close()
  }
})

// adding matches 
app.put('/add-match', async (req, res) => {
  const client = new MongoClient(uri)
  const { userId, matchedUserId } = req.body

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = { user_id: userId }
    const updateDocument = {
      $push: { matches: { user_id: matchedUserId}},
    }
    const user = await users.updateOne(query, updateDocument)
    res.send(user)
  } finally {
    await client.close()
  }
})

app.get('/messages', async (req, res) => {
  const client = new MongoClient(uri)
  const { userId, matchedUserId } = req.query
  
  try {
    await client.connect()
    const database = client.db('app-data')
    const messages  = database.collection('messages')

    const query = {
      from_userId: userId, to_userId: matchedUserId
    }

    const foundMessages = await messages.find(query).toArray()

    res.send(foundMessages)

  } finally {
    await (client.close())
  }

})

app.post('/message', async (req, res) => {
  const client = new MongoClient(uri)
  const message = req.body.message

  try {
    await client.connect()
    const database = client.db('app-data')
    const messages  = database.collection('messages')

    const insertedMessage = await messages.insertOne(message)
    console.log("insterted" + message)
  } finally {
    await (client.close())
  }
})


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))