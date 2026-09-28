---
theme: default
title: JavaScript et TypeScript
info: support de cours pour étudiants
class: text-center
highlighter: shiki
lineNumbers: true
transition: slide
mdc: true
fonts:
  sans: 'Atkinson Hyperlegible Next'
  mono: 'Atkinson Hyperlegible Mono'
---

<style>
:root {
  --slidev-theme-primary: #f7df1e;
}
.slidev-layout {
  background: #10131a;
  color: #f4f7fb;
}
.slidev-layout h1, .slidev-layout h2, .slidev-layout h3 {
  color: #f7df1e;
  letter-spacing: -0.03em;
}
.slidev-layout h1 { font-size: 2.7rem; }
.slidev-layout h2 { font-size: 2.15rem; }
.slidev-layout strong { color: #7dd3fc; }
.slidev-layout code { font-size: 0.85em; }
.slidev-layout pre { border: 1px solid #293241; border-radius: 0.7rem; }
.badge { color: #10131a; background: #f7df1e; border-radius: 999px; padding: 0.25rem 0.7rem; font-weight: 700; }
</style>

# JavaScript et TypeScript

---

# sommaire

1. <Link to="5">**javascript : les fondamentaux**</Link>
   variables, types, fonctions, objets et tableaux

2. <Link to="20">**javascript avancé**</Link>
   dom, modules, méthodes de tableaux et chaînes

3. <Link to="26">**asynchronisme et fonctionnement interne**</Link>
   event loop, call stack, minuteries, promesses et `fetch`

4. <Link to="54">**typescript**</Link>
   environnement, types, interfaces, génériques et classes

5. <Link to="65">**testing**</Link>
   tests unitaires, tdd, bdd, jest et scripts npm

---

# objectifs

à la fin de cette séance, vous saurez :

- déclarer des données avec `let` et `const`
- écrire des fonctions lisibles et réutilisables
- manipuler tableaux et objets
- composer du code asynchrone avec les promesses
- appeler une API avec `fetch`
- utiliser la déconstruction, les opérateurs spread et rest
- démarrer un projet TypeScript et profiter du typage statique

---

# JavaScript, c’est quoi ?

- un langage **dynamique** et **interprété** (ou compilé à la volée)
- exécuté dans le navigateur et avec Node.js
- orienté objet par prototypes, avec une syntaxe moderne
- utilisé pour le comportement, les données et les services web

```js
const message = 'hello world'

console.log(message)
```

<div class="mt-8 grid grid-cols-3 gap-3 text-center">
  <div class="p-3 rounded bg-yellow-900/30">HTML : structure</div>
  <div class="p-3 rounded bg-yellow-900/30">CSS : présentation</div>
  <div class="p-3 rounded bg-yellow-900/30">JS : comportement</div>
</div>

---

# variables et constantes

```js
let score = 0          // valeur modifiable
score = score + 10

const tva = 0.20       // non réassignable
const prix = 50
const total = prix * (1 + tva)
```

- préférer `const` par défaut
- utiliser `let` seulement si la valeur doit changer
- éviter `var` : portée fonction et comportements historiques
- une constante d’objet peut encore modifier ses propriétés

```js
const panier = []
panier.push('livre') // autorisé
// panier = []       // interdit
```

---

# types de données et opérateurs

```js
const titre = 'JavaScript'       // string
const actif = true               // boolean
const quantite = 3               // number
const vide = null                // absence volontaire
let enAttente                    // undefined
const ids = [1, 2, 3]            // array
const utilisateur = { nom: 'noémie' } // object
```

- comparaison stricte : `===` et `!==`
- logique : `&&`, `||`, `!`
- valeur de repli : `??` quand la valeur est `null` ou `undefined`
- template literals : `` `bonjour ${utilisateur.nom}` ``

---

# `null` et `undefined`

les deux représentent une absence de valeur, mais pas avec la même intention.

```js
let a                  // undefined : pas encore de valeur
let b = undefined      // même valeur, intention écrite
const c = null         // absence choisie explicitement
```

- `undefined` apparaît quand une variable n’est pas initialisée ou qu’une propriété n’existe pas
- `null` signifie généralement « il n’y a volontairement aucune valeur »
- une fonction sans `return` renvoie `undefined`

```js
const utilisateur = {}
utilisateur.email // undefined : propriété absente

const profil = { avatar: null }
// la propriété existe, mais aucune image n’est associée
```

préférer les comparaisons strictes :

```js
valeur === null       // uniquement null
valeur === undefined  // uniquement undefined
valeur == null        // null ou undefined, à réserver aux cas voulus
```

piège historique : `typeof null` vaut `'object'`. il faut donc tester directement `valeur === null`.

---

# concaténer des chaînes

avec `+`, javascript assemble les chaînes de caractères :

```js
const prenom = 'noémie'
const message = 'bonjour ' + prenom + ' !'
// bonjour noémie !
```

attention au mélange entre nombres et chaînes :

```js
const resultat = '2' + 3 // '23'
const somme = Number('2') + 3 // 5
```

pour insérer des valeurs dans une phrase, les **template literals** sont souvent plus lisibles :

```js
const age = 20
const phrase = `noémie a ${age} ans`
```

elles utilisent des backticks, permettent l’interpolation avec `${...}` et acceptent les retours à la ligne.

---

# conditions et boucles

```js
if (score >= 10) {
  console.log('validé')
} else {
  console.log('à revoir')
}

for (const note of [12, 15, 9]) {
  console.log(note)
}
```

pour les collections, les méthodes fonctionnelles rendent souvent l’intention plus claire :

```js
const admis = [12, 15, 9].filter(note => note >= 10)
const mentions = admis.map(note => `note : ${note}`)
```

---

# `map`, `filter` et `forEach`

```js
const notes = [8, 12, 15]

const doubles = notes.map(note => note * 2)
// [16, 24, 30]

const admis = notes.filter(note => note >= 10)
// [12, 15]

notes.forEach(note => console.log(note))
```

- `map` transforme chaque élément et retourne un nouveau tableau de même longueur
- `filter` conserve les éléments qui respectent une condition
- `forEach` parcourt les éléments, souvent pour déclencher une action ; il ne retourne pas de nouveau tableau

ces méthodes ne modifient pas le tableau `notes` dans cet exemple.

---

# `splice`, `split` et `substr`

`splice` modifie un tableau en supprimant ou en ajoutant des éléments :

```js
const cours = ['html', 'css', 'javascript']
const supprimes = cours.splice(1, 1)

// cours : ['html', 'javascript']
// supprimes : ['css']
```

`split` transforme une chaîne en tableau selon un séparateur :

```js
const mots = 'html css javascript'.split(' ')
// ['html', 'css', 'javascript']
```

`substring` extrait une partie d’une chaîne

```js
const texte = 'javascript'
texte.slice(0, 4)      // 'java'
texte.substring(4, 10) // 'script'
```

réflexe : vérifier si une méthode modifie la valeur originale avant de l’utiliser.

---

# rechercher avec `includes`

`includes` répond à une question : « est-ce que cette valeur est présente ? »

```js
const statuts = ['ouvert', 'en cours', 'fermé']
statuts.includes('ouvert') // true
statuts.includes('annulé') // false

const titre = 'écran noir au démarrage'
titre.includes('noir') // true
```

la méthode retourne toujours un booléen : `true` ou `false`.

```js
const recherche = 'écran'
const ticketsVisibles = tickets.filter(ticket =>
  ticket.titre.toLowerCase().includes(recherche.toLowerCase())
)
```

attention : `includes` est sensible à la casse. utiliser `toLowerCase()` des deux côtés pour une recherche plus tolérante.

---

# retrouver un élément avec `find`

`find` retourne le **premier élément** qui respecte une condition.

```js
const tickets = [
  { id: 1, statut: 'ouvert' },
  { id: 2, statut: 'fermé' },
  { id: 3, statut: 'ouvert' }
]

const ticket = tickets.find(ticket => ticket.id === 2)
// { id: 2, statut: 'fermé' }

const absent = tickets.find(ticket => ticket.id === 99)
// undefined
```

dans le tp, `find` permet de retrouver les informations liées à un ticket :

```js
const utilisateur = utilisateurs.find(
  utilisateur => utilisateur.id === ticket.utilisateurId
)
```

- `find` retourne un élément ou `undefined`
- `filter` retourne toujours un tableau, éventuellement vide
- utiliser `find` pour un détail et `filter` pour une liste

---

# fonctions

une fonction est un bloc de code que l’on peut réutiliser.

elle peut recevoir des **entrées** et produire une **sortie**.

```js
function saluer(nom) {
  return `bonjour ${nom}`
}

const message = saluer('noémie')
console.log(message) // bonjour noémie
```

pour lire cet exemple :

1. `nom` est un paramètre, une donnée reçue par la fonction
2. `return` renvoie le résultat
3. `saluer('noémie')` appelle la fonction avec l’argument `'noémie'`

---

# deux écritures de fonction

## fonction nommée

```js
function additionner(a, b) {
  return a + b
}

additionner(2, 3) // 5
```

## fonction fléchée

```js
const additionner = (a, b) => {
  return a + b
}

additionner(2, 3) // 5
```

une fonction fléchée courte peut supprimer les accolades et `return` :

```js
const multiplier = (a, b) => a * b
```

dans ces exemples, les deux fonctions font le même travail.

---

# fonction nommée ou fléchée ?

| fonction nommée | fonction fléchée |
| --- | --- |
| commence par `function` | utilise `=>` |
| pratique pour une fonction principale et réutilisable | pratique pour une action courte |
| peut être appelée avant sa déclaration | doit être créée avant son appel |
| possède un fonctionnement particulier pour `this` | récupère `this` depuis le contexte extérieur |

```js
const notes = [8, 12, 15]
const notesValidees = notes.filter(note => note >= 10)
```

ici, `note => note >= 10` est une fonction fléchée donnée à `filter`.

- pour débuter : choisir la forme la plus lisible
- nommer clairement les fonctions
- une fonction doit idéalement faire une seule chose

```js
function appliquer(reduction, prix = 0) {
  return prix - prix * reduction
}
```

---

# comprendre le hoisting

le **hoisting** signifie que javascript connaît certaines déclarations avant de commencer à exécuter les lignes.

attention : javascript ne déplace pas vraiment les lignes dans le fichier. c’est une façon simple de décrire sa préparation du code.

```js
saluer('noémie') // fonctionne, même si la déclaration arrive après

function saluer(nom) {
  return `bonjour ${nom}`
}
```

une fonction nommée déclarée avec `function` est donc disponible avant sa déclaration.

en revanche, une fonction fléchée est généralement stockée dans une variable :

```js
// multiplier(2, 3) // erreur : pas encore créée
const multiplier = (a, b) => a * b
```

la fonction fléchée doit être créée avant d’être appelée.

---

# hoisting : ce qu’il faut retenir

```js
// console.log(prenom) // erreur
let prenom = 'noémie'

console.log(age) // undefined
var age = 20
```

- avec `let` et `const`, la variable existe mais reste inaccessible avant sa ligne d’initialisation : c’est la **zone temporelle morte**
- avec `var`, la variable vaut `undefined` avant son initialisation
- avec `function`, la fonction nommée peut être appelée avant sa déclaration

bonne pratique : ne pas dépendre du hoisting. déclarer les variables et les fonctions avant de les utiliser rend le code plus facile à lire.


---

# objets et tableaux

```js
const etudiant = {
  nom: 'pierre',
  age: 21,
  afficher() {
    return `${this.nom} a ${this.age} ans`
  }
}

etudiant.filiere = 'développement'

const cours = ['HTML', 'css', 'JavaScript']
cours.push('TypeScript')
```

- accès : `etudiant.nom` ou `etudiant['nom']`
- un objet regroupe état et comportements
- un tableau est ordonné et indexé à partir de zéro
- copier et transformer plutôt que modifier sans raison

---

# les objets

un objet regroupe plusieurs informations dans une même valeur.

```js
const etudiant = {
  nom: 'pierre',
  age: 21,
  filiere: 'développement'
}
```

chaque information est une **propriété** :

```js
console.log(etudiant.nom)        // pierre
console.log(etudiant['age'])     // 21

etudiant.age = 22                // modifier
etudiant.ville = 'lyon'          // ajouter
delete etudiant.ville            // supprimer
```

un objet peut aussi contenir une fonction, appelée une **méthode** :

```js
const profil = {
  nom: 'noémie',
  afficher() {
    return `profil de ${this.nom}`
  }
}

profil.afficher() // profil de noémie
```

`this` désigne ici l’objet qui appelle la méthode.

---

# qu’est-ce que le dom ?

le **dom** (*document object model*) est la représentation de la page html construite par le navigateur.

le navigateur transforme le html en un arbre de nœuds :

```text
document
└── html
    └── body
        ├── h1
        └── button
```

javascript peut parcourir cet arbre et le modifier :

- sélectionner un élément
- changer son texte ou ses attributs
- ajouter ou supprimer un élément
- réagir aux événements comme un clic

le dom représente l’état actuel de la page. il peut donc être différent du fichier html initial après les modifications de javascript.

---

# dom réel et virtual dom

| dom réel | virtual dom |
| --- | --- |
| arbre réellement affiché par le navigateur | représentation javascript en mémoire |
| fourni par l’api du navigateur | proposé par certains frameworks |
| modifié avec `document` et les méthodes dom | décrit avec des composants et un état |
| une modification peut déclencher un rendu | le framework compare puis applique les changements nécessaires |

react, vue et d’autres outils peuvent utiliser cette approche pour simplifier la mise à jour d’interfaces complexes.

```text
état modifié → nouvel arbre virtuel → comparaison → mises à jour du dom réel
```

le virtual dom n’est pas un second dom disponible avec `document` : c’est une technique de framework. pour une petite page, manipuler directement le dom peut être suffisant.

---

# sélectionner avec des sélecteurs css

javascript utilise les mêmes sélecteurs que css pour trouver des éléments dans le dom.

```js
document.querySelector('#menu')           // identifiant
document.querySelector('.carte')          // classe
document.querySelector('button')           // balise
document.querySelector('[data-id="42"]')  // attribut
document.querySelector('nav a')            // lien dans un nav
```

`querySelector` retourne le premier élément trouvé, ou `null` si aucun ne correspond.

```js
const boutons = document.querySelectorAll('.bouton')

boutons.forEach(bouton => {
  bouton.classList.add('actif')
})
```

`querySelectorAll` retourne tous les éléments correspondants. choisir un sélecteur précis évite de modifier involontairement une autre partie de la page.

---

# manipuler le dom

le **dom** est la représentation de la page html que javascript peut lire et modifier.

```html
<button id="bouton">cliquer</button>
<p id="message">en attente</p>
```

```js
const bouton = document.querySelector('#bouton')
const message = document.querySelector('#message')

bouton.addEventListener('click', () => {
  message.textContent = 'bouton cliqué !'
  message.classList.add('actif')
})
```

pour créer un élément, le préparer puis l’insérer dans la page :

```js
const alerte = document.createElement('p')
alerte.textContent = 'nouveau message'
alerte.classList.add('info')
message.append(alerte)
```

- `querySelector` sélectionne un élément avec un sélecteur css
- `textContent` modifie le texte affiché
- `classList` ajoute ou retire une classe css
- `createElement` crée un nœud qui n’est pas encore dans la page
- `append` ajoute ce nœud à la fin de l’élément choisi
- `addEventListener` réagit à une action, ici un clic

éviter de placer directement des données utilisateur dans `innerHTML` : préférer `textContent` pour limiter les risques d’injection.

---

# portée et bonnes pratiques

```js
const externe = 'visible ici'

function exemple() {
  const interne = 'visible dans la fonction'
  return interne
}
```

- `let` et `const` ont une portée de bloc
- éviter les variables globales
- garder les données proches de leur usage
- préférer des fonctions pures quand c’est possible
- formater et vérifier le code avec eslint et prettier

<div class="mt-8 p-4 rounded bg-sky-950/50">
  <span class="badge">réflexe</span> lire le code de gauche à droite : nom → paramètres → résultat.
</div>

---

# le modèle asynchrone

le navigateur ne doit pas être bloqué pendant un appel réseau ou une setTimeout.

```js
console.log('1. début')

setTimeout(() => console.log('3. plus tard'), 0)

console.log('2. fin du code synchrone')
```

- la file d’événements orchestre les tâches
- une opération asynchrone se termine plus tard
- une promesse représente une réussite ou un échec futur

---

# les minuteries : `setTimeout` et `setInterval`

`setTimeout` exécute une fonction **une seule fois** après un délai en millisecondes.

```js
const timeoutId = setTimeout(() => {
  console.log('exécuté après 2 secondes')
}, 2000)

clearTimeout(timeoutId) // annule l’exécution si nécessaire
```

`setInterval` exécute une fonction **répétitivement** jusqu’à son arrêt.

```js
let compteur = 0
const intervalId = setInterval(() => {
  compteur += 1
  console.log(compteur)

  if (compteur === 3) {
    clearInterval(intervalId)
  }
}, 1000)
```

- le délai est une durée minimale, pas une garantie d’exécution exacte
- conserver l’identifiant retourné par la minuterie
- utiliser `clearTimeout` pour un `setTimeout`
- utiliser `clearInterval` pour un `setInterval`

---

# l’event loop en quatre éléments

javascript exécute le code principal sur une seule pile d’exécution.

1. **pile d’appels** : les fonctions en cours
2. **apis du navigateur** : setTimeout, réseau, dom
3. **file d’attente** : callbacks prêts à être exécutés
4. **event loop** : vérifie que la pile est vide, puis prend une tâche

```text
code synchrone → pile d’appels
                     ↓
          api navigateur → file d’attente
                                  ↓
                  event loop → pile d’appels
```

l’event loop ne rend pas le code parallèle : elle permet surtout de ne pas bloquer la page pendant une opération lente.

---

# question : que se passe-t-il dans la pile ?

la **call stack**, ou pile d’appels, est une pile de fonctions en cours d’exécution.

```js
function afficher() {
  console.log('bonjour')
}

function demarrer() {
  afficher()
}

demarrer()
```

**question : dans quel ordre les fonctions entrent-elles dans la pile et en sortent-elles ?**

---

# correction : la call stack

la pile fonctionne selon le principe **lifo** (*last in, first out*) : la dernière fonction entrée est la première à sortir.

```text
1. demarrer entre dans la pile
2. afficher entre au-dessus de demarrer
3. afficher termine et sort de la pile
4. demarrer termine et sort de la pile
```

pendant `afficher`, la pile ressemble à ceci :

```text
┌──────────┐
│ afficher │  ← fonction exécutée maintenant
├──────────┤
│ demarrer │
└──────────┘
```

quand une fonction contient un calcul très long, elle reste dans la pile et bloque les instructions suivantes ainsi que l’interface.

---

# suivre l’ordre d’exécution

```js
console.log('a')

setTimeout(() => console.log('c'), 0)

console.log('b')
```

résultat :

```text
a
b
c
```

pourquoi ?

- `a` est exécuté immédiatement
- la setTimeout est confiée au navigateur
- `b` est exécuté ensuite
- quand la pile est vide, l’event loop place le callback `c` dans la pile

---

# la mémoire en javascript

javascript réserve de la mémoire quand le programme crée des valeurs :

```js
const nom = 'noémie'
const profil = { nom, age: 20 }
const cours = ['html', 'css', 'javascript']
```

- les valeurs simples sont stockées directement ou de façon optimisée
- les objets et tableaux vivent dans une zone de mémoire dynamique
- une variable contient une référence vers un objet
- plusieurs variables peuvent référencer le même objet

```js
const premier = { actif: true }
const second = premier
second.actif = false
console.log(premier.actif) // false
```

---

# le garbage collector

le **garbage collector** libère automatiquement la mémoire devenue inaccessible.

```js
let utilisateur = { nom: 'noémie' }
utilisateur = null
```

après la seconde ligne, l’ancien objet n’est plus atteignable par le programme : il pourra être nettoyé.

- on ne libère pas manuellement la mémoire en javascript
- le nettoyage n’arrive pas forcément immédiatement
- une référence encore conservée empêche le nettoyage

---

# éviter les fuites mémoire

une fuite mémoire arrive quand le programme conserve par erreur des objets devenus inutiles.

```js
const bouton = document.querySelector('#bouton')
const gererClic = () => console.log('clic')

bouton.addEventListener('click', gererClic)

// quand le composant disparaît :
bouton.removeEventListener('click', gererClic)
```

réflexes :

- retirer les écouteurs d’événements inutiles
- arrêter les setTimeouts et abonnements
- vider les collections qui grandissent sans limite
- limiter les références globales

---

# promesses et `async` / `await`

```js
function attendre(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function lancer() {
  await attendre(500)
  return 'terminé'
}

lancer()
  .then(resultat => console.log(resultat))
  .catch(erreur => console.error(erreur))
```

à retenir :

- une promesse représente un résultat qui arrivera plus tard
- `.then` traite la réussite
- `.catch` traite l’erreur

---

# `promise.resolve`, `promise.reject` et `promise.all`

```js
const ok = Promise.resolve('donnée prête')
const erreur = Promise.reject(new Error('échec'))

ok.then(valeur => console.log(valeur))
erreur.catch(erreur => console.error(erreur.message))
```

- `Promise.resolve(valeur)` crée une promesse réussie
- `Promise.reject(erreur)` crée une promesse échouée
- `Promise.all(promesses)` attend plusieurs promesses en parallèle

```js
const [tickets, utilisateurs, equipements] = await Promise.all([
  getTickets(),
  getUtilisateurs(),
  getEquipements()
])
```

les résultats gardent l’ordre des promesses fournies. si une seule promesse échoue, `Promise.all` échoue aussi : utiliser `try/catch` pour gérer ce cas.

---

# question : promesse ou setTimeout ?

quel est l’ordre d’affichage ?

```js
console.log('a')

setTimeout(() => console.log('d'), 0)

Promise.resolve().then(() => console.log('c'))

console.log('b')
```

**à votre avis, est-ce `a b c d` ou `a b d c` ?**

expliquez où se trouvent les callbacks :

- dans la call stack
- dans la file des microtâches
- dans la file des tâches

---

# correction : promesse et event loop

le résultat est :

```text
a
b
c
d
```

1. `a` entre dans la call stack et s’affiche
2. le callback de `setTimeout` va dans les apis du navigateur
3. le callback de `.then` est placé dans la **file des microtâches**
4. `b` s’affiche, puis la call stack devient vide
5. l’event loop vide les microtâches : `c` s’affiche
6. ensuite, elle prend la tâche de la setTimeout : `d` s’affiche

une microtâche de promesse passe donc avant une tâche comme `setTimeout`, même avec un délai de `0`.

---

# attendre avec `async` / `await`

```js
async function lancerAvecGestion() {
  try {
    const resultat = await lancer()
    console.log(resultat)
  } catch (erreur) {
    console.error('échec :', erreur)
  }
}
```

- `async` retourne toujours une promesse
- `await` suspend la fonction asynchrone, pas toute l’application
- toujours prévoir le chemin d’erreur

---

# API fetch

```js
async function chargerUtilisateur(id) {
  const reponse = await fetch(`https://API.example.com/users/${id}`)

  if (!reponse.ok) {
    throw new Error(`http ${reponse.status}`)
  }

  return reponse.json()
}

const utilisateur = await chargerUtilisateur(42)
console.log(utilisateur)
```

1. `fetch` envoie la requête
2. `response.ok` vérifie le statut http
3. `response.json()` lit le corps asynchrone
4. `try/catch` traite réseau et données invalides

---

# déconstruction

extraire les valeurs dont on a besoin, au plus près de leur utilisation.

```js
const profil = { nom: 'ines', ville: 'lyon', age: 20 }
const { nom, ville } = profil

const couleurs = ['jaune', 'bleu', 'rouge']
const [principale, secondaire] = couleurs

function afficher({ nom, age = 0 }) {
  return `${nom} a ${age} ans`
}
```

- renommage : `const { nom: prenom } = profil`
- ignorer une valeur : `const [, deuxieme] = couleurs`
- valeur par défaut : `{ age = 0 }`

---

# les opérateurs spread et rest

```js
const base = ['HTML', 'css']
const complet = [...base, 'JavaScript']

const ancien = { nom: 'sam', niveau: 1 }
const nouveau = { ...ancien, niveau: 2 }
```

`spread` **déploie** les éléments ou propriétés.

```js
function total(...prix) {
  return prix.reduce((somme, prix) => somme + prix, 0)
}

const { nom, ...details } = nouveau
```

`rest` **rassemble** ce qui reste.  
attention : la copie est superficielle.
---

# modules et organisation

un module est un fichier javascript qui peut publier certaines valeurs pour les autres fichiers.

```js
// math.js
// export nommé : le nom doit être repris à l’import
export const doubler = valeur => valeur * 2

// export par défaut : une seule valeur principale par module
export default function carre(valeur) {
  return valeur ** 2
}
```

```js
// app.js
// import de l’export default : le nom est libre
// import de l’export nommé : le nom est entre accolades
import carre, { doubler } from './math.js'

console.log(carre(doubler(3)))
```

- `export const nom` et `export { nom }` créent des exports nommés
- `export default` désigne la valeur principale du module
- un module peut avoir plusieurs exports nommés, mais un seul export par défaut
- un fichier = un module avec une responsabilité
- nommer les exports publics avec soin
- éviter les dépendances circulaires
- `npm` gère les dépendances et les scripts

---

# npm : le gestionnaire de paquets

`npm` signifie **node package manager**. il est installé avec node.js et permet de :

- télécharger et mettre à jour des paquets JavaScript
- déclarer les dépendances d’un projet
- exécuter des scripts répétables
- publier et partager des paquets sur le registre npm

```bash
npm install lodash
npm install --save-dev typescript
npm run build
```

`node_modules/` contient les paquets installés. ce dossier ne doit généralement pas être commité.

---

# installer un paquet npm

```bash
npm install express
npm install --save express
npm install --save-dev jest
```

- `npm install paquet` ajoute un paquet aux `dependencies`
- `--save` explicite l’enregistrement dans `dependencies` ; il est aujourd’hui généralement implicite
- `--save-dev` ajoute un outil utilisé seulement pendant le développement ou les tests
- les versions et les dépendances transitives sont enregistrées dans `package-lock.json`

installation globale :

```bash
npm install -g typescript
```

`-g` installe la commande pour l’utilisateur ou la machine, pas dans le projet. préférer une dépendance locale pour les outils utilisés par l’équipe et les scripts npm.

---

# désinstaller et vérifier les paquets

```bash
npm uninstall express
npm uninstall -g typescript
npm audit
npm audit fix
```

- `npm uninstall paquet` retire une dépendance du projet et met à jour `package.json`
- `npm uninstall -g paquet` retire une installation globale
- `npm audit` recherche des vulnérabilités connues dans l’arbre des dépendances
- `npm audit fix` tente d’appliquer des mises à jour compatibles

`--audit` concerne l’audit lancé pendant certaines installations :

```bash
npm install --audit=false # désactiver temporairement la vérification
npm install --audit=true  # la réactiver explicitement
```

ne pas confondre `npm audit` — qui produit un rapport — avec l’option `--audit` d’une commande npm.

---

# `package.json` et `package-lock.json`

`package.json` décrit l’intention du projet :

```json
{
  "scripts": { "dev": "tsx src/main.ts" },
  "dependencies": { "express": "^5.0.0" },
  "devDependencies": { "TypeScript": "^5.0.0" }
}
```

`package-lock.json` enregistre l’arbre exact installé : versions, dépendances transitives et intégrité.

- versionner les deux fichiers
- utiliser `npm install` pour modifier les dépendances
- utiliser `npm ci` en intégration continue : installation fidèle au lockfile
- ne jamais versionner les secrets dans `package.json`

---

# les scripts npm

les scripts npm sont des raccourcis nommés pour exécuter des commandes toujours de la même façon.

```json
{
  "scripts": {
    "dev": "slidev slides.md",
    "build": "slidev build slides.md",
    "api": "node api/server.js",
    "api:reset": "node api/reset.js"
  }
}
```

```bash
npm run dev
npm run build
npm run api
npm run api:reset
```

- `npm run nom` exécute le script défini dans `package.json`
- `npm test` et `npm start` sont des scripts avec une syntaxe raccourcie
- un script rend une procédure facile à mémoriser et reproductible
- les scripts peuvent être utilisés localement ou en intégration continue

---

# le risque supply chain

une attaque **supply chain** compromet un fournisseur ou une dépendance plutôt que le code de l’application.

exemples :

- un paquet malveillant publié avec un nom proche d’un paquet connu
- le compte d’un mainteneur volé, puis une nouvelle version piégée
- une dépendance transitive compromise
- un script `postinstall` qui exécute une commande sur la machine

le risque existe au téléchargement, pendant l’installation et à l’exécution du code.

---

# question : comment réduire le risque ?

vous rejoignez un projet qui utilise 80 dépendances npm.

**quelles pratiques mettez-vous en place avant d’installer une nouvelle version ou de publier le projet ?**

réfléchissez à deux :

- au contenu du projet et de ses dépendances
- aux versions installées et aux droits accordés
- à la détection et à la réaction en cas d’alerte

<div class="mt-10 p-5 rounded bg-yellow-900/30 text-center text-xl">
  réponse à la diapositive suivante
</div>

---

# réponse : sécuriser les dépendances

- vérifier le nom, l’auteur, la popularité, les mises à jour et le dépôt du paquet
- limiter les dépendances et supprimer celles qui sont inutilisées
- commiter `package-lock.json` et utiliser `npm ci` en ci/cd
- lancer régulièrement `npm audit` et surveiller avec dependabot ou renovate

---

# réponse : surveiller les mises à jour

- examiner les changements avant une mise à jour ; éviter les mises à jour aveugles
- utiliser des versions maîtrisées et tester avant déploiement
- désactiver les scripts d’installation non nécessaires et limiter les permissions
- protéger le compte npm avec une authentification forte et publier avec provenance lorsque possible
- ne jamais exposer de secrets dans les scripts, logs ou variables versionnées

aucune mesure n’est parfaite : on combine prévention, détection, sauvegardes et plan de réaction.

---

# pourquoi TypeScript ?

JavaScript découvre souvent les erreurs à l’exécution. TypeScript les signale pendant le développement.

```ts
function saluer(nom: string): string {
  return `bonjour ${nom}`
}

saluer('ines')
// saluer(42) // erreur détectée par l’éditeur
```

- superset de JavaScript : le code est transpilé en JavaScript
- autocomplétion et documentation intégrée
- contrats explicites entre les fonctions
- refactorings plus sûrs dans les grands projets

---

# installer TypeScript

```bash
npm init -y
npm install --save-dev typescript tsx
npx tsc --init
```

ces commandes créent un projet npm et ajoutent les outils nécessaires.

---

# configurer TypeScript

```json
{
  "scripts": {
    "dev": "tsx src/main.ts",
    "build": "tsc",
    "check": "tsc --noEmit"
  }
}
```

recommandations de `tsconfig.json` :

- `strict: true`
- `target` adapté à l’environnement
- `module: "nodenext"` côté node récent
- `noUncheckedIndexedAccess: true` pour plus de sécurité

---

# le fichier `tsconfig.json`

`tsconfig.json` décrit comment TypeScript doit analyser et compiler le projet.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noEmit": true,
    "lib": ["ES2022", "DOM"]
  },
  "include": ["src/**/*.ts"]
}
```

- `target` choisit la version de JavaScript produite
- `module` et `moduleResolution` indiquent comment gérer les imports
- `strict` active les contrôles de types les plus exigeants
- `noEmit` vérifie le code sans générer de fichiers, utile avec Vite
- `lib` ajoute les types de JavaScript et du navigateur (`document`, `fetch`…)
- `include` limite les fichiers analysés par TypeScript

le fichier de configuration doit correspondre à l’outil utilisé : Vite génère le JavaScript, tandis que `tsc --noEmit` vérifie les types.

---

# types primaires et annotations

```ts
let prenom: string = 'zoe'
let age: number = 19
let connecte: boolean = false
let rien: null = null
let inconnu: unknown = 'à vérifier'

const identifiant: string | number = 42
const notes: number[] = [12, 15, 18]
const coordonnees: [number, number] = [45.76, 4.83]
```

- `unknown` est sûr : il faut vérifier avant utilisation
- éviter `any` : il désactive le filet de sécurité
- laisser l’inférence faire son travail quand le type est évident

```ts
const langue = 'français' // type inféré : string
```

---

# `unknown`, `any` et `never`

ces trois types ont des rôles très différents :

| type | signification | attitude recommandée |
| --- | --- | --- |
| `unknown` | valeur dont on ne connaît pas encore le type | vérifier avant d’utiliser |
| `any` | désactivation du contrôle de types | éviter, sauf migration ou API non typée |
| `never` | valeur qui ne peut jamais arriver | erreurs, boucles infinies, exhaustivité |

```ts
let valeurInconnue: unknown = 'texte'
// valeurInconnue.toUpperCase() // interdit sans vérification

let valeurLibre: any = 'texte'
valeurLibre.toUpperCase() // accepté, même si cela peut planter
```

---

# utiliser `unknown` et `never`

`unknown` protège les frontières de l’application : données d’une API, json ou entrée utilisateur.

```ts
function afficher(valeur: unknown): void {
  if (typeof valeur === 'string') {
    console.log(valeur.toUpperCase())
  }
}
```

`never` décrit une fonction qui ne retourne jamais ou aide à détecter un cas oublié :

```ts
function echouer(message: string): never {
  throw new Error(message)
}

type statut = 'en attente' | 'validé'
function libelle(valeur: statut): string {
  switch (valeur) {
    case 'en attente': return 'à traiter'
    case 'validé': return 'terminé'
    default: return echouer('statut inconnu')
  }
}
```

`any` peut dépanner temporairement, mais doit rester isolé et documenté.

---

# types, unions et alias

```ts
type identifiant = string | number
type statut = 'en attente' | 'validé' | 'refusé'

type utilisateur = {
  id: identifiant
  nom: string
  statut: statut
  actif?: boolean
}

function activer(personne: utilisateur): utilisateur {
  return { ...personne, actif: true }
}
```

- un alias décrit une forme réutilisable
- une union limite les valeurs possibles
- `?` indique une propriété facultative
- les types peuvent composer objets, fonctions et littéraux

---

# interfaces

```ts
interface produit {
  readonly id: number
  nom: string
  prix: number
  remise?(taux: number): number
}

function afficherProduit(produit: produit): void {
  console.log(`${produit.nom} : ${produit.prix} €`)
}
```

- `readonly` interdit la réassignation après création
- une interface décrit un contrat de forme
- elle peut être étendue :

```ts
interface produitNumerique extends produit {
  format: 'pdf' | 'epub'
}
```

choisir `interface` pour les contrats extensibles, `type` pour les unions et compositions.

---

# fonctions et génériques

```ts
function premier<T>(valeurs: T[]): T | undefined {
  return valeurs[0]
}

const premierNom = premier(['noémie', 'pierre'])
const premierAge = premier([18, 21])
```

`T` préserve le type reçu sans dupliquer la fonction.

```ts
type resultat<T> = {
  donnees: T
  erreur?: string
}

const reponse: resultat<utilisateur> = {
  donnees: { id: 1, nom: 'noémie', statut: 'validé' }
}
```

ici, `resultat<utilisateur>` signifie que `donnees` ne peut contenir qu’un `utilisateur`.
le type générique `resultat<T>` reste réutilisable avec d’autres types, par exemple `resultat<ticket>`.

---

# classes et visibilité

```ts
class Compte {
  constructor(
    public readonly titulaire: string,
    private solde: number = 0
  ) {}

  deposer(montant: number): void {
    if (montant > 0) this.solde += montant
  }

  get soldeActuel(): number {
    return this.solde
  }
}

const compte = new Compte('pierre')
compte.deposer(100)
```

- `public` est accessible partout
- `private` est réservé à la classe
- `readonly` protège une propriété après construction
- encapsuler l’état évite les modifications incohérentes

---

# TypeScript et JavaScript : le bon équilibre

| besoin | outil |
| --- | --- |
| comportement dans le navigateur | JavaScript |
| contrats et refactoring | TypeScript |
| données venant de l’extérieur | validation à l’exécution |
| code partagé | fonctions pures et types précis |

à retenir :

- TypeScript ne valide pas automatiquement les données d’une API
- le typage complète les tests, il ne les remplace pas
- commencer petit, activer `strict`, corriger les erreurs une par une

---

# pourquoi tester son code ?

un test vérifie automatiquement qu’un comportement attendu est toujours respecté.

les tests permettent de :

- détecter une régression après une modification
- documenter le comportement attendu
- refactorer avec davantage de confiance
- obtenir un retour rapide sans tester toute l’application à la main

un **test unitaire** vérifie une petite unité isolée : une fonction, une règle de calcul ou une transformation de données.

```js
function additionner(a, b) {
  return a + b
}
```

le test doit répondre à une question précise : « que doit retourner `additionner(2, 3)` ? »

---

# les différents types de tests

| type | ce qui est vérifié | exemple |
| --- | --- | --- |
| unitaire | une fonction isolée | calculer un total |
| intégration | plusieurs modules ensemble | api + base de données |
| contrat | accord entre deux services | forme d’une réponse api |
| e2e | parcours complet utilisateur | créer un ticket dans le navigateur |
| performance | temps et ressources | charger 1 000 tickets |
| accessibilité | usage par tous les utilisateurs | navigation au clavier |

les tests unitaires sont rapides et nombreux. les tests e2e sont plus proches de la réalité, mais plus lents et plus fragiles.

---

# tdd et bdd

## tdd : test-driven development

le tdd guide l’implémentation par les tests :

1. **rouge** : écrire un test qui échoue
2. **vert** : écrire le minimum de code pour le faire passer
3. **refactor** : améliorer le code sans changer le comportement

---

## bdd : behavior-driven development

le bdd décrit le comportement attendu avec un vocabulaire compréhensible par l’équipe :

```text
given un ticket ouvert
when l’utilisateur renseigne une priorité haute
then le ticket apparaît comme urgent
```

- tdd part souvent de la fonction et du code
- bdd part du besoin et du comportement utilisateur
- les deux approches utilisent des tests automatisés et des exemples vérifiables

---

# installer jest

jest est un outil javascript qui découvre et exécute les tests.

```bash
npm install --save-dev jest
```

convention de nommage :

```text
src/calcul.js
src/calcul.spec.js
```

jest recherche notamment les fichiers `*.test.js` et `*.spec.js`.

pour ce cours, choisir **vitest** pour un projet typescript moderne : il fonctionne bien avec vite, les modules es et le code typescript.

```bash
npm install --save-dev vitest
```

si le projet utilise déjà jest, choisir **ts-jest** pour compiler les fichiers typescript pendant les tests :

```bash
npm install --save-dev jest ts-jest @types/jest
npx ts-jest config:migrate jest.config.js
```

ne pas installer les deux sans raison : choisir un outil et l’utiliser dans le script `test`.

---

# créer une suite et un test

```js
// calcul.test.js
const { additionner } = require('./calcul.js')

describe('additionner', () => {
  it('additionne deux nombres', () => {
    expect(additionner(2, 3)).toBe(5)
  })
})
```

- `describe` regroupe les tests d’une fonctionnalité
- `it` ou `test` décrit un comportement précis
- `expect` reçoit la valeur observée
- le matcher `toBe` compare avec la valeur attendue

un bon test possède une seule raison d’échouer et un nom explicite.

---

# les matchers jest

les **matchers** expriment la vérification attendue :

```js
expect(total).toBe(42)
expect(utilisateur.nom).toEqual('noémie')
expect(tickets).toHaveLength(3)
expect(reponse).toBeDefined()
expect(erreur).toBeTruthy()
expect(() => echouer()).toThrow()
```

pour vérifier l’inverse, utiliser `.not` :

```js
expect(statut).not.toBe('fermé')
```

`toBe` convient surtout aux valeurs simples ; `toEqual` compare le contenu des objets et des tableaux.

---

# mocks, stubs, spies et fakes

une **doublure de test** remplace une dépendance réelle pour garder un test rapide, prévisible et isolé.

- **stub** : fournit une réponse préparée
- **mock** : remplace une dépendance et permet de vérifier son utilisation
- **spy** : observe une vraie fonction sans forcément la remplacer
- **fake** : implémentation simplifiée, par exemple une mémoire à la place d’une base de données

exemple : ne pas appeler l’api pendant un test de fonction :

```js
const fetchTickets = jest.fn()
fetchTickets.mockResolvedValue([{ id: 1, statut: 'ouvert' }])

const tickets = await fetchTickets()

expect(tickets).toHaveLength(1)
expect(fetchTickets).toHaveBeenCalledTimes(1)
```

pour observer une fonction existante :

```js
const journal = { log: message => message }
const spy = jest.spyOn(journal, 'log')

journal.log('ticket chargé')

expect(spy).toHaveBeenCalledWith('ticket chargé')
spy.mockRestore()
```

réflexes : mocker les frontières lentes ou imprévisibles — réseau, horloge, aléatoire, système de fichiers — mais éviter de tout mocker pour conserver des tests utiles.

---

# exécuter les tests avec npm

ajouter un script dans `package.json` :

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

commandes :

```bash
npm test
npm run test:watch
npx jest calcul.test.js
```

en intégration continue, les tests sont lancés avant la fusion ou le déploiement.

---

# conclusion

- JavaScript fournit les briques du web interactif
- les fonctions, objets et modules structurent le code
- les promesses et `fetch` gèrent les opérations asynchrones
- la déconstruction, `spread` et `rest` rendent le code expressif
- TypeScript ajoute des contrats et une meilleure expérience de développement

<div class="mt-10 text-center text-xl">
  pratiquer, lire les erreurs, refactorer, recommencer.
</div>

<div class="abs-br m-6 text-sm opacity-60">questions ?</div>

