const jwt = require('jsonwebtoken')

module.exports.checkAuth = (req, res, next) => {
  let token = req.headers['authorization']
  token = token.split(' ')[1] // Access token

  jwt.verify(token, 'access', (err, user) => {
    if (!err) {
      req.user = user
      next()
    } else {
      return res.status(403).json({ message: 'User not authenticated' })
    }
  })
}
