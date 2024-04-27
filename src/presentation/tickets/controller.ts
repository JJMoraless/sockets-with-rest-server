import { Request, Response } from "express";

export class TicketController {
  constructor() {}

  public getTickets = async (req: Request, res: Response) => {
    res.json({ message: 'getTickets' })
  }

  public getLasTicketNumber = async (req: Request, res: Response) => {
    res.json({ message: 'getLasTicketNumber' })
  }

  public pendingTickets = async (req: Request, res: Response) => {
    res.json({ message: 'pendingTickets' })
  }

  public createTicket = async (req: Request, res: Response) => {
    res.json({ message: 'createTicket' })
  }

  public drawTicket = async (req: Request, res: Response) => {
    res.json({ message: 'drawTicket' })
  }

  public ticketFinished = async (req: Request, res: Response) => {
    res.json({ message: 'ticketFinished' })
  }

  public workingOn = async (req: Request, res: Response) => {
    res.json({ message: 'workingOn' })
  }

}
