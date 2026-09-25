// Même forme que le type Ticket du backend (backend/src/types.ts).
// Dans un vrai projet, on partagerait ce fichier entre les deux (ex. un paquet « shared »).
export type TicketStatus = 'open' | 'closed'

export interface Ticket {
  id: string
  title: string
  status: TicketStatus
  createdAt: string // date ISO 8601
}
