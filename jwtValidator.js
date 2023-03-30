export default class JWTValidator {
  static validateToken (token) {
    return (
      this.validateGeneralJwtFormat(token) &&
            this.validateHS256AlgorithmHeader(token)
    )
  }

  static validateGeneralJwtFormat (token) {
    const parts = token.split('.')

    if (parts.length !== 3 || !parts.every(part => part.length > 0)) {
      console.log('Invalid token format')
      return false
    }

    return true
  }

  static validateHS256AlgorithmHeader (token) {
    const parts = token.split('.')
    let decodedHeader

    if (parts.length !== 3) {
      console.log('Invalid token format. Invalid number of parts.')
      return false
    }

    try {
      decodedHeader = JSON.parse(Buffer.from(parts[0], 'base64').toString('utf-8'))
    } catch (e) {
      console.log('Invalid token format. Invalid header.')
      return false
    }

    if (decodedHeader.typ !== 'JWT') {
      console.log(`Unsupported Typ: ${decodedHeader.alg}`)
      return false
    }

    if (decodedHeader.alg !== 'HS256') {
      console.log(`Unsupported algorithm: ${decodedHeader.alg}`)
      return false
    }

    return true
  }
}
