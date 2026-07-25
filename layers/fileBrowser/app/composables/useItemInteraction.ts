import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { useFileBrowserDataStore } from '../stores/useFileBrowserDataStore'
import type { DisplayedItem } from '../utils/toDisplayedItem'

/**
 * Prefer 200–250ms so the folder Drawer still feels responsive when the aside
 * is hidden. Slower than a typical OS dblclick window (~500ms) would reduce
 * rare Drawer flashes on slow second clicks, but makes the single-click open
 * feel laggy — snappiness wins here; dblclick clears the timer via openItem.
 */
const FOLDER_DRAWER_DELAY_MS = 250

export const useItemInteraction = (
	items: ComputedRef<(number | DisplayedItem)[]>,
	isAsideVisible: MaybeRefOrGetter<boolean>,
) => {
	const dataStore = useFileBrowserDataStore()
	const { displayedNodes, selectedItems, stack, drawerBtn } =
		storeToRefs(dataStore)

	const shiftAnchorIndex = ref(-1)
	let folderDrawerTimer: ReturnType<typeof setTimeout> | null = null

	function clearFolderDrawerTimer() {
		if (folderDrawerTimer === null) return

		clearTimeout(folderDrawerTimer)
		folderDrawerTimer = null
	}

	function resolveItemButton(event: Event): HTMLElement {
		return ((event.target as HTMLElement | null)?.closest('[data-index]') ??
			event.currentTarget) as HTMLElement
	}

	function openDrawerFromEvent(event: Event) {
		const btn = resolveItemButton(event)

		btn.blur()
		drawerBtn.value = btn
	}

	function scheduleFolderDrawer(event: Event) {
		const btn = resolveItemButton(event)

		btn.blur()
		folderDrawerTimer = setTimeout(() => {
			folderDrawerTimer = null
			drawerBtn.value = btn
		}, FOLDER_DRAWER_DELAY_MS)
	}

	watch(
		() => stack.value.length,
		() => {
			shiftAnchorIndex.value = -1
		},
	)

	tryOnScopeDispose(clearFolderDrawerTimer)

	async function clickBtn(event: PointerEvent, index: number) {
		const item = items.value[index]

		if (typeof item === 'number' || !item) return

		if (event.shiftKey) {
			clearFolderDrawerTimer()

			if (shiftAnchorIndex.value === -1) {
				dataStore.pushSelectedItems(item.id)
			} else {
				const start = Math.min(shiftAnchorIndex.value, index)
				const end = Math.max(shiftAnchorIndex.value, index)

				dataStore.pushSelectedItems(
					displayedNodes.value.slice(start, end + 1).map((entry) => entry.id),
				)
			}

			shiftAnchorIndex.value = index
			return
		}

		shiftAnchorIndex.value = index

		if (event.ctrlKey) {
			clearFolderDrawerTimer()

			if (selectedItems.value.has(item.id)) {
				dataStore.deleteSelectedItem(item.id)
				dataStore.clearActiveIfMissing()
			} else {
				dataStore.pushSelectedItems(item.id)
			}

			return
		}

		dataStore.clearSelectedItems()
		dataStore.pushSelectedItems(item.id)
		dataStore.setActiveItem(item.id)

		if (toValue(isAsideVisible)) return

		clearFolderDrawerTimer()

		if (item.type === 'folder') {
			scheduleFolderDrawer(event)
		} else {
			openDrawerFromEvent(event)
		}
	}

	function openItem(index: number) {
		const item = items.value[index]

		if (typeof item === 'number' || !item || item.type !== 'folder') return

		clearFolderDrawerTimer()
		drawerBtn.value = null
		dataStore.moveTo(item.id)
	}

	/** Enter on a focused item: open folder (no content) or show file content. No ctrl/shift variants. */
	function enterItem(event: KeyboardEvent, index: number) {
		const item = items.value[index]

		if (typeof item === 'number' || !item) return

		if (item.type === 'folder') {
			openItem(index)
			return
		}

		clearFolderDrawerTimer()
		shiftAnchorIndex.value = index
		dataStore.clearSelectedItems()
		dataStore.pushSelectedItems(item.id)
		dataStore.setActiveItem(item.id)

		if (!toValue(isAsideVisible)) {
			openDrawerFromEvent(event)
		}
	}

	function contextSelect(index: number) {
		const item = items.value[index]

		if (typeof item === 'number' || !item) return

		clearFolderDrawerTimer()
		shiftAnchorIndex.value = index

		if (selectedItems.value.has(item.id)) return

		dataStore.clearSelectedItems()
		dataStore.pushSelectedItems(item.id)
		dataStore.setActiveItem(item.id)
	}

	function clearState() {
		clearFolderDrawerTimer()
		shiftAnchorIndex.value = -1
		dataStore.clearSelectedItems()
		dataStore.deleteActiveItem()
	}

	return {
		clickBtn,
		openItem,
		enterItem,
		contextSelect,
		clearState,
	}
}
