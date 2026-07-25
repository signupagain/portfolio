import dayjs from 'dayjs'
import type { Item } from '../composables/useFileTree'
import { formatBytes } from './formatBytes'

export interface DisplayedItemCategory {
	label: string
	icon: string
	color: string
}

export interface DisplayedItem {
	id: string
	type: Item['type']
	title: string
	description: string
	icon: string
	color: string
	modified: string
	size: string
	active: boolean
}

export function toDisplayedItem(
	item: Item,
	category: DisplayedItemCategory,
	options?: { active?: boolean },
): DisplayedItem {
	return {
		id: item.id,
		type: item.type,
		title: item.name,
		description: category.label,
		icon: category.icon,
		color: category.color,
		modified: dayjs(item.modified).format('MM/DD HH:mm'),
		size: typeof item.size === 'number' ? formatBytes(item.size) : '--',
		active: options?.active ?? false,
	}
}
