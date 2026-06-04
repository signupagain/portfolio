import { defineCollection, defineContentConfig } from '@nuxt/content'
import path from 'node:path'
import * as z from 'zod'

export default defineContentConfig({
	collections: {
		//#region Introduction
		index: defineCollection({
			type: 'page',
			source: 'index.yml',
			schema: z.object({
				hero: z.array(
					z.object({
						'aria-label': z.string(),
						icon: z.string(),
						color: z.string(),
					}),
				),
				about: z.object({
					title: z.string(),
					description: z.string(),
				}),
				experience: z.object({
					title: z.string(),
					items: z.array(
						z.object({
							position: z.string(),
							date: z.string(),
							company: z.object({
								name: z.string(),
								url: z.url(),
								color: z.string(),
							}),
						}),
					),
				}),
			}),
		}),
		project: defineCollection({
			type: 'page',
			source: 'projects.yml',
		}),
		projects: defineCollection({
			type: 'data',
			source: 'projects/*.yml',
			schema: z.object({
				title: z.string().nonempty(),
				description: z.string().nonempty(),
				image: z.string().nonempty(),
				url: z.string().nonempty(),
			}),
		}),
		about: defineCollection({
			type: 'page',
			source: 'about.md',
		}),
		//#endregion

		//#region Gallery
		gallery: defineCollection({
			type: 'page',
			source: {
				cwd: path.resolve('layers/gallery/content'),
				include: 'index.yml',
			},
		}),
		galleryIntro: defineCollection({
			type: 'page',
			source: {
				cwd: path.resolve('layers/gallery/content'),
				include: 'intro.md',
			},
		}),
		// #endregion

		//#region
		fileBrowser: defineCollection({
			type: 'page',
			source: {
				cwd: path.resolve('layers/fileBrowser/content'),
				include: 'index.yml',
			},
		}),
		//#endregion
	},
})
