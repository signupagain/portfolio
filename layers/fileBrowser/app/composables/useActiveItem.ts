export const useActiveItem = () => {
	const activeItem = ref<Item | null>(null)

	function setActiveItem(item: Item) {
		activeItem.value = item
	}

	function deleteActiveItem() {
		activeItem.value = null
	}

	return {
		activeItem,
		setActiveItem,
		deleteActiveItem,
	}
}
