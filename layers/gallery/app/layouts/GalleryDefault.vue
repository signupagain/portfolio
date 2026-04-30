<script setup lang="ts"></script>

<template>
	<div>
		<UContainer
			style="--ui-container: auto; --ui-header-height: 0px"
			:ui="{
				base: 'px-0!',
			}"
		>
			<GalleryHeader />
			<slot />
		</UContainer>
	</div>
</template>

<style lang="scss"></style>
