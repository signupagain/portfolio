<script setup lang="ts"></script>

<template>
	<div>
		<UContainer
			style="--ui-container: auto"
			:ui="{
				base: 'px-0!',
			}"
		>
			<slot />
		</UContainer>
	</div>
</template>

<style lang="scss"></style>
