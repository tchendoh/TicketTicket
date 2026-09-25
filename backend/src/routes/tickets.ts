import { Router } from 'express'
import { createTicket, getAllTickets } from '../data/ticketStore'

const router = Router()

const TITLE_MAX_LENGTH = 200

// GET /api/tickets : liste des tickets
router.get('/', (_req, res) => {
  res.status(200).json(getAllTickets())
})

// POST /api/tickets : création d'un ticket. Corps attendu : { "title": "..." }
router.post('/', (req, res) => {
  // req.body n'est pas fiable : on le traite comme « unknown » et on vérifie chaque champ.
  const body: unknown = req.body
  const title =
    typeof body === 'object' && body !== null && 'title' in body ? body.title : undefined

  if (typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'Le titre est obligatoire.' })
    return
  }
  if (title.trim().length > TITLE_MAX_LENGTH) {
    res.status(400).json({ error: `Le titre ne doit pas dépasser ${TITLE_MAX_LENGTH} caractères.` })
    return
  }

  const ticket = createTicket(title.trim())
  res.status(201).json(ticket)
})

export default router
