#!/usr/bin/env npx tsx

/**
 * Generates dictionary sections from career-data.ts
 * Run: npm run generate:dictionaries
 *
 * This script updates:
 * - experienceSection.roles
 * - heroSection.highlightedTerms
 * - heroSection.roles
 * - aboutMeSection.highlightedTerms
 */
import * as fs from 'fs'
import * as path from 'path'

import {
	type Lang,
	type TaskItem,
	getAboutMeHighlightedTerms,
	getHeroHighlightedTerms,
	stationIdToDictionaryKey,
	stations,
} from '../lib/career-data'

const DICTIONARIES_DIR = path.join(__dirname, '..', 'dictionaries')

// All supported locales
type Locale = 'en' | 'de' | 'ch' | 'uk'

// Hero roles for typewriter animation (single source of truth)
const heroRolesByLocale: Record<Locale, string[]> = {
	en: ['Software Engineer', 'Solutions Architect', 'Tech Lead'],
	de: ['Software-Ingenieur', 'Lösungsarchitekt', 'Tech Lead'],
	ch: ['Software-Ingenieur', 'Lösungsarchitekt', 'Tech Lead'],
	uk: ['Інженер-програміст', 'Архітектор рішень', 'Технічний керівник'],
}

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

	// Update roles section
	const newRoles = generateRoles(lang)

	if (!dictionary.experienceSection) {
		dictionary.experienceSection = {}
	}
	dictionary.experienceSection.roles = newRoles

	// Update heroSection.highlightedTerms and roles
	if (dictionary.heroSection) {
		dictionary.heroSection.highlightedTerms = getHeroHighlightedTerms()
		dictionary.heroSection.roles = heroRolesByLocale[lang as Locale]
	}

	// Update aboutMeSection.highlightedTerms
	if (dictionary.aboutMeSection) {
		dictionary.aboutMeSection.highlightedTerms = getAboutMeHighlightedTerms()
	}

	// Write back with pretty formatting (ensure trailing newline)
	fs.writeFileSync(filePath, JSON.stringify(dictionary, null, '\t') + '\n', 'utf-8')

	console.log(`Updated ${filePath} with ${Object.keys(newRoles).length} roles`)
}

function updateHeroRolesOnly(locale: Locale): void {
	const filePath = path.join(DICTIONARIES_DIR, `${locale}.json`)

	if (!fs.existsSync(filePath)) {
		console.error(`Dictionary file not found: ${filePath}`)
		return
	}

	const content = fs.readFileSync(filePath, 'utf-8')
	const dictionary = JSON.parse(content)

	// Update only heroSection.roles
	if (dictionary.heroSection) {
		dictionary.heroSection.roles = heroRolesByLocale[locale]
	}

	fs.writeFileSync(filePath, JSON.stringify(dictionary, null, '\t') + '\n', 'utf-8')
	console.log(`Updated ${filePath} with hero roles`)
}

function main(): void {
	console.log('Generating dictionary content from career-data.ts...\n')

	// Full update for en/de (career data has translations)
	const fullLanguages: Lang[] = ['en', 'de']
	for (const lang of fullLanguages) {
		updateDictionary(lang)
	}

	// Hero roles only for ch/uk (career data doesn't have these translations)
	const heroOnlyLocales: Locale[] = ['ch', 'uk']
	for (const locale of heroOnlyLocales) {
		updateHeroRolesOnly(locale)
	}

	console.log('\nDone! Run `npm run validate:dictionaries` to verify.')
}

main()
