import { UuidAdapter } from '../../config/uuid.adapter'
import { Ticket } from '../../domain/interfaces/ticket'

export class TicketService {
  private readonly tickets: Ticket[] = [
    { id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false },
  ]

  private readonly workingOnTickets: Ticket[] = []

  getAllTickets(): Ticket[] {
    return this.tickets
  }


  getPendingTickets(): Ticket[] {
    return this.tickets.filter((ticket) => !ticket.handleAtDesk)
  }

  getLasWorkingOnTickets(): Ticket[] {
    return this.workingOnTickets.splice(0, 4)
  }

  getLastTicketNumber(): number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0
  }

  createTicket(): Ticket {
    const ticket: Ticket = {
      id: UuidAdapter.v4(),
      number: this.getLastTicketNumber() + 1,
      createdAt: new Date(),
      done: false,
      handleAtDesk: undefined,
      handleAt: undefined,
    }

    this.tickets.push(ticket)
    return ticket
  }

  drawTicket(desk: string) {
    const ticket = this.tickets.find((ticketItem) => !ticketItem.handleAtDesk)
    if (!ticket) return { status: 'error', message: 'No ticket available' }

    ticket.handleAtDesk = desk
    ticket.handleAt = new Date()

    this.workingOnTickets.unshift({ ...ticket })

    // todo: WS
    return { status: 'ok', ticket }
  }

  onFinishedTicket(ticketId: string) {
    const ticket = this.tickets.find((ticketItem) => ticketItem.id === ticketId)
    if (!ticket) return { status: 'error', message: 'Ticket not found' }

    this.tickets.map((ticketItem: Ticket) => {
      if (ticketItem.id === ticketId) ticketItem.done = true
      return ticketItem
    })

    return { status: 'ok', ticket }
  }
}