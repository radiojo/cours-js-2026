# tps progressifs javascript et typescript

ce document propose des travaux pratiques courts à réaliser avant le projet final : **créer un glpi-like**.

l’objectif est de pratiquer une notion à la fois, puis de les assembler progressivement.

## règles communes

pour chaque exercice :

- créer une branche git dédiée ;
- faire des commits au fil de l’eau ;
- tester régulièrement dans le navigateur ou avec node.js ;
- utiliser des noms explicites ;
- éviter `innerHTML` avec des données utilisateur ;
- noter les difficultés rencontrées dans le `readme.md` du exercice.

exemple de démarrage :

```bash
mkdir exercice-01-carnet
cd exercice-01-carnet
npm init -y
git init
git switch -c feature/exercice-01-carnet
```

conventional commits à utiliser :

```text
feat: afficher les contacts
fix: corriger la recherche
test: ajouter les tests du filtre
docs: expliquer le lancement
```

---

# exercice 01 — variables, types et calculs

**durée indicative : 30 minutes**

## objectif

manipuler des valeurs simples avec `const`, `let`, les types primitifs et les opérateurs.

## consigne

écrire un programme qui calcule le montant total d’une commande.

le programme doit contenir :

- le nom d’un article ;
- son prix hors taxe ;
- une quantité ;
- un taux de tva ;
- une réduction éventuelle ;
- le prix total ttc.

afficher une phrase lisible avec une template literal.

## contraintes

- utiliser `const` quand la valeur ne change pas ;
- utiliser `let` uniquement si nécessaire ;
- éviter les nombres écrits directement dans plusieurs calculs ;
- vérifier le résultat avec au moins trois jeux de données.

## exemple de sortie

```text
3 clavier(s) : 107.82 € ttc
```

## extension

ajouter une fonction qui indique si la commande bénéficie de la livraison gratuite à partir d’un seuil.

## livrable

- `src/commande.js`
- `readme.md` avec les exemples de lancement

---

# exercice 02 — fonctions et méthodes de tableaux

**durée indicative : 45 minutes**

## objectif

écrire des fonctions courtes et choisir entre `map`, `filter`, `forEach`, `find` et `includes`.

## consigne

à partir de ce tableau :

```js
const produits = [
  { id: 1, nom: 'clavier', prix: 45, stock: 4 },
  { id: 2, nom: 'souris', prix: 20, stock: 0 },
  { id: 3, nom: 'écran', prix: 180, stock: 2 }
]
```

écrire les fonctions suivantes :

- `produitsDisponibles(produits)` : garder les produits dont le stock est supérieur à zéro ;
- `nomsDesProduits(produits)` : retourner uniquement les noms ;
- `chercherProduit(produits, recherche)` : rechercher dans le nom avec `includes` ;
- `trouverProduit(produits, id)` : retrouver un produit avec `find` ;
- `afficherProduits(produits)` : afficher chaque produit avec `forEach`.

## questions

- quelle fonction retourne un nouveau tableau ?
- quelle fonction retourne un seul élément ?
- que se passe-t-il si `find` ne trouve rien ?
- les fonctions modifient-elles le tableau original ?

## extension

ajouter un tri par prix et un calcul de valeur du stock avec `map` et `reduce`.

## livrable

- `src/produits.js`
- `src/produits.test.js` contenant au moins cinq tests manuels ou automatisés

---

# exercice 03 — objets et déconstruction

**durée indicative : 45 minutes**

## objectif

modéliser des données métier avec des objets, des méthodes, la déconstruction et `spread`.

## consigne

modéliser un ticket de support :

```js
const ticket = {
  id: 1,
  titre: 'écran noir',
  statut: 'ouvert',
  priorite: 'haute',
  utilisateur: {
    id: 4,
    nom: 'lea'
  }
}
```

écrire des fonctions qui :

- renvoient une copie du ticket avec un nouveau statut ;
- ajoutent une note sans modifier le ticket original ;
- extraient le titre, le statut et la priorité avec la déconstruction ;
- produisent une version résumée du ticket ;
- vérifient qu’un ticket est urgent.

## contraintes

- utiliser `spread` pour les copies ;
- ne pas modifier directement l’objet reçu par une fonction ;
- gérer l’absence éventuelle de `utilisateur` avec une valeur par défaut ou `?.`.

## extension

ajouter une méthode `resume()` à une classe `Ticket` et comparer cette approche avec un objet simple.

## livrable

- `src/ticket.js`
- un schéma des propriétés de l’objet
- cinq exemples d’appel

---

# exercice 04 — dom, sélecteurs et événements

**durée indicative : 1 heure**

## objectif

construire une petite interface interactive avec le dom.

## consigne

créer une page qui affiche une liste de tickets et permet de :

- saisir une recherche ;
- filtrer les tickets quand l’utilisateur écrit ;
- afficher un compteur ;
- ajouter un ticket avec un formulaire ;
- marquer un ticket comme fermé avec un bouton.

## éléments html attendus

```html
<input id="recherche" type="search" placeholder="rechercher un ticket">
<form id="formulaire-ticket">
  <input id="titre" required>
  <button type="submit">ajouter</button>
</form>
<ul id="liste-tickets"></ul>
<p id="compteur"></p>
```

## contraintes

- sélectionner les éléments avec `querySelector` ;
- utiliser `addEventListener` ;
- utiliser `textContent` pour le texte ;
- construire les éléments avec `document.createElement` ;
- ne pas injecter directement le contenu saisi dans `innerHTML`.

## extension

ajouter un filtre par statut avec un élément `select`.

## livrable

- `index.html`
- `src/main.js`
- `style.css`
- une capture ou une courte description du comportement

---

# exercice 05 — asynchronisme et api simulée

**durée indicative : 1 heure**

## objectif

comprendre les promesses, `async` / `await`, `fetch` et `promise.all`.

## préparation

créer un dossier `data` contenant :

- `tickets.json` ;
- `utilisateurs.json` ;
- `equipements.json`.

servir le dossier avec un serveur local :

```bash
npx serve .
```

## consigne

écrire trois fonctions :

- `getTickets()` ;
- `getUtilisateurs()` ;
- `getEquipements()`.

chaque fonction doit utiliser `fetch`, vérifier `response.ok` et retourner le json.

charger les trois ressources en parallèle :

```js
const [tickets, utilisateurs, equipements] = await Promise.all([
  getTickets(),
  getUtilisateurs(),
  getEquipements()
])
```

## scénarios à tester

- fichier json existant ;
- fichier absent ;
- json mal formé ;
- recherche d’un utilisateur lié à un ticket.

## extension

ajouter un état `chargement` et un message d’erreur dans l’interface.

## livrable

- `src/api.js`
- les trois fichiers json
- une fonction d’initialisation avec `try/catch`

---

# exercice 06 — modules et npm

**durée indicative : 45 minutes**

## objectif

organiser le code avec `import` / `export` et automatiser les commandes avec npm.

## consigne

séparer le exercice précédent en modules :

```text
src/
├── api.js
├── tickets.js
├── dom.js
└── main.js
```

prévoir :

- des exports nommés pour les fonctions utilitaires ;
- un export par défaut pour le module principal si cela apporte une valeur ;
- un fichier d’entrée clairement identifié ;
- un script npm pour lancer le serveur ou les tests.

ajouter dans `package.json` :

```json
{
  "scripts": {
    "dev": "serve .",
    "check": "node --check src/main.js"
  }
}
```

lancer les commandes :

```bash
npm run check
npm run dev
```

## questions

- pourquoi un export nommé doit-il être importé avec des accolades ?
- pourquoi le nom d’un export par défaut est-il libre ?
- que doit-on versionner entre `package.json` et `package-lock.json` ?

## extension

ajouter eslint ou prettier et un script `format`.

## livrable

- les modules séparés ;
- `package.json` ;
- un `readme.md` de lancement.

---

# exercice 07 — tests unitaires et tdd

**durée indicative : 1 heure**

## objectif

écrire des tests avant l’implémentation et utiliser les matchers.

## installation

pour un projet javascript simple avec jest :

```bash
npm install --save-dev jest
```

ajouter les scripts :

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## consigne tdd

implémenter `filtrerTickets(tickets, options)` en suivant le cycle :

1. écrire un test rouge pour le filtre par statut ;
2. écrire le minimum de code pour obtenir le vert ;
3. refactorer ;
4. ajouter le filtre par priorité ;
5. ajouter la recherche avec `includes` ;
6. tester les listes vides et les options absentes.

## assertions attendues

utiliser au moins :

- `toEqual` pour comparer des tableaux ;
- `toHaveLength` pour un nombre d’éléments ;
- `toBe` pour une valeur simple ;
- `.not` pour un cas exclu.

## extension

écrire un test d’intégration qui appelle une fonction de chargement avec `fetch` mocké.

## livrable

- `src/tickets.js`
- `src/tickets.test.js`
- une sortie de `npm test` sans échec

---

# exercice 07 bis — écrire les tests d’un code existant

**durée indicative : 1 heure**

## objectif

partir d’un code déjà écrit et utiliser le tdd pour vérifier son comportement, révéler ses cas limites et sécuriser un futur refactoring.

dans cet exercice, vous n’écrivez pas d’abord l’implémentation : vous écrivez les tests qui décrivent le contrat attendu.

## code fourni

créer `src/tarifs.js` avec le code suivant :

```js
function calculerTtc(prixHt, tauxTva = 0.2) {
  return Math.round(prixHt * (1 + tauxTva) * 100) / 100
}

function filtrerTickets(tickets, options = {}) {
  const { statut, priorite, recherche } = options

  return tickets.filter(ticket => {
    const correspondAuStatut = !statut || ticket.statut === statut
    const correspondALaPriorite = !priorite || ticket.priorite === priorite
    const correspondALaRecherche = !recherche ||
      ticket.titre.toLowerCase().includes(recherche.toLowerCase())

    return correspondAuStatut &&
      correspondALaPriorite &&
      correspondALaRecherche
  })
}

function resumerTicket(ticket) {
  return `${ticket.id} — ${ticket.titre} (${ticket.statut})`
}

module.exports = { calculerTtc, filtrerTickets, resumerTicket }
```

## étape 1 — partir du contrat

avant d’écrire les tests, compléter ce tableau :

| fonction | entrée | résultat attendu | cas limite |
| --- | --- | --- | --- |
| `calculerTtc` |  |  |  |
| `filtrerTickets` |  |  |  |
| `resumerTicket` |  |  |  |

## étape 2 — cycle rouge, vert, refactor

créer `src/tarifs.test.js`, puis suivre ce cycle pour chaque comportement :

1. **rouge** : écrire une assertion qui décrit le comportement et vérifier qu’elle échoue ou qu’elle n’est pas encore satisfaite ;
2. **vert** : utiliser le code fourni pour faire passer le test ; si le code est incorrect, corriger uniquement le défaut révélé ;
3. **refactor** : améliorer les noms ou factoriser le code sans changer le comportement testé.

ne pas écrire un seul grand test : chaque test doit vérifier une règle précise.

## tests à écrire

### `calculerTtc`

- calculer `100` avec une tva de `0.2` ;
- utiliser la tva par défaut ;
- arrondir correctement `19.99` avec `0.2` ;
- tester le prix nul ;
- décider et documenter le comportement d’un prix négatif.

### `filtrerTickets`

utiliser ce jeu de données dans les tests :

```js
const tickets = [
  { id: 1, titre: 'écran noir', statut: 'ouvert', priorite: 'haute' },
  { id: 2, titre: 'souris cassée', statut: 'en cours', priorite: 'basse' },
  { id: 3, titre: 'écran lent', statut: 'fermé', priorite: 'moyenne' }
]
```

écrire un test pour :

- le filtre par statut ;
- le filtre par priorité ;
- la recherche insensible à la casse ;
- le cumul de deux filtres ;
- l’absence d’options ;
- une recherche sans résultat ;
- une liste vide ;
- la non-modification du tableau d’origine.

### `resumerTicket`

- vérifier la chaîne complète ;
- vérifier que l’identifiant apparaît ;
- tester un titre contenant des espaces ;
- décider du comportement si une propriété obligatoire manque.

## questions de réflexion

- un test doit-il vérifier l’implémentation ou le résultat observable ?
- pourquoi tester que le tableau original n’est pas modifié ?
- quelle différence entre un cas nominal et un cas limite ?
- que faut-il faire lorsqu’un test révèle une ambiguïté dans le besoin ?

## extension tdd

ajouter une règle métier sans modifier les tests existants :

> un ticket fermé ne doit pas apparaître dans la liste des tickets ouverts, même si son titre correspond à la recherche.

commencer par écrire le test rouge, puis modifier l’implémentation minimale et terminer par un refactoring si nécessaire.

## livrable

- `src/tarifs.js` ;
- `src/tarifs.test.js` ;
- au moins quinze tests nommés clairement ;
- une sortie de `npm test` sans échec ;
- deux commits minimum : `test: couvrir les règles tarifaires` puis `fix: gérer un cas limite` si une correction est nécessaire.

---

# exercice 08 — mocks, stubs et spies

**durée indicative : 45 minutes**

## objectif

isoler le code testé de l’api, de l’horloge et des dépendances externes.

## consigne

tester une fonction `chargerTickets(fetcheur)` sans appeler le réseau réel.

```js
async function chargerTickets(fetcheur) {
  const reponse = await fetcheur('/api/tickets')
  if (!reponse.ok) throw new Error('chargement impossible')
  return reponse.json()
}
```

créer un stub :

```js
const fetcheur = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => [{ id: 1, statut: 'ouvert' }]
})
```

tester :

- le résultat renvoyé ;
- l’url appelée ;
- le nombre d’appels ;
- le comportement quand la réponse n’est pas `ok`.

## vocabulaire à retenir

- stub : réponse préparée ;
- mock : dépendance remplaçable dont on peut vérifier les appels ;
- spy : observation d’une fonction existante ;
- fake : version simplifiée d’un service, par exemple une base en mémoire.

## extension

utiliser un fake repository en mémoire pour tester la création d’un ticket sans SQLite.

## livrable

- les tests des deux chemins, réussite et erreur ;
- une explication de la dépendance remplacée.

---

# exercice 09 — typescript : typer les données

**durée indicative : 1 heure**

## objectif

convertir les fonctions de filtrage et de chargement en typescript.

## consigne

définir :

```ts
type statut = 'ouvert' | 'en cours' | 'fermé'
type priorite = 'basse' | 'moyenne' | 'haute'

interface ticket {
  id: number
  titre: string
  statut: statut
  priorite: priorite
}
```

typer ensuite :

- `filtrerTickets` ;
- `chercherTicket` ;
- `chargerTickets` ;
- le résultat d’une promesse ;
- les options facultatives.

## contraintes

- activer `strict: true` ;
- ne pas utiliser `any` ;
- utiliser `unknown` à la frontière d’un json si sa forme n’est pas garantie ;
- gérer `undefined` lorsque `find` ne trouve aucun ticket.

## extension

ajouter une fonction générique `premier<T>(valeurs: T[]): T | undefined`.

## livrable

- `src/tickets.ts`
- `tsconfig.json`
- un script `check` qui lance `tsc --noEmit`