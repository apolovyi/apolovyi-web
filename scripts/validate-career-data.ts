#!/usr/bin/env npx tsx

/**
 * Validates career data integrity
 * Run: npm run validate:career-data
 */
import { certifications, education, lines, parseMonthYear, stations } from '../lib/career-data'

interface ValidationError {
	type: 'error' | 'warning'
	message: string
}

const errors: ValidationError[] = []

function error(message: string): void {
	errors.push({ type: 'error', message })
}

function warning(message: string): void {
	errors.push({ type: 'warning', message })
}

// 1. Check unique station IDs
function validateUniqueIds(): void {
	const ids = new Set<string>()
	for (const station of stations) {
		if (ids.has(station.id)) {
			error(`Duplicate station ID: ${station.id}`)
		}
		ids.add(station.id)
	}
}

// 2. Check all line station references exist
function validateLineReferences(): void {
	const stationIds = new Set(stations.map((s) => s.id))

	for (const line of lines) {
		for (const stationId of line.stations) {
			if (!stationIds.has(stationId)) {
				error(`Line "${line.id}" references non-existent station: ${stationId}`)
			}
		}
	}
}

// 3. Check stations reference valid lines
function validateStationLines(): void {
	const lineIds = new Set(lines.map((l) => l.id))

	for (const station of stations) {
		for (const lineId of station.lines) {
			if (!lineIds.has(lineId)) {
				error(`Station "${station.id}" references non-existent line: ${lineId}`)
			}
		}
	}
}

// 4. Validate tenure months approximately match period
function validateTenure(): void {
	for (const station of stations) {
		const start = parseMonthYear(station.period.start)
		const end = station.period.end === 'present' ? new Date() : parseMonthYear(station.period.end)

		const expectedMonths = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))

		const diff = Math.abs(expectedMonths - station.tenureMonths)

		if (diff > 3) {
			warning(`Station "${station.id}" tenure mismatch: declared ${station.tenureMonths}mo, calculated ~${expectedMonths}mo`)
		}
	}
}

// 5. Check required fields
function validateRequiredFields(): void {
	for (const station of stations) {
		if (!station.company) error(`Station "${station.id}" missing company`)
		if (!station.role.en) error(`Station "${station.id}" missing English role`)
		if (!station.role.de) error(`Station "${station.id}" missing German role`)
		if (!station.location.city) error(`Station "${station.id}" missing city`)
		if (!station.period.start) error(`Station "${station.id}" missing start date`)
		if (station.tasks.en.length === 0 && station.id !== 'career-break') {
			warning(`Station "${station.id}" has no English tasks`)
		}
		if (station.tasks.de.length === 0 && station.id !== 'career-break') {
			warning(`Station "${station.id}" has no German tasks`)
		}
	}
}

// 6. Check certification references
function validateCertificationReferences(): void {
	const stationIds = new Set(stations.map((s) => s.id))

	for (const cert of certifications) {
		if (cert.relatedStationId && !stationIds.has(cert.relatedStationId)) {
			error(`Certification "${cert.id}" references non-existent station: ${cert.relatedStationId}`)
		}
	}
}

// 7. Check chronological order
function validateChronologicalOrder(): void {
	let lastDate: Date | null = null

	for (const station of stations) {
		if (station.id === 'smartdorm') continue // Parallel volunteer work

		const startDate = parseMonthYear(station.period.start)

		if (lastDate && startDate < lastDate) {
			warning(`Station "${station.id}" starts before previous station ends (may be intentional overlap)`)
		}

		lastDate = station.period.end === 'present' ? new Date() : parseMonthYear(station.period.end)
	}
}

// 8. Check for empty technologies (except career break)
function validateTechnologies(): void {
	for (const station of stations) {
		if (station.id === 'career-break') continue
		if (station.technologies.length === 0) {
			warning(`Station "${station.id}" has no technologies listed`)
		}
	}
}

// 9. Check i18n parity
function validateI18nParity(): void {
	for (const station of stations) {
		if (station.tasks.en.length !== station.tasks.de.length) {
			warning(`Station "${station.id}" has mismatched task counts: EN=${station.tasks.en.length}, DE=${station.tasks.de.length}`)
		}
	}
}

// Run all validations
function validate(): boolean {
	console.log('Validating career data...\n')

	validateUniqueIds()
	validateLineReferences()
	validateStationLines()
	validateTenure()
	validateRequiredFields()
	validateCertificationReferences()
	validateChronologicalOrder()
	validateTechnologies()
	validateI18nParity()

	const errorCount = errors.filter((e) => e.type === 'error').length
	const warningCount = errors.filter((e) => e.type === 'warning').length

	if (errors.length === 0) {
		console.log('✅ All validations passed!')
		console.log(`   ${stations.length} stations`)
		console.log(`   ${lines.length} lines`)
		console.log(`   ${certifications.length} certifications`)
		console.log(`   ${education.length} education entries`)
		return true
	}

	for (const err of errors) {
		const prefix = err.type === 'error' ? '❌' : '⚠️'
		console.log(`${prefix} ${err.message}`)
	}

	console.log(`\n${errorCount} error(s), ${warningCount} warning(s)`)

	return errorCount === 0
}

// Main
const success = validate()
process.exit(success ? 0 : 1)
