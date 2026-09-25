// Statuts possibles d'un ticket. Un « union type » : seules ces deux valeurs sont acceptées.
export type TicketStatus = 'open' | 'closed'

export interface Ticket {
  id: string
  title: string
  status: TicketStatus
  createdAt: string // date ISO 8601, ex. "2026-09-24T19:00:00.000Z"
}
