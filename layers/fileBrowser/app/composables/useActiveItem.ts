export const useActiveItem = () => {
	const activeItem = ref<FileItem | null>(null)

	function setActiveItem(item: FileItem) {
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
