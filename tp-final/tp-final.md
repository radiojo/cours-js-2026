# tp final — construire un mini glpi

## objectif

construire une interface web de gestion de tickets qui communique avec la mini api fournie dans le projet.

à la fin du TP, votre application devra permettre de :

- se connecter avec un compte et un rôle ;
- charger les tickets, les utilisateurs et les équipements ;
- filtrer et rechercher les tickets ;
- consulter le détail d’un ticket ;
- créer un ticket ;
- modifier le statut d’un ticket selon le rôle ;
- gérer les erreurs réseau et l’expiration d’une session.

l’API et la base de données sont déjà fournies. votre travail porte principalement sur le client.

---

## étape 0 — préparer le projet

placez-vous à la racine du projet, là où se trouvent `package.json`, `.env.example` et le dossier `api`.

installez les dépendances :

```bash
npm install
```

ne lancez jamais l’api avec un fichier `.env.example` inchangé.

copiez le fichier d’exemple :

```bash
cp .env.example .env
```

ouvrez ensuite `.env` et remplacez au minimum la valeur de `JWT_SECRET` par un secret long et aléatoire :

```dotenv
JWT_SECRET=une-valeur-secrete-longue-et-aleatoire
CLIENT_ORIGIN=http://localhost:5173
PORT=3000
```

règles importantes :

- ne jamais communiquer votre vrai secret ;
- ne jamais commiter `.env` ;
- conserver `.env.example` dans le projet sans secret réel ;
- vérifier que `CLIENT_ORIGIN` correspond à l’adresse du client.

lancez l’api dans un premier terminal :

```bash
npm run api
```

elle est disponible sur `http://localhost:3000`.

si vous devez repartir des données initiales :

```bash
npm run api:reset
```

---

## étape 1 — comprendre les comptes et les rôles

les comptes de démonstration sont créés par l’api :

| email | mot de passe | rôle |
| --- | --- | --- |
| `noemie@example.test` | `admin123!` | `admin` |
| `pierre@example.test` | `tech123!` | `technicien` |
| `ines@example.test` | `user123!` | `user` |
| `sam@example.test` | `user123!` | `user` |

règles métier :

- `user` peut consulter les données et créer un ticket pour lui-même ;
- `technicien` peut consulter, créer et modifier les tickets ;
- `admin` possède les droits des responsables ;
- un appel protégé sans jeton doit recevoir `401` ;
- un appel avec un rôle insuffisant doit recevoir `403`.

commencez par tester la connexion avec curl ou insomnia avant d’écrire le client :

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"pierre@example.test","password":"tech123!"}'
```

conservez le `token` retourné uniquement pour vos essais locaux.

---

## étape 2 — créer le client

créez cette organisation :

```text
tp-final/client/
├── index.html
├── src/
│   ├── auth.ts
│   ├── http.ts
│   ├── api.ts
│   └── main.ts
└── style.css
```

si vous utilisez TypeScript dans le navigateur, utilisez un bundler ou un serveur de développement adapté. le fichier `tp-final/http.ts` fourni contient un squelette à compléter.

copiez ce squelette dans le client avant de le compléter :

```bash
cp tp-final/auth.ts tp-final/client/src/auth.ts
cp tp-final/http.ts tp-final/client/src/http.ts
```

le client doit être servi sur le port `5173` afin de correspondre à `CLIENT_ORIGIN` :

```bash
npm run client
```

pour vérifier les types et les tests du client :

```bash
npm run check:client
npm run test:client
```

---

## étape 3 — créer le formulaire de connexion

dans `tp-final/client/index.html`, créez un formulaire avec :

- un champ email ;
- un champ mot de passe ;
- un bouton de connexion ;
- une zone d’erreur accessible avec `role="alert"` ;
- un bouton de déconnexion.

exigences :

- utiliser `addEventListener('submit', ...)` ;
- appeler `post /api/auth/login` ;
- envoyer un objet json avec `email` et `password` ;
- ne pas afficher si seul l’email ou seul le mot de passe est incorrect ;
- désactiver le bouton pendant le chargement ;
- réafficher le formulaire en cas d’échec.

exemple de corps envoyé :

```js
const donnees = {
  email: 'pierre@example.test',
  password: 'tech123!'
}
```

---

## étape 4 — gérer le token

dans `tp-final/client/src/auth.ts`, écrivez les fonctions suivantes :

```ts
const tokenKey = 'mini-glpi-token'

export function getToken(): string | null {
  return localStorage.getItem(tokenKey)
}

export function saveToken(token: string): void {
  localStorage.setItem(tokenKey, token)
}

export function clearToken(): void {
  localStorage.removeItem(tokenKey)
}
```

à la réussite de la connexion :

1. lire `token` dans la réponse json ;
2. appeler `saveToken(token)` ;
3. masquer le formulaire ;
4. afficher l’interface glpi ;
5. appeler `/api/me` pour récupérer le profil et le rôle.

au clic sur déconnexion :

1. appeler `clearToken()` ;
2. vider les données affichées ;
3. masquer l’interface glpi ;
4. réafficher le formulaire.

---

## étape 5 — compléter `http.ts`

le fichier `tp-final/http.ts` contient une fonction `http<T>()` incomplète. complétez-la sans dupliquer la logique dans chaque appel.

la fonction doit :

- récupérer le token avec `getToken()` ;
- ajouter `authorization: Bearer <token>` si un token existe ;
- ajouter `content-type: application/json` lorsque nécessaire ;
- appeler `fetch` avec l’url de base de l’api ;
- traiter une réponse `401` : supprimer le token et signaler une session expirée ;
- traiter toutes les autres réponses non réussies, notamment `400`, `403`, `404` et `500` ;
- retourner le json uniquement si la réponse est réussie.

les commentaires présents dans le fichier sont des cas à implémenter, pas des commentaires à laisser sans traitement.

testez `http<T>()` avec :

- un appel réussi ;
- un token absent ;
- un token invalide ;
- une erreur `403` ;
- une erreur `404` ;
- une erreur serveur `500`.

---

## étape 6 — créer les fonctions d’accès aux données

dans `tp-final/client/src/api.ts`, créez des fonctions typées qui utilisent toutes `http<T>()` :

- `getProfile()` avec `get /api/me` ;
- `getTickets(params)` avec `get /api/tickets` ;
- `getTicket(id)` avec `get /api/tickets/:id` ;
- `getUtilisateurs()` avec `get /api/utilisateurs` ;
- `getEquipements()` avec `get /api/equipements` ;
- `createTicket(donnees)` avec `post /api/tickets` ;
- `updateTicket(id, modifications)` avec `patch /api/tickets/:id`.

les appels de création et de modification doivent envoyer :

```js
const options = {
  method: 'POST',
  body: JSON.stringify(donnees)
}
```

ou la méthode `PATCH` adaptée.

ne construisez jamais l’en-tête d’authentification directement dans chaque fonction métier : cette responsabilité appartient à `http<T>()`.

---

## étape 7 — construire l’interface glpi

dans `index.html`, créez au minimum :

- une zone de profil avec le nom et le rôle ;
- une zone de filtres avec statut, priorité et recherche ;
- un compteur de tickets ;
- une liste ou un tableau de tickets ;
- une zone de détail ;
- un formulaire de création de ticket ;
- un bouton de modification du statut ;
- une zone de chargement ;
- une zone d’erreur.

l’interface doit rester utilisable après une erreur réseau et ne doit pas recharger la page pour filtrer les tickets.

utilisez :

- `textContent` pour le texte ;
- `document.createElement` pour créer des éléments ;
- des sélecteurs css précis ;
- des événements pour les formulaires, boutons et filtres.

n’injectez jamais directement un titre ou une description utilisateur avec `innerHTML`.

---

## étape 8 — charger les données

après la connexion, chargez les ressources en parallèle :

```ts
const [tickets, utilisateurs, equipements] = await Promise.all([
  getTickets(),
  getUtilisateurs(),
  getEquipements()
])
```

prévoyez trois états d’interface :

- chargement ;
- succès ;
- erreur.

utilisez `find` pour retrouver l’utilisateur et l’équipement associés à un ticket. utilisez `filter` et `includes` pour la recherche côté client si nécessaire.

---

## étape 9 — créer et modifier un ticket

le formulaire de création doit envoyer :

- `titre` ;
- `description` ;
- `priorite` ;
- `equipementId`.

l’utilisateur courant est utilisé par l’api pour un rôle `user`.

avant l’envoi :

- vérifier les champs obligatoires ;
- vérifier les longueurs maximales ;
- afficher les erreurs près du formulaire ;
- empêcher les doubles soumissions.

pour la modification :

- afficher les actions selon le rôle retourné par `/api/me` ;
- permettre au technicien ou à l’admin de modifier le statut ;
- traiter proprement un éventuel `403` si le serveur refuse l’action ;
- recharger ou mettre à jour la carte du ticket après succès.

---

## étape 10 — vérifier l’application

vérifiez manuellement les scénarios suivants :

| scénario | résultat attendu |
| --- | --- |
| ouverture de l’api | `/api/health` répond `200` |
| ouverture du client sans token | formulaire de connexion visible |
| mauvais mot de passe | message générique, aucune interface métier |
| connexion `user` | lecture et création pour soi-même |
| connexion `technicien` | modification de statut possible |
| appel sans token | réponse `401` et retour au formulaire |
| token expiré ou invalide | token supprimé et retour au formulaire |
| ticket inexistant | message `404` compréhensible |
| données invalides | message `400` compréhensible |
| erreur serveur | message sans détail sensible |
| recherche sans résultat | liste vide avec message adapté |
| déconnexion | token supprimé et données masquées |

---

## étape 11 — tests et git

ajoutez des tests unitaires pour les fonctions de filtrage et de formatage. ajoutez au moins un test de `http<T>()` avec `fetch` mocké.

commitez au fil de l’eau avec des commits courts :

```text
feat: préparer la configuration locale
feat: ajouter le formulaire de connexion
feat: centraliser les appels authentifiés
feat: afficher la liste des tickets
feat: ajouter la création de ticket
test: couvrir le filtrage des tickets
fix: gérer l’expiration du token
docs: expliquer le lancement
```

travaillez sur une branche dédiée :

```bash
git switch -c feature/mini-glpi
```

---

## critères de réussite

le tp est réussi si :

- `.env.example` a été copié en `.env` ;
- le secret jwt a été remplacé et `.env` n’est pas commité ;
- l’api démarre avec `npm run api` ;
- le client affiche un formulaire de connexion fonctionnel ;
- le token est stocké puis supprimé correctement ;
- les appels protégés envoient `authorization: Bearer <token>` ;
- les rôles sont pris en compte dans l’interface et validés par le serveur ;
- les tickets sont chargés, filtrés, détaillés, créés et modifiés ;
- les réponses `400`, `401`, `403`, `404` et `500` sont gérées ;
- les données utilisateur ne sont pas injectées directement avec `innerHTML` ;
- les tests et les vérifications manuelles sont documentés dans le `readme.md`.

## livrable

remettez :

- `tp-final/client/index.html` ;
- `tp-final/client/src/auth.ts` ;
- `tp-final/client/src/http.ts` ;
- `tp-final/client/src/api.ts` ;
- `tp-final/client/src/main.ts` ;
- `tp-final/client/style.css` ;
- les tests ;
- un `readme.md` avec l’installation, le lancement, les comptes de test et les limites connues ;
- l’historique git montrant les étapes du travail.
