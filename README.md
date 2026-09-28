# cours javascript et typescript

## prérequis

- node.js 22.12 ou une version plus récente
- npm

## installation

```bash
npm install
```

pour préparer l’api du tp :

```bash
cp .env.example .env
```

remplacer ensuite `JWT_SECRET` dans `.env` par un secret long et aléatoire. le fichier `.env` ne doit jamais être commité.

## lancer la présentation

```bash
npm run dev
```

puis ouvrir l’url affichée par slidev, généralement `http://localhost:3030`.

## vérifier le build

```bash
npm run build
```

les tests d’intégration de l’api utilisent une base SQLite temporaire :

```bash
npm test
```

pour lancer les tests du client :

```bash
npm run test:client
```

pour vérifier les fichiers TypeScript du client :

```bash
npm run check:client
```

pour vérifier uniquement la présentation :

```bash
npm run test:slides
```

## exporter en pdf

```bash
npm run export
```

le contenu se trouve dans `slides.md`. il couvre les fondamentaux javascript, l’asynchrone et les api, puis l’environnement et les concepts essentiels de typescript.

## lancer la mini api du tp

la mini api utilise express, TypeORM et sqlite. la base `data/glpi.sqlite` est créée automatiquement au premier lancement et contient des données de démonstration.

les modèles sont décrits dans `api/entities.js` avec `EntitySchema`, puis manipulés avec les repositories TypeORM dans `api/server.js`. `synchronize` est activé pour simplifier ce tp local ; il ne faut pas l’utiliser ainsi en production.

```bash
npm run api
```

l’api est disponible sur `http://localhost:3000`.

## lancer le client du tp

le client est à réaliser dans `tp-final/client/` en suivant `tp-final/tp-final.md`. après avoir créé `tp-final/client/index.html`, lancez :

```bash
npm run client
```

le client est disponible sur `http://localhost:5173`.

## authentification et rôles

les routes de données nécessitent un jeton jwt obtenu avec `post /api/auth/login`.
les comptes de démonstration sont créés automatiquement :

| email | mot de passe | rôle |
| --- | --- | --- |
| `noémie@example.test` | `admin123!` | `admin` |
| `pierre@example.test` | `tech123!` | `technicien` |
| `ines@example.test` | `user123!` | `user` |
| `sam@example.test` | `user123!` | `user` |

- `user` peut consulter les données et créer un ticket pour lui-même ;
- `technicien` peut consulter, créer et modifier les tickets ;
- `admin` possède les mêmes droits sur les tickets et peut être étendu pour administrer les comptes.

pour un autre environnement, copier `.env.example` vers `.env` et définir un `JWT_SECRET` long et aléatoire. ne jamais utiliser les comptes de démonstration en production.

exemple de connexion et d’appel authentifié :

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"pierre@example.test","password":"tech123!"}'

curl http://localhost:3000/api/tickets \
  -H 'authorization: Bearer <jeton-reçu>'
```

protections ajoutées : `helmet`, cors limité à `CLIENT_ORIGIN`, limite de débit, taille de corps json limitée, validation des champs, requêtes TypeORM paramétrées, messages d’erreur génériques et absence des mots de passe dans les réponses.

pour le développement avec redémarrage automatique :

```bash
npm run api:dev
```

pour repartir des données initiales :

```bash
npm run api:reset
```

## routes de la mini api

| méthode | route | rôle |
| --- | --- | --- |
| `get` | `/api/health` | vérifier que l’api fonctionne |
| `post` | `/api/auth/login` | obtenir un jeton jwt |
| `get` | `/api/me` | consulter son profil authentifié |
| `get` | `/api/tickets` | lister les tickets |
| `get` | `/api/tickets/:id` | consulter un ticket |
| `post` | `/api/tickets` | créer un ticket |
| `patch` | `/api/tickets/:id` | modifier un ticket |
| `get` | `/api/utilisateurs` | lister les utilisateurs |
| `get` | `/api/equipements` | lister les équipements |

filtres disponibles pour les tickets : `?statut=ouvert`, `?priorite=haute` et `?q=écran`.

exemple :

```bash
curl http://localhost:3000/api/tickets
curl 'http://localhost:3000/api/tickets?statut=ouvert'
```

la base sqlite est ignorée par git. les étudiants peuvent donc réinitialiser leur environnement sans commiter de fichier généré.

