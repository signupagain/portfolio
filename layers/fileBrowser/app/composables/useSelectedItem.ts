export const useSelectedItem = () => {
	const selectedItems = shallowRef<Set<Item['id']>>(new Set())

	const selectedItemsCount = computed(() => selectedItems.value.size)

	function pushSelectedItems(id: Item['id'][] | Item['id']) {
		selectedItems.value = new Set([
			...selectedItems.value,
			...(Array.isArray(id) ? id : [id]),
		])
	}

	function deleteSelectedItem(id: Item['id']) {
		const result = selectedItems.value.delete(id)

		if (result) {
			triggerRef(selectedItems)
		}

		return result
	}

	function clearSelectedItems() {
		selectedItems.value = new Set()
	}

	return {
		selectedItems,
		selectedItemsCount,
		pushSelectedItems,
		deleteSelectedItem,
		clearSelectedItems,
	}
}
