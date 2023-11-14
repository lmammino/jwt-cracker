export const SUPPORTED_ALGORITHM = ['HS256', 'HS384', 'HS512']

export function decodeHeader(token) {
  const parts = token.split('.')

  try {
    const decodedHeader = JSON.parse(
      Buffer.from(parts[0], 'base64').toString('utf-8'),
    )
    return decodedHeader
    // biome-ignore lint/nursery/noUselessLoneBlockStatements: we actually want to catch possible errors
  } catch (_e) {
    console.log('Invalid token format. Invalid header.')
    return null
  }
}

export function validateToken(token) {
  const isTokenValid =
    validateGeneralJwtFormat(token) && validateHmacAlgorithmHeader(token)
  const algorithm = isTokenValid ? decodeHeader(token).alg : ''

  return { isTokenValid, algorithm }
}

export function validateGeneralJwtFormat(token) {
  if (token.length === 0) {
    console.log('Missing token')
    return false
  }

  const parts = token.split('.')

  if (parts.length !== 3) {
    console.log('Invalid token format. Invalid number of parts.')
    return false
  }

  if (!parts.every((part) => part.length > 0)) {
    console.log('Invalid token format. Parts should not be empty.')
    return false
  }

  return true
}

export function validateHmacAlgorithmHeader(token) {
  const decodedHeader = decodeHeader(token)

  if (!decodedHeader) {
    return false
  }

  if (decodedHeader.typ !== 'JWT') {
    console.log(`Unsupported Typ: ${decodedHeader.typ}`)
    return false
  }

  if (!SUPPORTED_ALGORITHM.includes(decodedHeader.alg)) {
    console.log(
      `Unsupported algorithm: ${
        decodedHeader.alg
      }. Only ${SUPPORTED_ALGORITHM.join(', ')} are supported.`,
    )
    return false
  }

  return true
}
