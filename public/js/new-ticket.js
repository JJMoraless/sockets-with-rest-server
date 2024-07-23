const currentTIcketLb = document.querySelector('span')
const currentTciketBtn = document.querySelector('button')

async function getLastTicket() {
  const lastTicket = await fetch('/api/tickets/last').then((res) => res.json())
  currentTIcketLb.innerHTML = lastTicket?.number || 'Nadie'
}

async function createTicket() {
  const newTicket = await fetch('/api/tickets', {
    method: 'POST',
  }).then((res) => res.json())

  currentTIcketLb.innerHTML = newTicket?.ticket?.number || 'Nadie'
}

currentTciketBtn.addEventListener('click', createTicket)
getLastTicket()
