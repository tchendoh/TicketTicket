# TicketTicket, test technique (#TTT)

Petite application de gestion de tickets : consulter la liste des tickets et en créer de nouveaux.
Exercice technique full-stack TypeScript (React + Node.js/Express, données en mémoire).

## Installation et démarrage

**Prérequis :** Node.js 22.9 ou plus récent (pour l'option `--env-file-if-exists`), npm.

Le backend et le frontend se lancent séparément, dans deux terminaux.

**Terminal 1 : backend (API)**

```bash
cd backend
npm install
npm run dev
```

L'API démarre sur http://localhost:3000. Vérification rapide : http://localhost:3000/api/tickets

**Terminal 2 : frontend**

```bash
cd frontend
npm install
npm run dev
```

Ouvrir http://localhost:5173 dans le navigateur.

### Variables d'environnement (facultatif)

Le projet fonctionne sans configuration : chaque variable a une valeur par défaut.
Sans fichier `.env`, le backend affiche « .env not found. Continuing without it. » au démarrage (deux fois, à cause de `tsx watch`) : c'est normal, les valeurs par défaut sont alors utilisées.
Pour les modifier, copier le fichier d'exemple de chaque côté et l'ajuster :

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

| Côté     | Variable       | Défaut                  | Rôle |
|----------|----------------|-------------------------|------|
| backend  | `PORT`         | `3000`                  | port de l'API |
| backend  | `CORS_ORIGIN`  | `http://localhost:5173` | origine du frontend autorisée par CORS |
| frontend | `VITE_API_URL` | `http://localhost:3000` | adresse de l'API |

Les fichiers `.env` ne sont pas versionnés. Côté frontend, les variables `VITE_` sont intégrées au code envoyé au navigateur : elles ne doivent jamais contenir de secret.

> Les données sont conservées en mémoire : elles sont réinitialisées à chaque redémarrage du backend.

### API

| Méthode | Route          | Corps                 | Réponses |
|---------|----------------|-----------------------|----------|
| GET     | `/api/tickets` | aucun                 | `200` liste des tickets (du plus récent au plus ancien) |
| POST    | `/api/tickets` | `{ "title": "..." }`  | `201` ticket créé · `400` titre manquant, vide ou trop long (> 200 caractères), ou JSON mal formé |
| *       | autre route    |                       | `404` |

Toutes les réponses sont en JSON, y compris les erreurs (`{ "error": "..." }`). Une erreur inattendue renvoie un `500` générique.

## Structure du projet

```
backend/src/
  index.ts              démarrage du serveur (port 3000 par défaut)
  app.ts                configuration Express : CORS, JSON, routes, 404, erreurs
  types.ts              type Ticket
  routes/tickets.ts     routes GET et POST, validation
  data/ticketStore.ts   stockage en mémoire et tickets initiaux
frontend/src/
  App.tsx               état de la liste, chargement et erreurs
  api.ts                appels HTTP vers le backend
  types.ts              type Ticket (copie de celui du backend)
  components/TicketForm.tsx   formulaire de création
  components/TicketList.tsx   tableau des tickets
```

## Choix techniques

- **Séparation `app.ts` / `index.ts`** : l'application Express peut être testée sans ouvrir de port.
- **Validation côté serveur** : `req.body` est traité comme `unknown` et chaque champ est vérifié avant utilisation. Le client valide aussi, mais seulement pour donner une réponse immédiate à l'utilisateur.
- **Génération côté backend** de l'identifiant (`randomUUID`), du statut initial (`open`) et de la date de création.
- **Couche `api.ts`** : les composants n'appellent jamais `fetch` directement. Les messages d'erreur du backend sont remontés à l'interface.
- **État remonté dans `App`** : le formulaire signale la création avec `onCreated`, et `App` ajoute le ticket renvoyé par le serveur à la liste, sans recharger la page ni refaire de requête GET.
- **États de l'interface** : chargement, erreur de chargement, liste vide, création en cours (bouton désactivé) et échec de création.

- **Peu de dépendances** : `fetch` natif plutôt qu'Axios que j'avais utilisé dans d'autres projets, mais ici, ça me semblait superflu. `tsx` exécute le TypeScript du backend sans étape de compilation.

- **Gestionnaire d'erreurs Express** : un JSON mal formé renvoie un `400` en JSON, et toute autre erreur un `500` générique. Par défaut, Express répondait en HTML avec la trace complète de la pile (chemins de fichiers inclus).

## Parties incomplètes et améliorations envisagées

- **Type `Ticket` dupliqué** entre le frontend et le backend : il faudrait un dossier "shared" ou quelque chose du genre. J'ai fouillé un peu pour apprendre que la méthode pro, ce serait d'utiliser un monorepo avec npm workspaces. Mais comme c'est un projet démo et que le temps était limité avec le nouvel apprentissage de TypeScript, je suis resté en mode "dupliqué".

- **Validation par schéma** : Un autre truc que j'ai appris sur TypeScript, c'est que, comme c'est une couche par-dessus JavaScript qui disparait à l'exécution, il y a des outils comme Zod qui permettent de valider (le body des requêtes côté serveur + les réponses de l'API côté client) même pendant l'exécution.

- **Tests automatisés** : Claude me suggérait Vitest + Supertest pour l'API, React Testing Library pour les composants. Je me suis noté tout ça pour en apprendre davantage sur les standards TS quand j'aurai du temps, mais ce n'était pas possible dans mes 2-3 heures.

- **Fonctionnalités facultatives** : recherche par titre, pagination, modification du statut. L'énoncé priorise la qualité des fonctionnalités principales alors j'ai préféré consacrer mon temps à bien comprendre et tester le code.

- **Persistance** : Même chose ici où j'ai déjà utilisé plusieurs bases de données (MongoDB, MariaDB, MySQL, etc.) dans des projets précédents. 

## Utilisation de l'IA

**Outils utilisés :** Claude (Anthropic), dans l'application Claude, mode Cowork. 

Opus 5.5, effort faible. En général, je préfère un effort plus bas qui est plus rapide et je passe le temps gagné à vérifier. 

**Tâches pour lesquelles l'IA m'a aidé :**

En gros, j'avais déjà un projet (BoutiqueVinyles) qui avait un stack semblable alors j'ai souhaité m'inspirer de la structure. 

J'ai initialisé les deux projets moi-même (gabarit Vite React + TypeScript pour le frontend, `npm install` des dépendances des deux côtés). Claude a ensuite généré la majorité du code applicatif, que j'ai relu.

Comme c'était ma TOUTE PREMIÈRE EXPÉRIENCE avec TypeScript, c'est de loin ce qui m'a grugé le plus de temps dans le processus parce qu'il y a beaucoup de choses que je voulais m'assurer de comprendre avant de les remettre.

Un exemple de ça, c'est types.ts qui est un tout nouveau concept qui n'existe pas en JavaScript. C'est le genre de truc qui venait de Claude, mais je me suis renseigné pour confirmer que c'est bel et bien un standard pro et moderne. 

CORS vient de mon ancien projet : le backend indique au navigateur que seule une page venant de l'origine du frontend (5173) a le droit de lire ses réponses.

J'ai demandé à Claude d'implanter des variables d'environnement en s'inspirant de mon autre projet.

Je lui ai aussi demandé de créer une première version de ce README en se fiant aux requis demandés dans le PDF.

**Ce que j'ai personnellement vérifié, modifié ou corrigé :**

La deuxième moitié de ce README, ça vient très majoritairement de moi. (D'ailleurs j'ai dépassé le 3h avec la rédaction de tout ça.)

J'ai relu chaque fichier (à part les CSS et les fichiers créés automatiquement des environnements frontend/backend).

J'ai parcouru les différents chemins de données possible. Par exemple, le trajet d'une requête : 
```
  TicketForm.tsx → api.ts → (réseau) → app.ts → routes/tickets.ts → ticketStore.ts
  → réponse 201 → api.ts → TicketForm.tsx → onCreated → App.tsx
```

En faisant les tests (voir ci-bas), j'ai découvert qu'un JSON mal formé renvoyait une page HTML avec la trace de la pile et mes chemins de fichiers. J'ai fait ajouter un gestionnaire d'erreurs dans `app.ts` pour répondre en JSON.

J'ai repris les CSS (en fait, c'est Claude) de mon projet précédent, BoutiqueVinyles, pour flasher un peu mon sens de l'esthétisme et jazzer l'interface un peu. ;)


## Tests effectués

Tests manuels, faits selon les exigences de l'énoncé (les tests automatisés sont dans les améliorations envisagées).

### Backend

Requêtes lancées dans Postman, avec le backend démarré. Pour les `POST` : onglet **Body** → **raw** → **JSON**.

- [x] **Lecture et tickets initiaux** : `GET http://localhost:3000/api/tickets` → `200`, trois tickets, du plus récent au plus ancien
- [x] **Création** : `POST http://localhost:3000/api/tickets`, body `{"title":"Test"}` → `201`, ticket avec `id`, `status: "open"` et `createdAt`
- [x] **Liste mise à jour** : relancer le `GET` → le ticket créé apparaît en premier
- [x] **Titre manquant** : `POST`, body `{}` → `400`, « Le titre est obligatoire. »
- [x] **Titre vide ou seulement des espaces** : `POST`, body `{"title":"   "}` → `400`
- [x] **Mauvais type** : `POST`, body `{"title":123}` → `400`
- [x] **Titre trop long** : `POST`, body avec un titre de 201 caractères → `400`, message sur la limite de 200 caractères
- [x] **Espaces retirés** : `POST`, body `{"title":"  Test  "}` → `201`, titre enregistré `"Test"`
- [x] **JSON invalide** : `POST`, body `{title:` → `400` en JSON, « Le corps de la requête doit être du JSON valide. »
- [x] **Route inconnue** : `GET http://localhost:3000/api/nimporte` → `404` en JSON
- [x] **Données en mémoire** : après un redémarrage du backend, le `GET` ne montre plus le ticket créé, seulement les trois tickets initiaux

### Frontend

- [x] **Liste** : titre, statut et date de création affichés
- [x] **Création sans rechargement** : le nouveau ticket apparaît en haut de la liste et le champ se vide
- [x] **Titre obligatoire** : champ vide ou seulement des espaces → message d'erreur, aucune requête envoyée (vérifié dans l'onglet Network)
- [x] **Chargement** : limitation réseau « Slow 3G » dans les DevTools → « Chargement… »
- [x] **Erreur de chargement** : backend arrêté, page rechargée → message d'erreur
- [x] **Aucun ticket** : tableau initial vidé temporairement dans `ticketStore.ts` → « Aucun ticket pour le moment. »
- [x] **Création en cours** : en « Slow 3G » → bouton « Création… » désactivé
- [x] **Création échouée** : backend arrêté après le chargement de la page → message d'erreur sous le formulaire, le titre reste dans le champ
- [x] **Double clic** : deux clics rapides en « Slow 3G » → un seul ticket créé
- [x] **Persistance pendant la session** : page rechargée après une création → le ticket est toujours là
