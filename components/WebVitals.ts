'use client'

import { useReportWebVitals } from 'next/web-vitals'

import { logger } from '@/lib/logger'

export function WebVitals() {
	useReportWebVitals((metric) => {
		logger.debug(metric)
	})

	return null
}
