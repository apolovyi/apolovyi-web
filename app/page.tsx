import { i18n } from '@/i18n-config'

export const dynamic = 'error'

// Serve a minimal static page that immediately navigates to the default locale.
// This ensures the exported index.html includes the full document with <html lang="en">,
// satisfying smoke tests and preserving SSR/SEO-friendly markup.
export default function Page() {
	const href = `/${i18n.defaultLocale}`
	return (
		<main>
			<script dangerouslySetInnerHTML={{ __html: `window.location.replace('${href}')` }} />
			<noscript>
				<a href={href}>Go to {i18n.defaultLocale.toUpperCase()}</a>
			</noscript>
		</main>
	)
}
