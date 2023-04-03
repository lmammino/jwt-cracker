import JWTValidator from '../jwtValidator.js'

import { describe, expect, test } from '@jest/globals'

describe('JWTValidator', () => {
  const validHS256Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Imp3dC1jcmFja2VyIn0.TaRgJUlx6BXwhna8AYF8xGyAMmxODXYIjnNuYju--c8'
  const invalidFormatToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Imp3dC1jcmFja2VyIn0'
  const invalidFormatEmptyPartsToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..'
  const invalidHeaderToken = 'eyJhJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpqd3QtY3JhY2tlciJ9.c5ZqtVGS-Jc6WUJsaRBVzfpUOcMFLu0lo0fd2FwDnJE'
  const nonJwtTypToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ik5vdC1Kd3QifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpqd3QtY3JhY2tlciJ9.8SmsCZptHRoDeGclg5Tl_N5-tSJF24BBPYa_YKp8b4g'
  const validButUnsupportedHS512Token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Imp3dC1jcmFja2VyIn0.CcyaiMxfTVbG0SNPW9btRr5mJ3DCt0LOjVFtNJZW6ogjJxbeT6tAixi1uut2M8rlbTBYOqAxD56eIL7AXXaatw'

  describe('validateToken', () => {
    test('should return true for a valid HS256 JWT token', () => {
      const result = JWTValidator.validateToken(validHS256Token)
      expect(result).toBe(true)
    })

    test('should return false for a token with less than three parts', () => {
      const result = JWTValidator.validateToken(invalidFormatToken)
      expect(result).toBe(false)
    })

    test('should return false for an unsupported token typ', () => {
      const result = JWTValidator.validateToken(nonJwtTypToken)
      expect(result).toBe(false)
    })

    test('should return false for an unsupported HS512 algorithm', () => {
      const result = JWTValidator.validateToken(validButUnsupportedHS512Token)
      expect(result).toBe(false)
    })
  })

  describe('validateGeneralJwtFormat', () => {
    test('should return true for a valid HS256 JWT token', () => {
      const result = JWTValidator.validateGeneralJwtFormat(validHS256Token)
      expect(result).toBe(true)
    })

    test('should return false for a token with less than three parts', () => {
      const result = JWTValidator.validateGeneralJwtFormat(invalidFormatToken)
      expect(result).toBe(false)
    })

    test('should return false for a token with empty parts', () => {
      const result = JWTValidator.validateGeneralJwtFormat(invalidFormatEmptyPartsToken)
      expect(result).toBe(false)
    })
  })

  describe('validateHS256AlgorithmHeader', () => {
    test('should return true for valid token with typ JWT and algorithm HS256', () => {
      const result = JWTValidator.validateToken(validHS256Token)
      expect(result).toBe(true)
    })

    test('should return false for a token with a invalid number of parts', () => {
      const result = JWTValidator.validateHS256AlgorithmHeader(invalidFormatToken)
      expect(result).toBe(false)
    })

    test('should return false for a token with a invalid header', () => {
      const result = JWTValidator.validateHS256AlgorithmHeader(invalidHeaderToken)
      expect(result).toBe(false)
    })

    test('should return false for an unsupported token typ', () => {
      const result = JWTValidator.validateHS256AlgorithmHeader(nonJwtTypToken)
      expect(result).toBe(false)
    })

    test('should return false for an unsupported HS512 algorithm', () => {
      const result = JWTValidator.validateHS256AlgorithmHeader(validButUnsupportedHS512Token)
      expect(result).toBe(false)
    })
  })
})
