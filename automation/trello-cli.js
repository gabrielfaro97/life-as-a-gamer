import 'dotenv/config'
import {
  checkoutMain,
  branchExists,
  createBranch,
  checkoutBranch,
  pushBranch,
  createPR,
  prExists
} from './git.js'

const TRELLO_BASE = 'https://api.trello.com/1'
const MEMBER_ID = '592889d4be22ff77007b9cae'

function trelloUrl(path, params = {}) {
  const key = process.env.TRELLO_KEY
  const token = process.env.TRELLO_TOKEN
  if (!key || !token) return null
  const url = new URL(TRELLO_BASE + path)
  url.searchParams.set('key', key)
  url.searchParams.set('token', token)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return url.toString()
}

async function moveCardOnTrello(boardName, cardName, newLocation) {
  const key = process.env.TRELLO_KEY
  const token = process.env.TRELLO_TOKEN
  if (!key || !token) {
    console.log('⚠️ TRELLO_KEY/TRELLO_TOKEN não definidos; pulando movimento no Trello.')
    return
  }
  console.log('🔎 Localizando board...')
  const boardsUrl = trelloUrl('/members/me/boards', { fields: 'name,id' })
  const boardsRes = await fetch(boardsUrl)
  if (!boardsRes.ok) throw new Error('Trello boards: ' + (await boardsRes.text()))
  const boards = await boardsRes.json()
  const board = boards.find((b) => b.name && b.name.trim().toLowerCase() === boardName.trim().toLowerCase())
  if (!board) throw new Error(`Board não encontrado: ${boardName}`)
  console.log('🔎 Localizando card...')
  const listsUrl = trelloUrl(`/boards/${board.id}/lists`, { fields: 'name,id' })
  const cardsUrl = trelloUrl(`/boards/${board.id}/cards`, { fields: 'name,id,idList' })
  const [listsRes, cardsRes] = await Promise.all([fetch(listsUrl), fetch(cardsUrl)])
  if (!listsRes.ok || !cardsRes.ok) throw new Error('Trello lists/cards: ' + (await listsRes.text()) + (await cardsRes.text()))
  const lists = await listsRes.json()
  const cards = await cardsRes.json()
  const card = cards.find((c) => c.name && c.name.trim().toLowerCase() === cardName.trim().toLowerCase())
  if (!card) throw new Error(`Card não encontrado: ${cardName}`)
  const targetName = newLocation.toLowerCase().replace(/\s+/g, ' ')
  const targetList = lists.find((l) => l.name && l.name.toLowerCase() === targetName)
  if (!targetList) throw new Error(`Lista não encontrada: ${newLocation}`)
  console.log('🚚 Movendo card...')
  const putUrl = trelloUrl(`/cards/${card.id}`)
  const moveRes = await fetch(putUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idList: targetList.id })
  })
  if (!moveRes.ok) throw new Error('Trello move: ' + (await moveRes.text()))
  console.log('👤 Atribuindo a você...')
  const assignRes = await fetch(putUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idMembers: MEMBER_ID })
  })
  if (!assignRes.ok) {
    const err = await assignRes.text()
    if (err.includes('already on the card')) console.log('👤 Você já está no card.')
    else console.error('❌ Erro:', err)
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function handleStart(cardName) {
  const branch = `feature/${slugify(cardName)}`

  console.log('🔵 Criando/verificando branch...')

  await checkoutMain()

  const exists = await branchExists(branch)

  if (!exists) {
    await createBranch(branch)
    console.log(`🚀 Branch criada: ${branch}`)
  } else {
    await checkoutBranch(branch)
    console.log(`📦 Branch já existia, checkout feito: ${branch}`)
  }
}

async function handleReview(cardName) {
  const branch = `feature/${slugify(cardName)}`

  console.log('🟣 Criando PR...')

  await checkoutBranch(branch)
  await pushBranch()

  const existingPR = await prExists(branch)

  if (existingPR) {
    console.log('🧪 PR já existe:', existingPR)
    return
  }

  const prUrl = await createPR(
    branch,
    cardName,
    `PR automático gerado via automação`
  )

  console.log('🧪 PR criado:', prUrl)
}

async function main() {
  const [, , boardName, cardName, newLocation] = process.argv

  if (!boardName || !cardName || !newLocation) {
    console.log('Uso correto:')
    console.log(
      'npm run trello-automation "<board>" "<card>" "<newLocation>"'
    )
    return
  }

  console.log(`Board: ${boardName}`)
  console.log(`Card: ${cardName}`)
  console.log(`Nova lista: ${newLocation}`)
  console.log('------------------------')

  await moveCardOnTrello(boardName, cardName, newLocation)

  if (newLocation === 'In Progress') {
    await handleStart(cardName)
  }

  if (newLocation === 'Review') {
    await handleReview(cardName)
  }
}

main()