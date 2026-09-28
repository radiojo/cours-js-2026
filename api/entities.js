const { EntitySchema } = require('typeorm')

const Utilisateur = new EntitySchema({
  name: 'Utilisateur',
  tableName: 'utilisateurs',
  columns: {
    id: { type: Number, primary: true, generated: true },
    nom: { type: String },
    email: { type: String, unique: true },
    passwordHash: { type: String, name: 'password_hash', nullable: true },
    passwordSalt: { type: String, name: 'password_salt', nullable: true },
    role: { type: String, default: 'user' }
  },
  relations: {
    equipements: {
      type: 'one-to-many',
      target: 'Equipement',
      inverseSide: 'utilisateur'
    },
    tickets: {
      type: 'one-to-many',
      target: 'Ticket',
      inverseSide: 'utilisateur'
    }
  }
})

const Equipement = new EntitySchema({
  name: 'Equipement',
  tableName: 'equipements',
  columns: {
    id: { type: Number, primary: true, generated: true },
    nom: { type: String },
    numeroSerie: { type: String, name: 'numero_serie', unique: true }
  },
  relations: {
    utilisateur: {
      type: 'many-to-one',
      target: 'Utilisateur',
      inverseSide: 'equipements',
      nullable: true,
      onDelete: 'SET NULL',
      joinColumn: { name: 'utilisateur_id' }
    },
    tickets: {
      type: 'one-to-many',
      target: 'Ticket',
      inverseSide: 'equipement'
    }
  }
})

const Ticket = new EntitySchema({
  name: 'Ticket',
  tableName: 'tickets',
  columns: {
    id: { type: Number, primary: true, generated: true },
    titre: { type: String },
    description: { type: String },
    statut: { type: String, default: 'ouvert' },
    priorite: { type: String, default: 'moyenne' },
    createdAt: { type: Date, name: 'created_at', createDate: true },
    updatedAt: { type: Date, name: 'updated_at', updateDate: true }
  },
  relations: {
    utilisateur: {
      type: 'many-to-one',
      target: 'Utilisateur',
      inverseSide: 'tickets',
      nullable: false,
      onDelete: 'RESTRICT',
      joinColumn: { name: 'utilisateur_id' }
    },
    equipement: {
      type: 'many-to-one',
      target: 'Equipement',
      inverseSide: 'tickets',
      nullable: false,
      onDelete: 'RESTRICT',
      joinColumn: { name: 'equipement_id' }
    }
  }
})

module.exports = { Utilisateur, Equipement, Ticket }

