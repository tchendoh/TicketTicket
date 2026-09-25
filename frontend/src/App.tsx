import { useEffect, useState } from 'react'
import type { Ticket } from './types'
import { fetchTickets } from './api'
import { TicketForm } from './components/TicketForm'
import { TicketList } from './components/TicketList'
import './App.css'

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true) // état « chargement »
  const [error, setError] = useState<string | null>(null) // état « erreur de chargement »

  // Chargement initial, une seule fois au montage du composant ([] = aucune dépendance).
  useEffect(() => {
    fetchTickets()
      .then(setTickets)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Impossible de charger les tickets.'),
      )
      .finally(() => setLoading(false))
  }, [])

  // On ajoute le ticket renvoyé par le backend en tête de liste : pas besoin de recharger.
  function handleCreated(ticket: Ticket) {
    setTickets((prev) => [ticket, ...prev])
  }

  return (
    <main>
      <h1>Tickets</h1>
      <TicketForm onCreated={handleCreated} />
      {loading && <p className="state">Chargement…</p>}
      {error && <p className="error" role="alert">Erreur : {error}</p>}
      {!loading && !error && <TicketList tickets={tickets} />}
    </main>
  )
}

export default App
