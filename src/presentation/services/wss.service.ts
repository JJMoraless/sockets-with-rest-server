import { Server } from 'http'
import { WebSocket, WebSocketServer } from 'ws'

interface Options {
  server: Server
  path?: string // ws
}

// Singleton websocket service
export class WssService {
  private static _instance: WssService
  private wss: WebSocketServer

  // init with options, create wss and start listening
  private constructor(options: Options) {
    const { server, path = '/ws' } = options // localhost:3000/ws
    this.wss = new WebSocketServer({ server, path })
    this.start()
  }

  // create instance
  static initWss(options: Options) {
    WssService._instance = new WssService(options)
  }

  // get instance or throw error if not created
  static getInstace(): WssService {
    if (!WssService._instance) {
      throw new Error('WWS not created')
    }
    return WssService._instance
  }

  start() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('client connected')
      ws.on('close', () => console.log('client disconnected'))
    })
  }
}
