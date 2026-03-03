import { execSync } from 'child_process'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = join(__dirname, '..')

function run(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', cwd: rootDir, ...opts })
}

export async function checkoutMain() {
  run('git checkout main')
}

export async function branchExists(branch) {
  try {
    const out = run(`git branch --list "${branch}"`)
    return out.trim().length > 0
  } catch {
    return false
  }
}

export async function createBranch(branch) {
  run(`git checkout -b "${branch}"`)
}

export async function checkoutBranch(branch) {
  run(`git checkout "${branch}"`)
}

export async function pushBranch() {
  try {
    run('git push -u origin HEAD')
  } catch (e) {
    console.warn('⚠️ git push falhou:', e.message)
  }
}

export async function prExists(branch) {
  try {
    const out = run(`gh pr list --head "${branch}" --json url`)
    const arr = JSON.parse(out || '[]')
    return arr[0]?.url || null
  } catch {
    return null
  }
}

export async function createPR(branch, title, body) {
  try {
    const out = run(`gh pr create --base main --head "${branch}" --title "${title}" --body "${body}"`)
    const match = out.match(/https:\/\/[^\s]+/)
    return match ? match[0] : out.trim()
  } catch (e) {
    console.warn('⚠️ gh pr create falhou:', e.message)
    return ''
  }
}
