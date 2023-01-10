import { createHmac } from 'node:crypto'

const generateSignature = function (content, secret) {
  return createHmac('sha256', secret)
    .update(content)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}
process.on('message', function ({ chunk, content, signature }) {
  for (let i = 0; i < chunk.length; i++) {
    const currentSignature = generateSignature(content, chunk[i])
    if (currentSignature === signature) {
      process.send(chunk[i])
      process.exit(0)
    }
  }
  process.send(null)
  process.exit(1)
})
