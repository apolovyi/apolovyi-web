import * as fs from 'fs'
import * as path from 'path'

import { dictionarySchema } from '../lib/dictionary.schema'

const DICTIONARIES_DIR = path.join(__dirname, '..', 'dictionaries')

function validateDictionaries(): boolean {
	const files = fs.readdirSync(DICTIONARIES_DIR).filter((f) => f.endsWith('.json'))

	let allValid = true

	for (const file of files) {
		const filePath = path.join(DICTIONARIES_DIR, file)
		try {
			const raw = fs.readFileSync(filePath, 'utf8')
			const json = JSON.parse(raw)
			const result = dictionarySchema.safeParse(json)

			if (!result.success) {
				allValid = false
				console.error(
					`[validate-dictionaries] ${file} failed schema validation. Correct the reported fields and rerun pnpm run validate:dictionaries.\n${JSON.stringify(result.error.format(), null, 2)}`,
				)
			} else {
				console.log(`✅ ${file} valid`)
			}
		} catch (e) {
			allValid = false
			console.error(
				`[validate-dictionaries] Cannot read or parse ${file}. ${(e as Error).message}. Correct the file and rerun pnpm run validate:dictionaries.`,
			)
		}
	}

	if (allValid) {
		console.log('\nAll dictionaries validated successfully.')
	} else {
		console.error('[validate-dictionaries] Dictionary validation failed. Fix the reported files and rerun pnpm run validate:dictionaries.')
	}

	return allValid
}

const success = validateDictionaries()
process.exit(success ? 0 : 1)
