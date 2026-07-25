import type { ShallowRef } from 'vue'
import type { ComponentExposed } from 'vue-component-type-helpers'
import type { UScrollArea } from '#components'

interface UseItemPointerEventsOptions {
	onItemClick?: (event: PointerEvent, index: number) => void
	onItemDblClick?: (event: MouseEvent, index: number) => void
	onItemContextMenu?: (index: number) => void
	onItemEnter?: (event: KeyboardEvent, index: number) => void
	onClear?: () => void
	/** Called on pointerup; return true to skip click (e.g. after area selection). */
	shouldSuppressClick?: () => boolean
}

function resolveItemIndex(event: Event): number | null {
	const target = event.target

	if (!(target instanceof Element)) return null

	const itemEl = target.closest('[data-index]')

	if (!(itemEl instanceof HTMLElement)) return null

	const index = Number(itemEl.dataset.index)

	return Number.isNaN(index) ? null : index
}

export const useItemPointerEvents = (
	getTarget: () => ShallowRef<ComponentExposed<typeof UScrollArea> | null>,
	options: UseItemPointerEventsOptions = {},
) => {
	function handleItemClick(pointerEvent: PointerEvent) {
		if (pointerEvent.button !== 0) return

		const index = resolveItemIndex(pointerEvent)

		if (index !== null) {
			options.onItemClick?.(pointerEvent, index)
			return
		}

		options.onClear?.()
	}

	useEventListener(
		() => getTarget().value?.$el,
		'pointerup',
		(event) => {
			if (options.shouldSuppressClick?.()) return

			handleItemClick(event)
		},
	)

	useEventListener(
		() => getTarget().value?.$el,
		'dblclick',
		(event) => {
			const index = resolveItemIndex(event)

			if (index === null) return

			options.onItemDblClick?.(event, index)
		},
	)

	useEventListener(
		() => getTarget().value?.$el,
		'contextmenu',
		(event) => {
			const index = resolveItemIndex(event)

			if (index === null) return

			options.onItemContextMenu?.(index)
		},
	)

	useEventListener(
		() => getTarget().value?.$el,
		'keydown',
		(event) => {
			if (event.key !== 'Enter' || event.repeat) return

			const index = resolveItemIndex(event)

			if (index === null) return

			options.onItemEnter?.(event, index)
		},
	)
}
