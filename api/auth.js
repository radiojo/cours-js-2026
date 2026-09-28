const crypto = require('node:crypto')
const jwt = require('jsonwebtoken')
const { expressjwt } = require('express-jwt')

const jwtSecret = process.env.JWT_SECRET || 'mini-glpi-development-secret-change-me'
const issuer = 'mini-glpi-api'

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET est obligatoire en production')
}

const jwtMiddleware = expressjwt({
  secret: jwtSecret,
  algorithms: ['HS256'],
  issuer
})

function verifyPassword(password, user) {
  if (typeof password !== 'string' || !user?.passwordHash || !user?.passwordSalt) return false

  const candidate = crypto.scryptSync(password, user.passwordSalt, 64)
  const expected = Buffer.from(user.passwordHash, 'hex')

  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected)
}

function createToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role },
    jwtSecret,
    { expiresIn: '2h', issuer }
  )
}

function authenticate(request, response, next) {
  jwtMiddleware(request, response, async error => {
    if (error) return next(error)

    try {
      const userId = Number(request.auth.sub)
      const user = await request.app.locals.repositories.utilisateur.findOneBy({ id: userId })
      if (!user) return response.status(401).json({ error: 'utilisateur introuvable' })

      request.user = { id: user.id, nom: user.nom, email: user.email, role: user.role }
      next()
    } catch (loadError) {
      next(loadError)
    }
  })
}

function requireRole(...roles) {
  return (request, response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return response.status(403).json({ error: 'droits insuffisants' })
    }
    next()
  }
}

module.exports = { authenticate, createToken, requireRole, verifyPassword }
