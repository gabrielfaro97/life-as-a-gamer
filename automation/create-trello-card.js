import 'dotenv/config'

const LIFEGAMER_BACKLOG_LIST_ID = '69a1d17d10f47ea44e85136a'

async function createCard(cardName) {
  const key = process.env.TRELLO_KEY
  const token = process.env.TRELLO_TOKEN

  if (!key || !token) {
    console.error('❌ Defina TRELLO_KEY e TRELLO_TOKEN no .env (na raiz do projeto)')
    process.exit(1)
  }

  const url = new URL('https://api.trello.com/1/cards')
  url.searchParams.set('key', key)
  url.searchParams.set('token', token)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: cardName,
      idList: LIFEGAMER_BACKLOG_LIST_ID
    })
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('❌ Erro Trello:', res.status, text)
    process.exit(1)
  }

  const card = await res.json()
  console.log('✅ Card criado:', card.name)
  console.log('   URL:', card.shortUrl)
  return card
}

const [, , cardName] = process.argv
if (!cardName) {
  console.log('Uso: node automation/create-trello-card.js "<nome do card>"')
  process.exit(1)
}

createCard(cardName).catch((err) => {
  console.error(err)
  process.exit(1)
})
