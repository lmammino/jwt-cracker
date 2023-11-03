export default class JWTValidator {
  static SUPPORTED_ALGORITHM = [
    'HS256',
    'HS384',
    'HS512'
  ]

  static decodeHeader (token) {
    const parts = token.split('.')

    try {
      const decodedHeader = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8'))
      return decodedHeader
    } catch (e) {
      console.log('Invalid token format. Invalid header.')
      return null
    }
  }

  static validateToken (token) {
    const isTokenValid = this.validateGeneralJwtFormat(token) && this.validateHmacAlgorithmHeader(token)
    const algorithm = isTokenValid ? this.decodeHeader(token).alg : ''

    return { isTokenValid, algorithm }
  }

  static validateGeneralJwtFormat (token) {
    const parts = token.split('.')

    if (parts.length !== 3) {
      console.log('Invalid token format. Invalid number of parts.')
      return false
    }

    if (!parts.every(part => part.length > 0)) {
      console.log('Invalid token format. Parts should not be empty.')
      return false
    }

    return true
  }

  static validateHmacAlgorithmHeader (token) {
    const decodedHeader = this.decodeHeader(token)

    if (!decodedHeader) {
      return false
    }

    if (decodedHeader.typ !== 'JWT') {
      console.log(`Unsupported Typ: ${decodedHeader.alg}`)
      return false
    }

    if (!this.SUPPORTED_ALGORITHM.includes(decodedHeader.alg)) {
      console.log(`Unsupported algorithm: ${decodedHeader.alg}. Only ${this.SUPPORTED_ALGORITHM.join(', ')} are supported.`)
      return false
    }

    return true
  }
}
