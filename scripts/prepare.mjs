import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const REPO_ROOT = process.cwd()

function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env })
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`)
  }
}

function main() {
  ensureDir(join(REPO_ROOT, 'static', 'css'))
  ensureDir(join(REPO_ROOT, 'static', 'javascript'))

  run(join(REPO_ROOT, 'node_modules', '.bin', 'postcss'), [
    join(REPO_ROOT, 'assets', 'css', 'main.css'),
    '--output',
    join(REPO_ROOT, 'static', 'css', 'main.css')
  ])

  copyFileSync(
    join(REPO_ROOT, 'assets', 'javascript', 'fontawesome.js'),
    join(REPO_ROOT, 'static', 'javascript', 'fontawesome.js')
  )
}

main()

