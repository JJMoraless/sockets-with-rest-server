import { UuidAdapter } from '../../config/uuid.adapter'
import { Ticket } from '../../domain/interfaces/ticket'
import { WssService } from './wss.service'

export class TicketService {
  constructor(private readonly wssService = WssService.getInstace()) { }

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
    return this.workingOnTickets
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
    this.onTicketNumberChange()
    return ticket
  }

  // asignar pantalla
  drawTicket(desk: string) {
    // buscar ticket disponible
    const ticket = this.tickets.find((ticket) => !ticket.handleAtDesk)
    if (!ticket) return { status: 'error', message: 'No ticket available' }

    // asignar ticket a pantalla
    ticket.handleAtDesk = desk
    ticket.handleAt = new Date()

    // agregar ticket a lista de trabajo
    this.workingOnTickets.unshift({ ...ticket })
    this.onTicketNumberChange()
    this.onWorkingOnChanged()
    return { status: 'ok', ticket }
  }

  // terminar ticket
  onFinishedTicket(ticketId: string) {
    const ticketFound = this.tickets.find((ticketItem) => ticketItem.id === ticketId)
    if (!ticketFound) return { status: 'error', message: 'Ticket not found' }

    this.tickets.map((ticketItem: Ticket) => { // mardcar ticket como finalizado
      if (ticketItem.id === ticketId) ticketItem.done = true
      return ticketItem
    })

    return { status: 'ok' }
  }

  //*  sockets metods
  private onTicketNumberChange() {
    const pendeingTickets = this.getPendingTickets()
    this.wssService.sendMessage(
      'on-ticket-count-change',
      pendeingTickets.length,
    )
  }

  private onWorkingOnChanged() {
    this.wssService.sendMessage(
      'on-working-changed',
      this.getLasWorkingOnTickets(),
    )
  }
}
