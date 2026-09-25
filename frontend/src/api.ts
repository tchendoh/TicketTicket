import type { Ticket } from './types'

// Vite n'expose au navigateur que les variables préfixées VITE_ (voir frontend/.env.example).
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const API_URL = `${API_BASE_URL}/api/tickets`

// Lit le message d'erreur JSON du backend ({ error: "..." }) s'il existe.
async function readError(res: Response): Promise<string> {
  try {
    const data: unknown = await res.json()
    if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') {
      return data.error
    }
  } catch {
    // corps absent ou non JSON : on utilise le message générique ci-dessous
  }
  return `Erreur ${res.status}`
}

// GET /api/tickets
export async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as Ticket[]
}

// POST /api/tickets
export async function createTicket(title: string): Promise<Ticket> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return (await res.json()) as Ticket
}
