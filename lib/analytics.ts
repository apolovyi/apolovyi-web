/**
 * Lightweight analytics utility for tracking user interactions
 * Sends events to a custom endpoint or logs in development
 */

type EventName = 'station_click' | 'station_hover' | 'line_toggle' | 'map_replay'

interface AnalyticsEvent {
	event: EventName
	properties?: Record<string, string | number | boolean>
	timestamp?: number
}

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Track an analytics event
 * In development, logs to console
 * In production, could send to analytics endpoint
 */
export function trackEvent(event: EventName, properties?: Record<string, string | number | boolean>): void {
	const eventData: AnalyticsEvent = {
		event,
		properties,
		timestamp: Date.now(),
	}

	if (isDevelopment) {
		// eslint-disable-next-line no-console
		console.log('[Analytics]', eventData)
		return
	}

	// In production, send to analytics endpoint if configured
	// For now, we'll use the browser's sendBeacon API for non-blocking tracking
	if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
		const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT
		if (endpoint) {
			navigator.sendBeacon(endpoint, JSON.stringify(eventData))
		}
	}
}

/**
 * Track station selection in the metro map
 */
export function trackStationClick(stationId: string, stationName: string): void {
	trackEvent('station_click', {
		station_id: stationId,
		station_name: stationName,
	})
}

/**
 * Track line visibility toggle
 */
export function trackLineToggle(lineId: string, visible: boolean): void {
	trackEvent('line_toggle', {
		line_id: lineId,
		visible,
	})
}

/**
 * Track map animation replay
 */
export function trackMapReplay(): void {
	trackEvent('map_replay')
}
