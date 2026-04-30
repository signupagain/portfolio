import { describe, it, expect } from 'vitest'

describe('useSearchRecords', () => {
	it('should initialize with default capacity', () => {
		const searchRecords = useSearchRecords()
		expect(searchRecords.capacity).toBe(20)
		expect(searchRecords.size.value).toBe(0)
		expect(searchRecords.values.value).toEqual([])
	})

	it('should add records and maintain LRU order', () => {
		const searchRecords = useSearchRecords(3)
		searchRecords.add('record1')
		searchRecords.add('record2')
		searchRecords.add('record3')

		expect(searchRecords.values.value).toEqual([
			'record3',
			'record2',
			'record1',
		])

		searchRecords.add('record2')
		expect(searchRecords.values.value).toEqual([
			'record2',
			'record3',
			'record1',
		])

		searchRecords.add('record4')
		expect(searchRecords.values.value).toEqual([
			'record4',
			'record2',
			'record3',
		])
	})

	it('should get records and update their position', () => {
		const searchRecords = useSearchRecords(3)
		searchRecords.add('record1')
		searchRecords.add('record2')
		searchRecords.add('record3')

		expect(searchRecords.get('record2')).toBe('record2')
		expect(searchRecords.values.value).toEqual([
			'record2',
			'record3',
			'record1',
		])

		expect(searchRecords.get('record4')).toBeNull()
		expect(searchRecords.values.value).toEqual([
			'record2',
			'record3',
			'record1',
		])
	})

	it('should clear all records', () => {
		const searchRecords = useSearchRecords()
		searchRecords.add('record1')
		searchRecords.add('record2')
		searchRecords.clear()

		expect(searchRecords.size.value).toBe(0)
		expect(searchRecords.values.value).toEqual([])
	})

	it('should delete specific record', () => {
		const searchRecords = useSearchRecords()
		searchRecords.add('record1')
		searchRecords.add('record2')
		searchRecords.delete('record1')

		expect(searchRecords.size.value).toBe(1)
		expect(searchRecords.values.value).toEqual(['record2'])
	})

	it('should throw error for non-positive capacity', () => {
		expect(() => useSearchRecords(0)).toThrow('Capacity must be greater than 0')
		expect(() => useSearchRecords(-1)).toThrow(
			'Capacity must be greater than 0',
		)
	})

	it('should maintain capacity limit', () => {
		const searchRecords = useSearchRecords(2)
		searchRecords.add('record1')
		searchRecords.add('record2')
		searchRecords.add('record3')

		expect(searchRecords.size.value).toBe(2)
		expect(searchRecords.values.value).toEqual(['record3', 'record2'])
	})
})
