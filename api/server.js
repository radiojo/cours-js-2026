require('dotenv').config({ quiet: true })

const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const { initializeDatabase } = require('./db')
const { authenticate, createToken, requireRole, verifyPassword } = require('./auth')
const { Utilisateur, Equipement, Ticket } = require('./entities')

const app = express()
const port = Number(process.env.PORT) || 3000
const allowedStatuses = ['ouvert', 'en cours', 'fermé']
const allowedPriorities = ['basse', 'moyenne', 'haute']
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'trop de tentatives de connexion, réessayez plus tard' }
})

app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '32kb' }))
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['content-type', 'authorization']
}))
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }))
app.use((request, response, next) => {
  request.setTimeout(10_000)
  next()
})

function parseId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text && text.length <= maxLength ? text : null
}

function publicUser(user) {
  return { id: user.id, nom: user.nom, email: user.email, role: user.role }
}

function publicEquipment(equipment) {
  return {
    id: equipment.id,
    nom: equipment.nom,
    numeroSerie: equipment.numeroSerie,
    utilisateurId: equipment.utilisateur?.id ?? null,
    utilisateurNom: equipment.utilisateur?.nom ?? null
  }
}

function publicTicket(ticket) {
  return {
    id: ticket.id,
    titre: ticket.titre,
    description: ticket.description,
    statut: ticket.statut,
    priorite: ticket.priorite,
    utilisateurId: ticket.utilisateur.id,
    utilisateurNom: ticket.utilisateur.nom,
    equipementId: ticket.equipement.id,
    equipementNom: ticket.equipement.nom,
    equipementNumeroSerie: ticket.equipement.numeroSerie,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt
  }
}

function ticketRelations() {
  return { utilisateur: true, equipement: true }
}

app.get('/api/health', (request, response) => response.json({ ok: true, service: 'mini-glpi-api' }))

app.post('/api/auth/login', loginLimiter, async (request, response, next) => {
  try {
    const email = cleanText(request.body?.email, 254)?.toLowerCase()
    const password = request.body?.password
    if (!email || typeof password !== 'string' || password.length > 128) {
      return response.status(400).json({ error: 'email ou mot de passe invalide' })
    }

    const user = await request.app.locals.repositories.utilisateur.findOneBy({ email })
    if (!user || !verifyPassword(password, user)) {
      return response.status(401).json({ error: 'identifiants invalides' })
    }

    response.json({ token: createToken(user), utilisateur: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

app.use('/api', authenticate)

app.get('/api/me', (request, response) => response.json({ utilisateur: request.user }))

app.get('/api/utilisateurs', async (request, response, next) => {
  try {
    const users = await request.app.locals.repositories.utilisateur.find({ order: { nom: 'ASC' } })
    response.json(users.map(publicUser))
  } catch (error) {
    next(error)
  }
})

app.get('/api/equipements', async (request, response, next) => {
  try {
    const equipment = await request.app.locals.repositories.equipement.find({
      relations: { utilisateur: true },
      order: { nom: 'ASC' }
    })
    response.json(equipment.map(publicEquipment))
  } catch (error) {
    next(error)
  }
})

app.get('/api/tickets', async (request, response, next) => {
  try {
    const { statut, priorite, q } = request.query
    if (statut && !allowedStatuses.includes(statut)) return response.status(400).json({ error: 'statut invalide' })
    if (priorite && !allowedPriorities.includes(priorite)) return response.status(400).json({ error: 'priorité invalide' })
    const search = typeof q === 'string' ? q.trim().slice(0, 100).toLowerCase() : ''

    const tickets = await request.app.locals.repositories.ticket.find({
      relations: ticketRelations(),
      order: { createdAt: 'DESC' }
    })
    const filtered = tickets.filter(ticket =>
      (!statut || ticket.statut === statut) &&
      (!priorite || ticket.priorite === priorite) &&
      (!search || `${ticket.titre} ${ticket.description}`.toLowerCase().includes(search))
    )
    response.json(filtered.map(publicTicket))
  } catch (error) {
    next(error)
  }
})

app.get('/api/tickets/:id', async (request, response, next) => {
  try {
    const id = parseId(request.params.id)
    if (!id) return response.status(400).json({ error: 'identifiant invalide' })
    const ticket = await request.app.locals.repositories.ticket.findOne({ where: { id }, relations: ticketRelations() })
    if (!ticket) return response.status(404).json({ error: 'ticket introuvable' })
    response.json(publicTicket(ticket))
  } catch (error) {
    next(error)
  }
})

app.post('/api/tickets', requireRole('user', 'technicien', 'admin'), async (request, response, next) => {
  try {
    const titre = cleanText(request.body?.titre, 120)
    const description = cleanText(request.body?.description, 2_000)
    const statut = request.body?.statut ?? 'ouvert'
    const priorite = request.body?.priorite ?? 'moyenne'
    const utilisateurId = parseId(request.body?.utilisateurId) || request.user.id
    const equipementId = parseId(request.body?.equipementId)

    if (!titre || !description) return response.status(400).json({ error: 'titre et description sont obligatoires' })
    if (!allowedStatuses.includes(statut) || !allowedPriorities.includes(priorite)) return response.status(400).json({ error: 'statut ou priorité invalide' })
    if (request.user.role === 'user' && utilisateurId !== request.user.id) return response.status(403).json({ error: 'un utilisateur ne peut créer un ticket que pour lui-même' })

    const utilisateur = await request.app.locals.repositories.utilisateur.findOneBy({ id: utilisateurId })
    const equipement = await request.app.locals.repositories.equipement.findOneBy({ id: equipementId })
    if (!utilisateur || !equipement) return response.status(400).json({ error: 'utilisateur ou équipement invalide' })

    const ticket = await request.app.locals.repositories.ticket.save({ titre, description, statut, priorite, utilisateur, equipement })
    const result = await request.app.locals.repositories.ticket.findOne({ where: { id: ticket.id }, relations: ticketRelations() })
    response.status(201).json(publicTicket(result))
  } catch (error) {
    next(error)
  }
})

app.patch('/api/tickets/:id', requireRole('technicien', 'admin'), async (request, response, next) => {
  try {
    const id = parseId(request.params.id)
    if (!id) return response.status(400).json({ error: 'identifiant invalide' })
    const ticketRepository = request.app.locals.repositories.ticket
    const ticket = await ticketRepository.findOne({ where: { id }, relations: ticketRelations() })
    if (!ticket) return response.status(404).json({ error: 'ticket introuvable' })

    const updates = {}
    if (request.body?.titre !== undefined) updates.titre = cleanText(request.body.titre, 120)
    if (request.body?.description !== undefined) updates.description = cleanText(request.body.description, 2_000)
    if (request.body?.statut !== undefined) updates.statut = request.body.statut
    if (request.body?.priorite !== undefined) updates.priorite = request.body.priorite
    if (Object.values(updates).some(value => value === null)) return response.status(400).json({ error: 'champ invalide' })
    if (updates.statut && !allowedStatuses.includes(updates.statut)) return response.status(400).json({ error: 'statut invalide' })
    if (updates.priorite && !allowedPriorities.includes(updates.priorite)) return response.status(400).json({ error: 'priorité invalide' })
    if (Object.keys(updates).length === 0) return response.status(400).json({ error: 'aucun champ à modifier' })

    await ticketRepository.update(id, updates)
    const updated = await ticketRepository.findOne({ where: { id }, relations: ticketRelations() })
    response.json(publicTicket(updated))
  } catch (error) {
    next(error)
  }
})

app.use((request, response) => response.status(404).json({ error: 'route introuvable' }))
app.use((error, request, response, next) => {
  if (error.name === 'UnauthorizedError') {
    return response.status(401).json({ error: 'jeton invalide ou absent' })
  }
  console.error(error)
  response.status(500).json({ error: 'erreur interne du serveur' })
})

function configureRepositories(dataSource) {
  app.locals.repositories = {
    utilisateur: dataSource.getRepository(Utilisateur),
    equipement: dataSource.getRepository(Equipement),
    ticket: dataSource.getRepository(Ticket)
  }
}

async function start() {
  const dataSource = await initializeDatabase()
  configureRepositories(dataSource)
  const server = app.listen(port, () => console.log(`mini glpi api disponible sur http://localhost:${port}`))

  function stop() {
    server.close(async () => {
      if (dataSource.isInitialized) await dataSource.destroy()
      process.exit(0)
    })
  }

  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
}

if (require.main === module) {
  start().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

module.exports = { app, configureRepositories, start }
