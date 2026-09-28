const fs = require('node:fs')
const path = require('node:path')

const databasePath = path.join(__dirname, '..', 'data', 'glpi.sqlite')

for (const suffix of ['', '-shm', '-wal']) {
  const filePath = `${databasePath}${suffix}`
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

const { initializeDatabase, dataSource } = require('./db')

initializeDatabase()
  .then(() => dataSource.destroy())
  .then(() => console.log('base sqlite réinitialisée avec les données de démonstration'))
  .catch(error => {
    console.error(error)
    process.exitCode = 1
  })

