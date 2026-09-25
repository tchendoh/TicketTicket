import { randomUUID } from 'node:crypto'
import type { Ticket } from '../types'

// Stockage en mémoire : les données sont réinitialisées à chaque redémarrage du serveur.
const tickets: Ticket[] = [
  {
    id: randomUUID(),
    title: 'Attaque de zombies dans le datacenter principal',
    status: 'open',
    createdAt: '2026-09-20T14:30:00.000Z',
  },
  {
    id: randomUUID(),
    title: 'Manque de papier dans trois imprimantes',
    status: 'open',
    createdAt: '2026-09-22T09:15:00.000Z',
  },
  {
    id: randomUUID(),
    title: 'Faute de frappe dans notre logo',
    status: 'closed',
    createdAt: '2026-09-18T16:45:00.000Z',
  },
]

// Retourne une copie triée du plus récent au plus ancien.
export function getAllTickets(): Ticket[] {
  return [...tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

// Le backend génère l'identifiant, le statut initial et la date de création.
export function createTicket(title: string): Ticket {
  const ticket: Ticket = {
    id: randomUUID(),
    title,
    status: 'open',
    createdAt: new Date().toISOString(),
  }
  tickets.push(ticket)
  return ticket
}
