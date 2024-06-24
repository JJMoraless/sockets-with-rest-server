import { Request, Response } from 'express'
import { TicketService } from '../services/ticket.service'

export class TicketController {
  constructor(
    private readonly ticketService = new TicketService()
  ) {}

  public getTickets = async (req: Request, res: Response) => {
    const tickets = this.ticketService.getAllTickets()
    res.json({ tickets })
  }

  public getLasTicketNumber = async (req: Request, res: Response) => {
    const lasTickerNumber = this.ticketService.getLastTicketNumber()
    res.json({ number: lasTickerNumber })
  }

  public pendingTickets = async (req: Request, res: Response) => {
    const pendingTickets = this.ticketService.getPendingTickets()
    res.json({ tickets: pendingTickets })
  }

  public createTicket = async (req: Request, res: Response) => {
    const ticketCreated = this.ticketService.createTicket()
    res.status(201).json({ ticket: ticketCreated })
  }

  public drawTicket = async (req: Request, res: Response) => {
    const { desk } = req.params
    const drawTicket = this.ticketService.drawTicket(desk)
    res.json(drawTicket)
  }

  public ticketFinished = async (req: Request, res: Response) => {
    const { ticketId } = req.params
    const finishedTicketRes = this.ticketService.onFinishedTicket(ticketId)
    res.json(finishedTicketRes)
  }

  public workingOn = async (req: Request, res: Response) => {
    const lastWorkingOnTickets = this.ticketService.getLasWorkingOnTickets()
    res.json({tickets: lastWorkingOnTickets})
  }
}
