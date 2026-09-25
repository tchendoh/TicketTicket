import type { Ticket } from '../types'

const dateFormat = new Intl.DateTimeFormat('fr-CA', { dateStyle: 'medium', timeStyle: 'short' })

interface Props {
  tickets: Ticket[]
}

export function TicketList({ tickets }: Props) {
  if (tickets.length === 0) {
    return <p className="state">Aucun ticket pour le moment.</p> // état « liste vide »
  }
  return (
    <table className="ticket-list">
      <thead>
        <tr>
          <th>Titre</th>
          <th>Statut</th>
          <th>Créé le</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((t) => (
          <tr key={t.id}>
            <td>{t.title}</td>
            <td>
              <span className={`status status-${t.status}`}>{t.status === 'open' ? 'Ouvert' : 'Fermé'}</span>
            </td>
            <td>{dateFormat.format(new Date(t.createdAt))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
