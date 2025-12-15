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
 *
 * Locale to career data language mapping:
 * - en → en (English)
 * - de → de (German)
 * - ch → ch (Swiss German)
 * - uk → uk (Ukrainian)
 */
import * as fs from 'fs'
import * as path from 'path'

import { type Locale, i18n } from '../i18n-config'
import {
	type Lang,
	type TaskItem,
	getAboutMeHighlightedTerms,
	getHeroHighlightedTerms,
	stationIdToDictionaryKey,
	stations,
} from '../lib/career-data'

const DICTIONARIES_DIR = path.join(__dirname, '..', 'dictionaries')

// Map locales to career data language
const localeToCareerLang: Record<Locale, Lang> = {
	en: 'en',
	de: 'de',
	ch: 'ch', // Full Swiss German translations
	uk: 'uk', // Full Ukrainian translations
}

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
		ch: 'Aagstellt bi Flowable, igsetzt bi UBS',
		uk: 'Працевлаштований у Flowable, відряджений до UBS',
	},
}

function formatDate(start: string, end: string | 'present', lang: Lang): string {
	const presentLabels: Record<Lang, string> = {
		en: 'Present',
		de: 'Heute',
		ch: 'Jetzt',
		uk: 'Зараз',
	}
	const endStr = end === 'present' ? presentLabels[lang] : end
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

function updateDictionary(locale: Locale): void {
	const filePath = path.join(DICTIONARIES_DIR, `${locale}.json`)
	const careerLang = localeToCareerLang[locale]

	if (!fs.existsSync(filePath)) {
		console.error(`Dictionary file not found: ${filePath}`)
		return
	}

	const content = fs.readFileSync(filePath, 'utf-8')
	const dictionary = JSON.parse(content)

	// Update roles section (using career data in fallback language)
	const newRoles = generateRoles(careerLang)

	if (!dictionary.experienceSection) {
		dictionary.experienceSection = {}
	}
	dictionary.experienceSection.roles = newRoles

	// Update heroSection.highlightedTerms and roles
	if (dictionary.heroSection) {
		dictionary.heroSection.highlightedTerms = getHeroHighlightedTerms()
		dictionary.heroSection.roles = heroRolesByLocale[locale]
	}

	// Update aboutMeSection.highlightedTerms
	if (dictionary.aboutMeSection) {
		dictionary.aboutMeSection.highlightedTerms = getAboutMeHighlightedTerms()
	}

	// Write back with pretty formatting (ensure trailing newline)
	fs.writeFileSync(filePath, JSON.stringify(dictionary, null, '\t') + '\n', 'utf-8')

	const fallbackNote = careerLang !== locale ? ` (career data from ${careerLang})` : ''
	console.log(`Updated ${filePath} with ${Object.keys(newRoles).length} roles${fallbackNote}`)
}

function main(): void {
	console.log('Generating dictionary content from career-data.ts...\n')

	for (const locale of i18n.locales) {
		updateDictionary(locale)
	}

	console.log('\nDone! Run `npm run validate:dictionaries` to verify.')
}

main()
