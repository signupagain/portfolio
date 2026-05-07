<script setup lang="ts">
	const MAX_LANES = 5
	const MIN_WIDTH = 300

	const toast = useToast()
	const initialPhotoData = useInitialPhotoData()

	const listEl = useTemplateRef('list')
	const { width: listElWidth } = useElementSize(() => listEl.value?.$el)

	const lanes = computed(() =>
		listElWidth.value ?
			Math.max(
				1,
				Math.min(MAX_LANES, Math.round(listElWidth.value / MIN_WIDTH)),
			)
		:	1,
	)

	const { photos, hasNextPage, fetchNextPage, isFetchingNextPage } = usePhotos()

	const beforeEl = useTemplateRef('before')
	const beforeElHeight = ref(0)

	onMounted(() => {
		beforeElHeight.value = beforeEl.value?.getBoundingClientRect().height || 0
	})

	const translateValue = ref(0)
	useEventListener(
		() => listEl.value?.$el,
		'scroll',
		() => {
			let scrollTop = listEl.value?.$el.scrollTop || 0

			if (scrollTop > beforeElHeight.value) scrollTop = beforeElHeight.value

			translateValue.value = scrollTop
		},
	)

	defineExpose({
		getListEl: () => listEl.value?.$el,
	})

	const { height: windowHeight } = useWindowSize()

	const isFetchingMore = ref(false)
	const PREFETCH_PX = 100

	const tryFetchMore = async () => {
		if (isFetchingNextPage.value || isFetchingMore.value) return

		const virtualizer = listEl.value?.virtualizer
		if (!virtualizer) return

		if (virtualizer.scrollDirection === 'backward') return

		const els = virtualizer.getVirtualItems()
		if (els.length <= 0) return

		const atLastPhoto = photos.value.at(-1)?.id === els.at(-1)?.key
		if (!atLastPhoto) return

		const viewportHeight =
			listEl.value?.$el?.clientHeight ?? windowHeight.value
		const offset =
			(virtualizer.scrollOffset || 0) + viewportHeight + PREFETCH_PX
		let min = Infinity

		for (let idx = els.length - 1; idx >= els.length - MAX_LANES; idx--) {
			const el = els[idx]!
			min = Math.min(min, el.start)
		}

		if (min > offset) return

		if (hasNextPage.value) {
			isFetchingMore.value = true

			try {
				await fetchNextPage()
			} finally {
				isFetchingMore.value = false
			}
		} else {
			toast.add({
				title: '已經沒有更多的照片了',
				icon: 'lucide:circle-alert',
			})
		}
	}

	watch(
		() =>
			[
				listEl.value?.virtualizer?.scrollOffset,
				photos.value.length,
			] as const,
		async () => {
			await tryFetchMore()
		},
	)

	const onClick = async (e: PointerEvent) => {
		const target = e.target

		if (!(target instanceof HTMLImageElement)) return

		if (!target.id) {
			throw createError(
				'the NuxtImg of Image.vue should have an "id" attribute',
			)
		}

		initialPhotoData.value = photos.value.find(({ id }) => id === +target.id)

		await navigateTo({ name: 'gallery-id', params: { id: target.id } })
	}
</script>

<template>
	<div
		v-if="$slots.default"
		ref="before"
		class="absolute top-0 w-full will-change-transform"
		:style="{
			transform: `translateY(-${translateValue}px)`,
		}"
	>
		<slot></slot>
	</div>
	<ClientOnly>
		<UScrollArea
			v-slot="{ item }"
			v-bind="$attrs"
			ref="list"
			:items="photos"
			:virtualize="{
				lanes,
				gap: 16,
				paddingStart: beforeElHeight,
				overscan: MAX_LANES,
				getItemKey: (index) => photos[index]!.id,
				estimateSize(index) {
					const { width, height } = photos[index]!
					const aspectRatio = Math.round((width / height) * 1000) / 1000
					const elWidth = listElWidth || MIN_WIDTH
					return Math.round((elWidth / aspectRatio) * 1000) / 1000
				},
			}"
			:ui="{
				root: 'px-4 scrollbar-thin h-screen',
			}"
			@click="onClick"
		>
			<GalleryListitem
				v-if="item"
				:id="item.id"
				:width="item.width"
				:height="item.height"
				:alt="item.alt"
				:src="item.src"
				:avg-color="item.avg_color"
				:name="item.photographer"
				:photographer-url="item.photographer_url"
				:img-url="item.url"
			/>
		</UScrollArea>
	</ClientOnly>
</template>

<style lang="scss"></style>
