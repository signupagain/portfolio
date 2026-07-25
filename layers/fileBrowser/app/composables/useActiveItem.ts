export const useActiveItem = () => {
	const activeItem = ref<FileNode | null>(null)

	function setActiveItem(item: FileNode) {
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
