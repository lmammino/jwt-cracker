import { describe, expect, test } from '@jest/globals'
import { spawn } from 'node:child_process'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Imp3dC1jcmFjbGVyIiwiaWF0IjoxNTE2MjM5MDIyfQ.29OQn8UytvagAsG-OwnkzxO2lBw8QEWOuc8ltSZRWCU'

describe('Jwt-cracker', () => {
  test('should return secret found', (done) => {
    const app = spawn('node', ['index.js', '-t', token])

    app.on('exit', (code) => {
      expect(code).toBe(0)
      done()
    })
  }, 15000) // 15 Seconds timeout
})
