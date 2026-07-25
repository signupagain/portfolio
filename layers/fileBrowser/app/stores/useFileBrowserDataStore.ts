import type { LayoutType } from '../composables/useFileTree'

export const useFileBrowserDataStore = defineStore('FileBrowserData', () => {
	const layout = ref<LayoutType>('grid')
	const drawerBtn = ref<HTMLElement | null>(null)

	const fileTree = useFileTree()
	const activeItemData = useActiveItem()
	const selectedItemData = useSelectedItem()

	function moveToNode(value: Item['id'] | number): void {
		fileTree.moveToNode(value)
		activeItemData.deleteActiveItem()
		selectedItemData.clearSelectedItems()
	}

	function deleteNodeItems() {
		if (selectedItemData.selectedItems.value.size === 0) return

		const toDeleteList: number[] = []
		const activeItemValue = activeItemData.activeItem.value

		fileTree.currentNode.value?.nodes.forEach((node, idx) => {
			if (selectedItemData.selectedItems.value.has(node.id)) {
				toDeleteList.push(idx)

				if (activeItemValue?.id === node.id) {
					drawerBtn.value = null
					activeItemData.deleteActiveItem()
				}
			}
		})

		fileTree.deleteNodeItems(toDeleteList)
		selectedItemData.clearSelectedItems()
	}

	function setActiveItem(id: string) {
		const target =
			fileTree.currentNode.value?.nodes.find((node) => node.id === id) || null

		if (!target) {
			return
		}

		if (target.type === 'folder') {
			fileTree.accumulateFolderSize(target)
		}

		activeItemData.setActiveItem(target)
	}

	function clearActiveIfMissing() {
		const activeItemValue = activeItemData.activeItem.value
		const isInSelectedItems = (id: string) =>
			selectedItemData.selectedItems.value.has(id)

		if (!activeItemValue || isInSelectedItems(activeItemValue.id)) {
			return
		}

		activeItemData.deleteActiveItem()
	}

	return {
		...fileTree,
		...activeItemData,
		...selectedItemData,

		layout,
		drawerBtn,

		moveToNode,
		deleteNodeItems,
		setActiveItem,
		clearActiveIfMissing,
	}
})
