// fixDocs.js — CommonJS version
const fs = require('fs')
const glob = require('glob')
const root = process.cwd()

glob
  .sync(`${root}/**/*.js`, {
    ignore: ['**/node_modules/**', '**/docs/**'],
  })
  .forEach(file => {
    let content = fs.readFileSync(file, 'utf-8')

    // Replace all import('x') variants
    content = content
      .replace(/import\s*\(\s*['"`]express['"`]\s*\)\./g, 'Express.')
      .replace(/import\s*\(\s*['"`]mongoose['"`]\s*\)\./g, 'Mongoose.')
      .replace(/import\s*\(\s*['"`]zod['"`]\s*\)\./g, 'Zod.')

    fs.writeFileSync(file, content)
  })

console.log('✅ Fixed import() syntax for JSDoc parsing.')
