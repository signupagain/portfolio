import { describe, it, expect } from 'vitest'

describe('formatBytes', () => {
	it('should format bytes correctly with default parameters', () => {
		expect(formatBytes(0)).toBe('0 Bytes')
		expect(formatBytes(1023)).toBe('1023 Bytes')
		expect(formatBytes(1024)).toBe('1 KB')
		expect(formatBytes(1048576)).toBe('1 MB')
		expect(formatBytes(1073741824)).toBe('1 GB')
		expect(formatBytes(1099511627776)).toBe('1 TB')
	})

	it('should format with custom decimal places', () => {
		// 1234 bytes / 1024 = 1.205078...
		expect(formatBytes(1234, 1)).toBe('1.2 KB')
		expect(formatBytes(1234, 2)).toBe('1.21 KB')
		expect(formatBytes(1234, 3)).toBe('1.205 KB')
	})

	it('should round to 0 decimal places when decimals is 0', () => {
		expect(formatBytes(1234, 0)).toBe('1 KB')
		expect(formatBytes(1900, 0)).toBe('2 KB')
	})

	it('should drop trailing zeros due to parseFloat logic', () => {
		// Even with decimals=3, 1024 / 1024 = 1.000 -> "1 KB"
		expect(formatBytes(1024, 3)).toBe('1 KB')
		expect(formatBytes(1536, 2)).toBe('1.5 KB') // 1.50 -> 1.5
	})

	it('should fallback to 0 decimals when a negative value is passed', () => {
		// Your code handles: dm = decimals < 0 ? 0 : decimals
		expect(formatBytes(1234, -1)).toBe('1 KB')
		expect(formatBytes(1900, -5)).toBe('2 KB')
	})
})
