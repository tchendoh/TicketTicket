import { useState, type FormEvent } from 'react'
import type { Ticket } from '../types'
import { createTicket } from '../api'

interface Props {
  // Appelée quand le backend a confirmé la création : le parent ajoute le ticket à sa liste.
  onCreated: (ticket: Ticket) => void
}

export function TicketForm({ onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false) // état « création en cours »
  const [error, setError] = useState<string | null>(null) // état « création échouée »

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (trimmed === '') {
      setError('Le titre est obligatoire.') // validation côté client (le backend valide aussi)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const ticket = await createTicket(trimmed)
      onCreated(ticket)
      setTitle('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'La création a échoué.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre du ticket"
        maxLength={200}
        disabled={submitting}
        aria-label="Titre du ticket"
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Création…' : 'Créer'}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  )
}
