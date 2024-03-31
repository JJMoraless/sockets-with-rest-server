import { Server } from 'http'
import { WebSocket, WebSocketServer } from 'ws'

interface Options {
  server: Server
  path?: string // ws
}

export class WssService {
  private static _instance: WssService
  private wss: WebSocketServer

  private constructor(options: Options) {
    const { server, path = '/ws' } = options // localhost:3000/ws
    this.wss = new WebSocketServer({ server, path })
    this.start()
  }

  static initWss(options: Options) {
    WssService._instance = new WssService(options)
  }

  static getInstace(): WssService {
    if (!WssService._instance) {
      throw new Error('WWS not created')
    }
    return WssService._instance
  }

  start() {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('close', () => console.log('client connected'))
    })
  }
}
