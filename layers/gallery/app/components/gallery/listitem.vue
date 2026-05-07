<script setup lang="ts">
	import type { GalleryImageProps } from './Image.vue'
	import type { GalleryPhotographerProps } from './Photographer.vue'

	type GalleryItemProps = GalleryImageProps & GalleryPhotographerProps

	const props = defineProps<GalleryItemProps>()

	const isExist = ref(true)
</script>

<template>
	<div v-if="isExist" class="relative isolate">
		<GalleryImage
			:id="props.id"
			v-model:is-exist="isExist"
			:alt="props.alt || 'Image by ' + props.name"
			:src="props.src"
			:avg-color="props.avgColor"
			:width="props.width"
			:height="props.height"
			:loading="props.loading"
		/>
		<GalleryPhotographer
			:name="props.name"
			:photographer-url="props.photographerUrl"
			:img-url="props.imgUrl"
		/>
	</div>
</template>

<style lang="scss"></style>
