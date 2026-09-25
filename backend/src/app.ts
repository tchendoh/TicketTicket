import express from 'express'
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
