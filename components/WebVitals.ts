'use client'

import { useReportWebVitals } from 'next/web-vitals'

import { logger } from '@/lib/logger'

export function WebVitals() {
	useReportWebVitals((metric) => {
		logger.warn(metric)
	})

	return null
}
