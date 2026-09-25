import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import ticketsRouter from './routes/tickets'

// L'application est séparée du démarrage du serveur (index.ts) pour pouvoir la tester sans ouvrir de port.
export const app = express()

// Origine autorisée par CORS (l'adresse du frontend). Valeur par défaut si aucun .env n'est fourni.
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

app.use(cors({ origin: CORS_ORIGIN }))
app.use(express.json())

app.use('/api/tickets', ticketsRouter)

// Toute autre route : 404 en JSON
app.use((_req, res) => {
  res.status(404).json({ error: 'Route introuvable.' })
})

// Gestionnaire d'erreurs : Express le reconnaît parce qu'il a 4 paramètres (err en premier).
// Sans lui, Express répond en HTML avec la trace complète de la pile.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // JSON mal formé : express.json() signale l'erreur avec type 'entity.parse.failed'
  if (typeof err === 'object' && err !== null && 'type' in err && err.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Le corps de la requête doit être du JSON valide.' })
    return
  }
  console.error(err) // le détail reste dans la console du serveur, jamais envoyé au client
  res.status(500).json({ error: 'Erreur interne du serveur.' })
})
