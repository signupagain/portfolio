export const useSelectedItem = () => {
	const selectedItems = shallowRef<Set<Item['id']>>(new Set())

	const selectedItemsCount = computed(() => selectedItems.value.size)

	function pushSelectedItems(id: Item['id'][] | Item['id']) {
		if (Array.isArray(id)) {
			selectedItems.value = new Set([...selectedItems.value, ...id])
		} else {
			selectedItems.value.add(id)
			triggerRef(selectedItems)
		}
	}

	function deleteSelectedItem(id: Item['id']) {
		const result = selectedItems.value.delete(id)

		if (result) {
			triggerRef(selectedItems)
		}

		return result
	}

	function clearSelectedItems() {
		selectedItems.value.clear()
		triggerRef(selectedItems)
	}

	return {
		selectedItems,
		selectedItemsCount,
		pushSelectedItems,
		deleteSelectedItem,
		clearSelectedItems,
	}
}
