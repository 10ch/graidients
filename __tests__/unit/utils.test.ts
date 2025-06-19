import { 
  calculatePercentage, 
  sanitizeInput, 
  formatDate
} from '@/lib/utils'

describe('Core Utils Functions', () => {
  describe('calculatePercentage', () => {
    it('should calculate percentages correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25)
      expect(calculatePercentage(1, 3)).toBe(33)
      expect(calculatePercentage(2, 3)).toBe(67)
      expect(calculatePercentage(50, 200)).toBe(25)
      expect(calculatePercentage(0, 100)).toBe(0)
    })

    it('should handle zero total', () => {
      expect(calculatePercentage(5, 0)).toBe(0)
      expect(calculatePercentage(0, 0)).toBe(0)
    })

    it('should round to nearest integer', () => {
      expect(calculatePercentage(1, 3)).toBe(33) // 33.33... rounds to 33
      expect(calculatePercentage(2, 3)).toBe(67) // 66.66... rounds to 67
      expect(calculatePercentage(1, 6)).toBe(17) // 16.66... rounds to 17
    })
  })

  describe('sanitizeInput', () => {
    it('should remove < and > characters to prevent XSS', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
      expect(sanitizeInput('Is AI < human intelligence?')).toBe('Is AI  human intelligence?')
      expect(sanitizeInput('5 > 3 and 3 < 5')).toBe('5  3 and 3  5')
    })

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world')
      expect(sanitizeInput('\n\ttest\n\t')).toBe('test')
    })

    it('should limit length to 500 characters', () => {
      const longString = 'a'.repeat(600)
      expect(sanitizeInput(longString)).toHaveLength(500)
      expect(sanitizeInput(longString)).toBe('a'.repeat(500))
    })

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput('   ')).toBe('')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = '2024-01-15T14:30:00Z'
      const formatted = formatDate(date)
      
      // Note: The exact output depends on the system locale
      expect(formatted).toMatch(/Jan/)
      expect(formatted).toMatch(/15/)
      expect(formatted).toMatch(/2024/)
    })

    it('should handle invalid dates gracefully', () => {
      const invalidDate = 'not-a-date'
      const formatted = formatDate(invalidDate)
      expect(formatted).toMatch(/Invalid Date/)
    })
  })
})