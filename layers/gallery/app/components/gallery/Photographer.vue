<script setup lang="ts">
	export type GalleryPhotographerProps = {
		name: string
		photographerUrl: string
		imgUrl: string
	}

	const { name, photographerUrl, imgUrl } =
		defineProps<GalleryPhotographerProps>()
</script>

<template>
	<UButton
		:to="photographerUrl"
		target="_blank"
		:label="name"
		variant="ghost"
		color="neutral"
		trailing-icon="lucide:external-link"
		class="absolute bottom-4 left-4"
		:ui="{
			base: 'text-shadow-lg max-w-[80%]',
		}"
	/>
	<UTooltip
		arrow
		text="圖片來源"
		:delay-duration="300"
		:content="{
			side: 'bottom',
			sideOffset: 0,
		}"
		class="self-start"
	>
		<UButton
			:to="imgUrl"
			target="_blank"
			aria-label="View the image on Pexels"
			variant="ghost"
			color="neutral"
			icon="lucide:external-link"
			class="absolute top-4 right-4"
			:ui="{
				base: 'text-shadow-lg',
			}"
		/>
	</UTooltip>
</template>

<style lang="scss"></style>
