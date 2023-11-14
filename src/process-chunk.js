import { createHmac } from 'node:crypto'

const DIGEST_ALGORITHM = {
	HS256: 'sha256',
	HS384: 'sha384',
	HS512: 'sha512',
}

const signatureGenerator = (algorithm, content) => (secret) =>
	createHmac(DIGEST_ALGORITHM[algorithm], secret)
		.update(content)
		.digest('base64')
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')

process.on('message', ({ chunk, content, signature, algorithm }) => {
	const generateSignature = signatureGenerator(algorithm, content)
	for (let i = 0; i < chunk.length; i++) {
		const currentSignature = generateSignature(chunk[i])
		if (currentSignature === signature) {
			process.send(chunk[i])
			process.exit(0)
		}
	}
	process.send(null)
	process.exit(1)
})
