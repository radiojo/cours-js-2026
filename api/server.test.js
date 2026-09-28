const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-secret-for-api-tests'
process.env.DATABASE_PATH = path.join(os.tmpdir(), `mini-glpi-${process.pid}.sqlite`)

const request = require('supertest')
const { initializeDatabase, dataSource } = require('./db')
const { app, configureRepositories } = require('./server')

async function login(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password })

  return response.body.token
}

describe('mini glpi api', () => {
  beforeAll(async () => {
    if (fs.existsSync(process.env.DATABASE_PATH)) fs.unlinkSync(process.env.DATABASE_PATH)
    const source = await initializeDatabase()
    configureRepositories(source)
  })

  afterAll(async () => {
    if (dataSource.isInitialized) await dataSource.destroy()
    for (const suffix of ['', '-shm', '-wal']) {
      const filePath = `${process.env.DATABASE_PATH}${suffix}`
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
  })

  test('keeps the health route public', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body.ok).toBe(true)
  })

  test('rejects a business route without a token', async () => {
    const response = await request(app).get('/api/tickets')

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('jeton invalide ou absent')
  })

  test('rejects invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ines@example.test', password: 'mauvais-mot-de-passe' })

    expect(response.status).toBe(401)
  })

  test('logs in a user without returning the password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ines@example.test', password: 'user123!' })

    expect(response.status).toBe(200)
    expect(response.body.token).toEqual(expect.any(String))
    expect(response.body.utilisateur.role).toBe('user')
    expect(response.body.utilisateur.passwordHash).toBeUndefined()
  })

  test('an authenticated user can read tickets', async () => {
    const token = await login('ines@example.test', 'user123!')
    const response = await request(app)
      .get('/api/tickets')
      .set('authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(4)
  })

  test('a user cannot update a ticket', async () => {
    const token = await login('ines@example.test', 'user123!')
    const response = await request(app)
      .patch('/api/tickets/1')
      .set('authorization', `Bearer ${token}`)
      .send({ statut: 'fermé' })

    expect(response.status).toBe(403)
  })

  test('a technician can update a ticket status', async () => {
    const token = await login('pierre@example.test', 'tech123!')
    const response = await request(app)
      .patch('/api/tickets/1')
      .set('authorization', `Bearer ${token}`)
      .send({ statut: 'en cours' })

    expect(response.status).toBe(200)
    expect(response.body.statut).toBe('en cours')
  })

  test('a user can create a ticket for themselves', async () => {
    const token = await login('ines@example.test', 'user123!')
    const response = await request(app)
      .post('/api/tickets')
      .set('authorization', `Bearer ${token}`)
      .send({
        titre: 'imprimante indisponible',
        description: 'la file d’impression est bloquée',
        equipementId: 3
      })

    expect(response.status).toBe(201)
    expect(response.body.titre).toBe('imprimante indisponible')
    expect(response.body.utilisateurId).toBe(3)
  })
})

