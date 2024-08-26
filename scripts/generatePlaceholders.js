const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

async function generatePlaceholder(imagePath) {
	const imageBuffer = await sharp(imagePath).toBuffer()
	const placeholderBuffer = await sharp(imageBuffer).resize(20, 20, { fit: 'inside' }).blur(10).toBuffer()
	return `data:image/png;base64,${placeholderBuffer.toString('base64')}`
}

async function generatePlaceholders() {
	const dictionaryDir = path.join(__dirname, '..', 'dictionaries')
	const publicDir = path.join(__dirname, '..', 'public')

	const files = fs.readdirSync(dictionaryDir)

	for (const file of files) {
		if (file.endsWith('.json')) {
			const filePath = path.join(dictionaryDir, file)
			const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

			if (data.projectsSection && data.projectsSection.projects) {
				for (const project of data.projectsSection.projects) {
					const imagePath = path.join(publicDir, project.image)
					try {
						project.placeholder = await generatePlaceholder(imagePath)
						console.log(`Generated placeholder for ${project.company}`)
					} catch (error) {
						console.error(`Error generating placeholder for ${project.company}:`, error)
					}
				}

				fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
				console.log(`Updated ${file} with placeholders`)
			}
		}
	}

	console.log('Placeholders generation completed!')
}

generatePlaceholders().catch(console.error)
