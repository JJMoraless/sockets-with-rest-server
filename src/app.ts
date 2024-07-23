import { createServer } from 'http'
import { envs } from './config/envs'
import { AppRoutes, Server, WssService } from './presentation'
;(async () => {
  main()
})()

function main() {
  const server = new Server({
    port: envs.PORT,
  })

  const httpServer = createServer(server.app)
  WssService.initWss({ server: httpServer })

  server.setRoutes(AppRoutes.getRoutes())

  httpServer.listen(envs.PORT, envs.HOST, () => {
    console.log(`Server running on: ${envs.HOST}:${envs.PORT}`)
  })
}
