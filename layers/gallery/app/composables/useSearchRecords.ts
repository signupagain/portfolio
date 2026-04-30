import { StorageSerializers, useStorage, type RemovableRef } from '@vueuse/core'

export const useSearchRecords = (capacity?: number) => {
	class LRU {
		readonly storageKey = 'gallery-search-records'
		capacity: number
		lru: RemovableRef<Set<string>>
		size: ComputedRef<number>
		values: ComputedRef<string[]>

		constructor(capacity = 20) {
			if (capacity <= 0) {
				throw new Error('Capacity must be greater than 0')
			}

			this.capacity = capacity

			this.lru = useStorage<Set<string>>(
				this.storageKey,
				new Set(),
				undefined,
				{
					serializer: StorageSerializers.set,
				},
			)

			while (this.lru.value.size > this.capacity) {
				const lruNode = this.lru.value.values().next().value!
				this.lru.value.delete(lruNode)
			}

			this.size = computed(() => this.lru.value.size)
			this.values = computed(() => Array.from(this.lru.value).reverse())
		}

		add(record: string) {
			if (this.lru.value.has(record)) {
				this.lru.value.delete(record)
			}

			this.lru.value.add(record)

			if (this.lru.value.size > this.capacity) {
				const first = this.lru.value.values().next().value!
				this.lru.value.delete(first)
			}
		}

		get(record: string) {
			if (this.lru.value.has(record)) {
				this.lru.value.delete(record)
				this.lru.value.add(record)
				return record
			}
			return null
		}

		clear() {
			this.lru.value.clear()
		}

		delete(record: string) {
			this.lru.value.delete(record)
		}
	}

	return new LRU(capacity)
}
