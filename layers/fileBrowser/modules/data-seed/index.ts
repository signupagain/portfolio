import { defineNuxtModule, createResolver } from 'nuxt/kit'
import { access, writeFile } from 'fs/promises'
import { faker } from '@faker-js/faker'
import { fileExtensionSpecs } from './utils/fileExtensionSpecs'

type FileType = {
	id: string
	name: string
	type: 'folder' | 'file'
	path: string
	created: number
	modified: number

	size?: number
	extension?: string
	children?: FileType[]
}

export default defineNuxtModule({
	meta: {
		name: 'file-browser/data-seed',
	},
	setup(_, nuxt) {
		const { resolve: rootResolve } = createResolver(nuxt.options.rootDir)

		nuxt.hook('build:before', async () => {
			const dataFilename = 'file-browser.json'
			const fileExtensionSpecsFilename = 'file-browser-types.json'

			const dataOutputPath = rootResolve(`public/${dataFilename}`)
			const fileExtensionSpecsOutputPath = rootResolve(
				`public/${fileExtensionSpecsFilename}`,
			)

			try {
				const [dataExists, fileExtensionSpecsExists] = await Promise.all([
					fileExists(dataOutputPath),
					fileExists(fileExtensionSpecsOutputPath),
				])

				if (dataExists && fileExtensionSpecsExists) {
					console.log(
						`DataSeedModule: ${dataFilename} and ${fileExtensionSpecsFilename} already exist, skipping generation.`,
					)
					return
				}

				const data = generateFileSystem()

				await writeFile(dataOutputPath, JSON.stringify(data), 'utf-8')
				await writeFile(
					fileExtensionSpecsOutputPath,
					JSON.stringify(fileExtensionSpecs),
					'utf-8',
				)

				console.log(
					`✅ Generated ${dataFilename} and ${fileExtensionSpecsFilename}`,
				)
			} catch (error) {
				console.error('DataSeedModule Error: \n', error)
			}

			async function fileExists(path: string) {
				try {
					await access(path)
					return true
				} catch {
					return false
				}
			}

			function generateFileSystem(
				maxDepth: number = 3,
				depth: number = 0,
				parentPath: string = '',
				parentId: string = '',
			): FileType[] {
				const numItems =
					depth === 0 ? 2000 : faker.number.int({ min: 2, max: 3 })
				const extensions = fileExtensionSpecs
					.slice(1)
					.flatMap((t) => t.extensions)

				return Array.from({ length: numItems }).map((_, index) => {
					const id = parentId ? `${parentId}-${index + 1}` : `${index + 1}`
					const isFolder = depth < maxDepth ? faker.datatype.boolean() : false
					const created = +faker.date.recent({ days: 30 })
					const modified = +faker.date.between({
						from: created,
						to: new Date(),
					})

					if (isFolder) {
						const folderName = faker.system.commonFileName().split('.')[0]!
						const currentPath = `${parentPath}/${folderName}`

						return {
							id,
							name: folderName,
							type: 'folder',
							path: currentPath,
							created,
							modified,
							children: generateFileSystem(
								maxDepth,
								depth + 1,
								currentPath,
								id,
							),
						}
					} else {
						const randomExt = faker.helpers.arrayElement(extensions)
						const fileName = faker.system.commonFileName(randomExt.name)
						const extension = fileName.split('.').pop()

						return {
							id,
							name: fileName,
							type: 'file',
							size: faker.number.int({ min: 1024, max: 1024 ** 2 * 5 }),
							created,
							modified,
							extension,
							path: `${parentPath}/${fileName}`,
						}
					}
				})
			}
		})
	},
})
