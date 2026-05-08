import { existsSync, readFileSync, statSync } from 'node:fs'

const required = ['docs/index.html', 'docs/404.html', 'docs/manifest.webmanifest', 'docs/sw.js']

for (const path of required) {
  if (!existsSync(path) || statSync(path).size === 0) {
    throw new Error(`Missing Pages artifact: ${path}`)
  }
}

const index = readFileSync('docs/index.html', 'utf8')
if (!index.includes('/highlight-recall/assets/')) {
  throw new Error('index.html does not use the expected GitHub Pages base path')
}

console.log('Pages artifacts look ready.')
