import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cq-uoLxOu3V4RjxnbUAFZ36aSZ24BXiAH8RFDYVA6XU'

const test = spawn('node', ['index.js', token])

test.stdout.pipe(process.stdout)
test.stderr.pipe(process.stderr)

test.on('exit', (code) => {
  assert.equal(code, 0)
})
