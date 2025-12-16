import { i18n } from '@/i18n-config'

export const dynamic = 'error'

// Root page with language detection.
// Priority: 1) Saved cookie preference, 2) Browser language, 3) Default (en)
// On Netlify: _redirects handles first-time visitors at the edge.
// This JS fallback handles returning users with saved preferences.
export default function Page() {
	const locales = i18n.locales.join("','")
	const defaultLocale = i18n.defaultLocale

	const detectScript = `
(function() {
  var supported = ['${locales}'];
  // Check saved preference first
  var cookie = document.cookie.match(/detectedLang=([^;]+)/);
  var saved = cookie ? cookie[1] : null;
  if (saved && supported.indexOf(saved) !== -1) {
    window.location.replace('/' + saved);
    return;
  }
  // Fall back to browser language
  var lang = (navigator.language || '').split('-')[0];
  var match = supported.indexOf(lang) !== -1 ? lang : '${defaultLocale}';
  window.location.replace('/' + match);
})();
`

	return (
		<main style={{ visibility: 'hidden' }}>
			<script dangerouslySetInnerHTML={{ __html: detectScript }} />
			<noscript>
				<a href={`/${defaultLocale}`}>Go to {defaultLocale.toUpperCase()}</a>
			</noscript>
		</main>
	)
}
