export interface Ticket {
  id: string
  number: number
  createdAt: Date
  handleAtDest?: string // Escritorio 1, 2,3
  handleAt?: string
  done: boolean
}