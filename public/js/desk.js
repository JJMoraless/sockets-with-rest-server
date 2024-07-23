console.log('Escritorio HTML')
const $lblPending = document.querySelector('#lbl-pending')
const $desjHeader = document.querySelector('h1')
const $currentTicektLbl = document.querySelector('small')

const $btnDraw = document.querySelector('#btn-draw')
const $btnDone = document.querySelector('#btn-done')

const searchParams = new URLSearchParams(window.location.search)
if (!searchParams.has('escritorio')) {
  window.location = 'index.html'
  throw new Error('El escritorio es obligatorio')
}

const deskNumber = searchParams.get('escritorio')
$desjHeader.innerHTML = `Escritorio ${deskNumber}`
let workingTicket = null

async function loadInitialCount() {
  const { tickets } = await fetch('/api/tickets/pending').then((res) =>
    res.json(),
  )

  $lblPending.innerHTML = tickets?.length || 0
}

async function onGetTicket() {
  await onFinishTicket()

  const { status, ticket, message } = await fetch(
    `api/tickets/draw/${deskNumber}`,
  ).then((res) => res.json())

  if (status === 'error') {
    $currentTicektLbl.innerHTML = message
    return
  }

  workingTicket = ticket
  $currentTicektLbl.innerHTML = `Ticket ${ticket.number}`
}

async function onFinishTicket() {
  if (!workingTicket) return

  const { status, message } = await fetch(
    `api/tickets/done/${workingTicket.id}`,
    { method: 'PUT' },
  ).then((res) => res.json())

  console.log({ status, message })

  if (status === 'ok') {
    workingTicket = null
    $currentTicektLbl.innerText = 'Nadie'
  }
}

function connectToWebSockets() {
  const socket = new WebSocket('ws://localhost:3000/ws')
  // recibir un evento "cliente recibe el mensaje del servidor web socket"
  //* "on"  = porque es como un evento que sucede cuando se recibe el mensaje
  socket.onmessage = (event) => {
    const { type, payload } = JSON.parse(event.data)
    console.log({ type, payload })

    if (type === 'on-ticket-count-change') {
      // * cuando el servidor envia un mensaje de que el contador de tickets pendientes ha cambiado
      const numberTickets = payload
      $lblPending.innerHTML = numberTickets
    }
  }

  socket.onclose = (event) => {
    console.log('Connection closed')
    setTimeout(() => {
      console.log('retrying to connect')
      connectToWebSockets()
    }, 1500)
  }

  socket.onopen = (event) => {
    console.log('Connected')
  }
}

$btnDraw.addEventListener('click', onGetTicket)
$btnDone.addEventListener('click', onFinishTicket)

loadInitialCount()
connectToWebSockets()
