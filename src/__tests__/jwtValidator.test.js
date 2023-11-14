import { describe, expect, test } from '@jest/globals'
import {
  validateGeneralJwtFormat,
  validateHmacAlgorithmHeader,
  validateToken,
} from '../jwtValidator'

describe('JWTValidator', () => {
  const validHS256Token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Imp3dC1jcmFja2VyIn0.TaRgJUlx6BXwhna8AYF8xGyAMmxODXYIjnNuYju--c8'
  const validHS384Token =
    'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiJ9.zJjZgooLqpGti_j6-KRgY-22xWlExFDhRLho0EzRY6iAk68tu-czZOp13AeJ6aHo'
  const validHS512Token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiJ9.tR6snQQ6RIf0RH9oEl_v5xDlLLduU2gzZhD86QO64ZtXv30Vjcpi61vbB7kBMFAvZFozGrtdhlonAzQ-k9OuZA'
  const invalidFormatToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Imp3dC1jcmFja2VyIn0'
  const invalidFormatEmptyPartsToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..'
  const invalidHeaderToken =
    'eyJhJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpqd3QtY3JhY2tlciJ9.c5ZqtVGS-Jc6WUJsaRBVzfpUOcMFLu0lo0fd2FwDnJE'
  const nonJwtTypToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6Ik5vdC1Kd3QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpqd3QtY3JhY2tlciJ9.8SmsCZptHRoDeGclg5Tl_N5-tSJF24BBPYa_YKp8b4g'
  const validButUnsupportedRS256Token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJSUzI1NmluT1RBIiwibmFtZSI6IkpvaG4gRG9lIn0.ICV6gy7CDKPHMGJxV80nDZ7Vxe0ciqyzXD_Hr4mTDrdTyi6fNleYAyhEZq2J29HSI5bhWnJyOBzg2bssBUKMYlC2Sr8WFUas5MAKIr2Uh_tZHDsrCxggQuaHpF4aGCFZ1Qc0rrDXvKLuk1Kzrfw1bQbqH6xTmg2kWQuSGuTlbTbDhyhRfu1WDs-Ju9XnZV-FBRgHJDdTARq1b4kuONgBP430wJmJ6s9yl3POkHIdgV-Bwlo6aZluophoo5XWPEHQIpCCgDm3-kTN_uIZMOHs2KRdb6Px-VN19A5BYDXlUBFOo-GvkCBZCgmGGTlHF_cWlDnoA9XTWWcIYNyUI4PXNw'
  const emptyToken = ''

  describe('validateToken', () => {
    test('should return true for a valid HS256 JWT token', () => {
      const { isTokenValid, algorithm } = validateToken(validHS256Token)
      expect(isTokenValid).toBe(true)
      expect(algorithm).toBe('HS256')
    })

    test('should return true for a valid HS384 JWT token', () => {
      const { isTokenValid, algorithm } = validateToken(validHS384Token)
      expect(isTokenValid).toBe(true)
      expect(algorithm).toBe('HS384')
    })

    test('should return true for a valid HS512 JWT token', () => {
      const { isTokenValid, algorithm } = validateToken(validHS512Token)
      expect(isTokenValid).toBe(true)
      expect(algorithm).toBe('HS512')
    })

    test('should return false for a token with less than three parts', () => {
      const { isTokenValid } = validateToken(invalidFormatToken)
      expect(isTokenValid).toBe(false)
    })

    test('should return false for an unsupported token typ', () => {
      const { isTokenValid } = validateToken(nonJwtTypToken)
      expect(isTokenValid).toBe(false)
    })

    test('should return false for an unsupported token algorithm', () => {
      const { isTokenValid } = validateToken(validButUnsupportedRS256Token)
      expect(isTokenValid).toBe(false)
    })
  })

  describe('validateGeneralJwtFormat', () => {
    test('should return true for a valid HS256 JWT token', () => {
      const result = validateGeneralJwtFormat(validHS256Token)
      expect(result).toBe(true)
    })

    test('should return false for a token with less than three parts', () => {
      const result = validateGeneralJwtFormat(invalidFormatToken)
      expect(result).toBe(false)
    })

    test('should return false for a token with empty parts', () => {
      const result = validateGeneralJwtFormat(invalidFormatEmptyPartsToken)
      expect(result).toBe(false)
    })

    test('should return false if no token is provided', () => {
      const result = validateGeneralJwtFormat(emptyToken)
      expect(result).toBe(false)
    })
  })

  describe('validateHmacAlgorithmHeader', () => {
    test('should return true for valid token with typ JWT and algorithm HS256', () => {
      const { isTokenValid } = validateToken(validHS256Token)
      expect(isTokenValid).toBe(true)
    })

    test('should return true for valid token with typ JWT and algorithm HS384', () => {
      const { isTokenValid } = validateToken(validHS384Token)
      expect(isTokenValid).toBe(true)
    })

    test('should return true for valid token with typ JWT and algorithm HS512', () => {
      const { isTokenValid } = validateToken(validHS512Token)
      expect(isTokenValid).toBe(true)
    })

    test('should return false for a token with a invalid header', () => {
      const result = validateHmacAlgorithmHeader(invalidHeaderToken)
      expect(result).toBe(false)
    })

    test('should return false for an unsupported token typ', () => {
      const result = validateHmacAlgorithmHeader(nonJwtTypToken)
      expect(result).toBe(false)
    })

    test('should return false for an unsupported token algorithm', () => {
      const result = validateHmacAlgorithmHeader(validButUnsupportedRS256Token)
      expect(result).toBe(false)
    })
  })
})
