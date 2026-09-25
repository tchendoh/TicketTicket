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
| POST    | `/api/tickets` | `{ "title": "..." }`  | `201` ticket créé · `400` titre manquant, vide ou trop long (> 200 caractères) |
| *       | autre route    |                       | `404` |

## Structure du projet

```
backend/src/
  index.ts              démarrage du serveur (port 3000)
  app.ts                configuration Express : CORS, JSON, routes, 404
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


## Parties incomplètes et améliorations envisagées

- **Type `Ticket` dupliqué** entre le frontend et le backend : il faudrait un dossier "shared" ou quelque chose du genre. J'ai fouillé un peu pour apprendre que la méthode pro, ce serait d'utiliser un monorepo avec npm workspaces. Mais comme c'est un projet démo et que le temps était limité avec le nouvel apprentissage de TypeScript, je suis resté en mode "dupliqué".

- **Validation par schéma** : Un autre truc que j'ai appris sur TypeScript, c'est que, comme c'est une couche par-dessus JavaScript qui disparait à l'exécution, il y a des outils comme Zod qui permettent de valider (le body des requêtes côté serveur + les réponses de l'API côté client) même pendant l'exécution.

- **Tests automatisés** : Claude me suggérait Vitest + Supertest pour l'API, React Testing Library pour les composants. Je me suis noté tout ça pour en apprendre davantage sur les standards TS quand j'aurai du temps, mais ce n'était pas possible dans mon 2-3 heures.

- **Fonctionnalités facultatives** : recherche par titre, pagination, modification du statut. 
- **Persistance** : une vraie base de données (ex. SQLite ou PostgreSQL).

## Utilisation de l'IA

**Outils utilisés :** Claude (Anthropic), dans l'application Claude (mode Cowork). 

Opus 5.5, effort faible. En général, je préfère un effort plus bas qui est plus rapide et je passe le temps gagné à vérifier. 

**Tâches pour lesquelles l'IA m'a aidé :**

En gros, j'avais déjà un projet (BoutiqueVinyles) qui avait un stack semblable alors j'ai souhaité m'inspirer de la structure. 

J'ai initialisé les deux projets moi-même (gabarit Vite React + TypeScript pour le frontend, `npm install` des dépendances des deux côtés). Claude a ensuite généré la majorité du code applicatif, que j'ai relu.

Comme c'était ma TOUTE PREMIÈRE EXPÉRIENCE avec TypeScript, c'est de loin ce qui m'a grugé le plus de temps dans le processus parce qu'il y a beaucoup de choses que je voulais m'assurer de comprendre avant de les remettre.

Un exemple de ça, c'est types.ts qui est tout nouveau concept qui n'existe pas en JavaScript. C'est le genre de truc qui venait de Claude, mais je me suis renseigné pour confirmer que c'est bel et bien un standard pro et moderne. 

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
J'ai repris les CSS (en fait, c'est Claude) de mon projet précédent, BoutiqueVinyles, pour flasher un peu mon sens de l'esthétisme et jazzer l'interface un peu. ;)

