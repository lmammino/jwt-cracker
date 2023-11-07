import { describe, expect, test } from '@jest/globals'
import { spawn } from 'node:child_process'

const tokenHS256 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Imp3dC1jcmFjbGVyIiwiaWF0IjoxNTE2MjM5MDIyfQ.29OQn8UytvagAsG-OwnkzxO2lBw8QEWOuc8ltSZRWCU'
const tokenHS512 = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiJ9.tR6snQQ6RIf0RH9oEl_v5xDlLLduU2gzZhD86QO64ZtXv30Vjcpi61vbB7kBMFAvZFozGrtdhlonAzQ-k9OuZA'

describe('Jwt-cracker', () => {
  test('should return secret found with HS256', (done) => {
    const app = spawn('node', ['index.js', '-t', tokenHS256])

    app.on('exit', (code) => {
      expect(code).toBe(0)
      done()
    })
  }, 15000) // 15 Seconds timeout

  test('should return secret found with HS512', (done) => {
    const app = spawn('node', ['index.js', '-t', tokenHS512])

    app.on('exit', (code) => {
      expect(code).toBe(0)
      done()
    })
  }, 15000) // 15 Seconds timeout
})
