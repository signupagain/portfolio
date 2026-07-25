export type FileLayout = 'grid' | 'list'

export type FileSort = 'name' | 'size' | 'kind' | 'date'

export type FileOrder = 'ascending' | 'descending'

interface BaseFileItem {
	id: string
	name: string
	path: string
	created: number
	modified: number

	size?: number
	extension?: string
}

export interface FileItem extends BaseFileItem {
	type: 'file'
}

export interface FolderItem extends BaseFileItem {
	type: 'folder'
	children: FileNode[]
}

export type FileNode = FileItem | FolderItem

interface Extension {
	name: string
	label: string
}

interface FileCategory {
	icon: string
	color: string
	extensions: Extension[]
}

type FileCategories = FileCategory[]

type FileGroupMap = Map<
	Extension['name'],
	Omit<FileCategory, 'extensions'> & { label: Extension['label'] }
>

export interface FileStackFrame {
	dirname: string
	folder: FolderItem | null
	nodes: FileNode[]
}

type FileStack = FileStackFrame[]

export const useFileTree = () => {
	// --- state: navigation ---
	const stack = shallowRef<FileStack>([])
	const currentDirectory = computed(() => stack.value.at(-1) || null)

	// --- state: categories ---
	const _fileCategories = ref<FileCategories | null>(null)
	const fileCategoryMap = computed(() => {
		const map: FileGroupMap = new Map()

		_fileCategories.value?.forEach((group) => {
			group.extensions.forEach((ext) => {
				map.set(ext.name, {
					icon: group.icon,
					color: group.color,
					label: ext.label,
				})
			})
		})

		return map
	})

	// --- state: search / sort ---
	const searchValue = ref<string>('')
	const debouncedSearchValue = refDebounced(searchValue, 300)

	const _searchFn = (node: FileNode) =>
		node.name.includes(debouncedSearchValue.value)

	const order = ref<FileOrder>('ascending')

	const _orderFn = (value: number) =>
		isNaN(value) ? 0 : value * (order.value === 'ascending' ? 1 : -1)

	const sortBy = ref<FileSort>('kind')

	const _filterFn = {
		name: (a, b) => _orderFn(a.name.localeCompare(b.name)),
		size: (a, b) => _orderFn((a.size ?? 0) - (b.size ?? 0)),
		kind: (a, b) =>
			_orderFn((a.extension || '').localeCompare(b.extension || '')),
		date: (a, b) => _orderFn(a.modified - b.modified),
	} satisfies Record<FileSort, (a: FileNode, b: FileNode) => number>

	// --- derived ---
	const displayedNodes = computed(() =>
		(currentDirectory.value?.nodes || [])
			.filter(_searchFn)
			.sort(_filterFn[sortBy.value]),
	)

	const currentFolderCount = computed(
		() =>
			currentDirectory.value?.nodes.filter((node) => node.type === 'folder')
				.length || 0,
	)

	const currentFileCount = computed(
		() =>
			currentDirectory.value?.nodes.filter((node) => node.type === 'file')
				.length || 0,
	)

	// --- private: stack helpers ---
	function _pushDirectory(frames: FileStack | FileStackFrame) {
		stack.value = [
			...stack.value,
			...(Array.isArray(frames) ? frames : [frames]),
		]
	}

	function _assertOrdered(indexArray: number[]) {
		for (let index = 1; index < indexArray.length; index++) {
			const prev = indexArray[index - 1]!
			const curr = indexArray[index]!

			if (prev === curr) {
				throw new Error('The index values within indexArray should be unique.')
			}

			if (prev > curr) {
				throw new Error(
					'The index values in indexArray should be sorted in ascending order.',
				)
			}
		}
	}

	// --- private: folder size ---
	/**
	 * folder 無 size 時用 while DFS 累計並寫回；已有 size 不下探；file 無 size 視為 0。
	 * force：忽略既有 size，依目前 children 覆寫（子項若已有 size 仍直接加總、不下探）。
	 * 不觸發 stack 響應；呼叫端自行 triggerRef。
	 */
	function _accumulateFolderSize(folder: FolderItem, force = false) {
		if (!force && typeof folder.size === 'number') return

		folder.size = 0
		const sizeStack: Array<{ folder: FolderItem; index: number }> = [
			{ folder, index: 0 },
		]

		while (sizeStack.length > 0) {
			const frame = sizeStack[sizeStack.length - 1]!

			if (frame.index < frame.folder.children.length) {
				const child = frame.folder.children[frame.index]!
				frame.index++

				if (typeof child.size === 'number') {
					frame.folder.size! += child.size
				} else if (child.type === 'folder') {
					child.size = 0
					sizeStack.push({ folder: child, index: 0 })
				}
				continue
			}

			sizeStack.pop()

			if (sizeStack.length > 0) {
				sizeStack[sizeStack.length - 1]!.folder.size! += frame.folder.size!
			}
		}
	}

	/**
	 * 由 stack 當前層往上，對已快取 size 的 folder 強制重算（root 無 folder 物件，跳過）。
	 * 任何會改變 children 而可能讓 size 失效的操作（目前僅 deleteNodes）完成後應呼叫。
	 */
	function _recalculateAncestorFolderSizes() {
		for (let i = stack.value.length - 1; i > 0; i--) {
			const folder = stack.value[i]!.folder
			if (!folder || typeof folder.size !== 'number') continue

			_accumulateFolderSize(folder, true)
		}
	}

	// --- public: lifecycle / navigation ---
	async function initialize() {
		if (stack.value.length > 0) {
			return true
		}

		try {
			const responses = await Promise.all([
				fetch('/file-browser.json'),
				fetch('/file-browser-types.json'),
			])

			const [data, types] = (await Promise.all(
				responses.map((res) => {
					if (!res.ok) {
						throw new Error(
							`Failed to fetch ${res.url}:\n\t${res.status} ${res.statusText}`,
						)
					}

					return res.json()
				}),
			)) as [FileNode[], FileCategories]

			_pushDirectory({ dirname: 'root', folder: null, nodes: data })
			_fileCategories.value = types
		} catch (error) {
			console.error('getDataSeed error:\n', error)

			throw createError({
				message: 'getDataSeed returned no data',
				fatal: true,
			})
		}

		return true
	}

	function moveTo(value: FileNode['id'] | number): void {
		if (currentDirectory.value === null) {
			throw createError('currentDirectory should not be null.')
		}

		if (typeof value === 'string') {
			const target = currentDirectory.value.nodes.find(
				(node) => node.id === value,
			)

			if (!target || target.type !== 'folder') {
				throw createError('target should be a folder.')
			}

			_pushDirectory([
				{ dirname: target.name, folder: target, nodes: target.children },
			])

			return
		}

		stack.value.length = value + 1
		triggerRef(stack)
	}

	function deleteNodes(toDeleteList: number[]) {
		if (toDeleteList.length === 0) return

		_assertOrdered(toDeleteList)

		const list = stack.value[stack.value.length - 1]!.nodes
		let write = toDeleteList[0]!
		let delIdx = 0

		for (let read = toDeleteList[0]!; read < list.length; read++) {
			if (delIdx < toDeleteList.length && read === toDeleteList[delIdx]) {
				delIdx++
			} else {
				list[write] = list[read]!
				write++
			}
		}

		if (write > 0 || stack.value.length === 1) {
			const nextFrame = { ...stack.value[stack.value.length - 1]! }

			nextFrame.nodes.length = write

			if (stack.value.length > 1) {
				nextFrame.folder!.children.length = write
			}

			stack.value.splice(stack.value.length - 1, 1, nextFrame)
		} else if (stack.value.length > 1) {
			const frame = stack.value.pop()!

			frame.folder!.children.length = 0
			frame.folder!.size = 0
		}

		// 刪除會改變當前與祖先 folder 的內容，需由深到淺重算已快取的 size
		_recalculateAncestorFolderSizes()
		triggerRef(stack)
	}

	// --- public: folder size ---
	/** 對外：累計 folder size 並通知 stack 更新 */
	function accumulateFolderSize(folder: FolderItem) {
		_accumulateFolderSize(folder)
		triggerRef(stack)
	}

	/** 計算 root nodes 內尚未有 size 的 folder（root 已涵蓋整棵樹；已算出則跳過） */
	function accumulateFileTreeFolderSizes() {
		const root = stack.value[0]
		if (!root) return

		for (const node of root.nodes) {
			if (node.type === 'folder' && typeof node.size !== 'number') {
				_accumulateFolderSize(node)
			}
		}

		triggerRef(stack)
	}

	return {
		// state / derived
		stack,
		currentDirectory,
		_fileCategories,
		fileCategoryMap,
		searchValue,
		order,
		sortBy,
		displayedNodes,
		currentFolderCount,
		currentFileCount,

		// actions
		initialize,
		moveTo,
		deleteNodes,
		accumulateFolderSize,
		accumulateFileTreeFolderSizes,
	}
}
