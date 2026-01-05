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
    join(REPO_ROOT, 'node_modules', 'lucide', 'dist', 'umd', 'lucide.min.js'),
    join(REPO_ROOT, 'static', 'javascript', 'lucide.js')
  )

  copyFileSync(
    join(REPO_ROOT, 'assets', 'javascript', 'codeblock.js'),
    join(REPO_ROOT, 'static', 'javascript', 'codeblock.js')
  )

  copyFileSync(
    join(REPO_ROOT, 'assets', 'javascript', 'lucide-init.js'),
    join(REPO_ROOT, 'static', 'javascript', 'lucide-init.js')
  )
}

main()
