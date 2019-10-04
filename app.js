const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()
// JWT Secret Key it should be in Environment file
const jwtSecretKey = 'secretkey'

app.get('/api', (req, res) => {
  res.json({
    message: 'welcome'
  })
})

app.post('/api/login', (req, res) => {
  // Mock User
  const User = {
    id: 1,
    email: 'foo@email.com'
  }
  // the token will expire in 1 Hour
  jwt.sign({ user: User }, jwtSecretKey, { expiresIn: '1h' }, (err, token) => {
    if (!err) {
      res.json({
        token: token
      })
    }
  })
})

app.post('/api/post', tokenMiddleware, (req, res) => {
  // verify token from Request Header
  jwt.verify(req.token, jwtSecretKey, (err, authData) => {
    if (err) {
      // 401 "Unauthorized error" is HTTP status code
      res.status(401).json({
        isError: true,
        message: 'invalid Token'
      })
    } else {
      // 200 "OK success" is HTTP status code
      res.status(200).json({
        isError: false,
        message: 'Posted...',
        authData: authData
      })
    }
  })
})


function tokenMiddleware (req, res, next) {
  // get auth header value
  const bearerHeader = req.headers.authorization
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Spilt at the space
    const bearer = bearerHeader.split(' ')
    // get token from array
    const bearerToken = bearer[1]
    // set the token in request
    req.token = bearerToken
    // Call Next middleware
    next()
  } else {
    // Forbidden, if token not found
    res.status(401).json({
      isError: true,
      message: 'Token Not Found'
    })
  }
}

app.listen(5000, () => console.log('Server Started on Port 5000'))
