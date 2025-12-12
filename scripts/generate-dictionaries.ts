#!/usr/bin/env npx tsx

/**
 * Generates dictionary experience sections from career-data.ts
 * Run: npm run generate:dictionaries
 *
 * This script updates only the experienceSection.roles in dictionaries.
 * Other sections remain unchanged.
 */
import * as fs from 'fs'
import * as path from 'path'

import { type Lang, type TaskItem, stationIdToDictionaryKey, stations } from '../lib/career-data'

const DICTIONARIES_DIR = path.join(__dirname, '..', 'dictionaries')

interface DictionaryRole {
	title: string
	date: string
	url: string
	subtitle?: string
	tasks: TaskItem[]
}

// Special subtitles for certain roles
const roleSubtitles: Record<string, Record<Lang, string>> = {
	'ubs-flowable': {
		en: 'Employed by Flowable, deployed at UBS',
		de: 'Angestellt bei Flowable, eingesetzt bei UBS',
	},
}

function formatDate(start: string, end: string | 'present', lang: Lang): string {
	const endStr = end === 'present' ? (lang === 'en' ? 'Present' : 'Heute') : end
	return `${start} - ${endStr}`
}

function generateRoles(lang: Lang): Record<string, DictionaryRole> {
	const roles: Record<string, DictionaryRole> = {}

	for (const station of stations) {
		const key = stationIdToDictionaryKey(station.id)

		const role: DictionaryRole = {
			title: station.role[lang],
			date: formatDate(station.period.start, station.period.end, lang),
			url: station.url || '',
			tasks: station.tasks[lang],
		}

		// Add subtitle if exists
		if (roleSubtitles[station.id]?.[lang]) {
			role.subtitle = roleSubtitles[station.id][lang]
		}

		roles[key] = role
	}

	return roles
}

function updateDictionary(lang: Lang): void {
	const filePath = path.join(DICTIONARIES_DIR, `${lang}.json`)

	if (!fs.existsSync(filePath)) {
		console.error(`Dictionary file not found: ${filePath}`)
		return
	}

	const content = fs.readFileSync(filePath, 'utf-8')
	const dictionary = JSON.parse(content)

	// Update only the roles section
	const newRoles = generateRoles(lang)

	if (!dictionary.experienceSection) {
		dictionary.experienceSection = {}
	}

	dictionary.experienceSection.roles = newRoles

	// Write back with pretty formatting
	fs.writeFileSync(filePath, JSON.stringify(dictionary, null, '\t'), 'utf-8')

	console.log(`Updated ${filePath} with ${Object.keys(newRoles).length} roles`)
}

function main(): void {
	console.log('Generating dictionary roles from career-data.ts...\n')

	const languages: Lang[] = ['en', 'de']

	for (const lang of languages) {
		updateDictionary(lang)
	}

	console.log('\nDone! Run `npm run validate:dictionaries` to verify.')
}

main()
