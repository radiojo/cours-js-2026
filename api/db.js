require('dotenv').config({ quiet: true })

const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const { DataSource } = require('typeorm')
const { Utilisateur, Equipement, Ticket } = require('./entities')

const defaultDataDirectory = path.join(__dirname, '..', 'data')
const databasePath = process.env.DATABASE_PATH || path.join(defaultDataDirectory, 'glpi.sqlite')
const dataDirectory = path.dirname(databasePath)

fs.mkdirSync(dataDirectory, { recursive: true })

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const passwordHash = crypto.scryptSync(password, salt, 64).toString('hex')
  return { passwordHash, passwordSalt: salt }
}

const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: databasePath,
  entities: [Utilisateur, Equipement, Ticket],
  synchronize: true,
  logging: false
})

async function seed() {
  const utilisateurRepository = dataSource.getRepository(Utilisateur)
  const existingUsers = await utilisateurRepository.find()

  if (existingUsers.length > 0) {
    const demoAccounts = [
      { email: 'noémie@example.test', role: 'admin', password: 'admin123!' },
      { email: 'pierre@example.test', role: 'technicien', password: 'tech123!' },
      { email: 'ines@example.test', role: 'user', password: 'user123!' },
      { email: 'sam@example.test', role: 'user', password: 'user123!' }
    ]

    for (const user of existingUsers) {
      const account = demoAccounts.find(item => item.email === user.email)
      if (account && (!user.passwordHash || !user.passwordSalt || !user.role)) {
        Object.assign(user, { role: account.role, ...hashPassword(account.password) })
        await utilisateurRepository.save(user)
      }
    }
    return
  }

  const utilisateurs = await utilisateurRepository.save([
    { nom: 'noémie martin', email: 'noémie@example.test', role: 'admin', ...hashPassword('admin123!') },
    { nom: 'pierre bernard', email: 'pierre@example.test', role: 'technicien', ...hashPassword('tech123!') },
    { nom: 'ines petit', email: 'ines@example.test', role: 'user', ...hashPassword('user123!') },
    { nom: 'sam durand', email: 'sam@example.test', role: 'user', ...hashPassword('user123!') }
  ])

  const equipementRepository = dataSource.getRepository(Equipement)
  const equipements = await equipementRepository.save([
    { nom: 'portable noémie', numeroSerie: 'pc-2026-001', utilisateur: utilisateurs[0] },
    { nom: 'portable pierre', numeroSerie: 'pc-2026-002', utilisateur: utilisateurs[1] },
    { nom: 'poste accueil', numeroSerie: 'pc-2026-003', utilisateur: utilisateurs[2] },
    { nom: 'écran externe', numeroSerie: 'mon-2026-001', utilisateur: utilisateurs[3] }
  ])

  const ticketRepository = dataSource.getRepository(Ticket)
  await ticketRepository.save([
    {
      titre: 'écran noir au démarrage',
      description: 'le poste ne démarre plus depuis ce matin',
      statut: 'ouvert',
      priorite: 'haute',
      utilisateur: utilisateurs[0],
      equipement: equipements[0]
    },
    {
      titre: 'installation de vscode',
      description: 'installer la dernière version pour le cours',
      statut: 'en cours',
      priorite: 'moyenne',
      utilisateur: utilisateurs[1],
      equipement: equipements[1]
    },
    {
      titre: 'clavier non reconnu',
      description: 'le clavier ne répond plus après la connexion',
      statut: 'ouvert',
      priorite: 'basse',
      utilisateur: utilisateurs[2],
      equipement: equipements[2]
    },
    {
      titre: 'écran qui clignote',
      description: 'le moniteur perd le signal régulièrement',
      statut: 'fermé',
      priorite: 'haute',
      utilisateur: utilisateurs[3],
      equipement: equipements[3]
    }
  ])
}

async function initializeDatabase() {
  if (!dataSource.isInitialized) await dataSource.initialize()
  await seed()
  return dataSource
}

module.exports = { dataSource, databasePath, hashPassword, initializeDatabase }
