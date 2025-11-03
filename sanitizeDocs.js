// sanitizeDocs.js
// Cleans all JSDoc import() syntax and TS-style type signatures for CommonJS compatibility.
const fs = require('fs')
const path = require('path')

function walk(dir, callback) {
  for (const file of fs.readdirSync(dir)) {
    const filepath = path.join(dir, file)
    const stat = fs.statSync(filepath)
    if (stat.isDirectory()) walk(filepath, callback)
    else if (filepath.endsWith('.js')) callback(filepath)
  }
}

function sanitize(file) {
  let code = fs.readFileSync(file, 'utf-8')

  // Replace JSDoc import('express') with Express namespace
  code = code.replace(/\{import\(['"]express['"]\)\}/g, '{Express}')

  // Replace arrow type signatures like Function
  code = code.replace(/\(\)\s*=>\s*Promise<.*?>/g, 'Function')

  // Replace typeof references (like {Function})
  code = code.replace(/\{typeof\s+[A-Za-z0-9_]+\}/g, '{Function}')

  // Replace Object with generic Object
  code = code.replace(/Record<string,\s*any>/g, 'Object')

  fs.writeFileSync(file, code, 'utf-8')
}

walk(__dirname, sanitize)

console.log(
  '✅ Sanitized all JSDoc type expressions for CommonJS compatibility.',
)
