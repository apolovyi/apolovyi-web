import { i18n } from '@/i18n-config'

export const dynamic = 'error'

export default function WorkRedirect() {
	const locales = i18n.locales.join("','")
	const defaultLocale = i18n.defaultLocale
	const detectScript = `
(function() {
  var supported = ['${locales}'];
  var cookie = document.cookie.match(/detectedLang=([^;]+)/);
  var saved = cookie ? cookie[1] : null;
  var browserLanguage = (navigator.language || '').split('-')[0];
  var language = saved && supported.indexOf(saved) !== -1
    ? saved
    : supported.indexOf(browserLanguage) !== -1 ? browserLanguage : '${defaultLocale}';
  window.location.replace('/' + language + '/work');
})();
`

	return (
		<main style={{ visibility: 'hidden' }}>
			<script dangerouslySetInnerHTML={{ __html: detectScript }} />
			<noscript>
				<a href={`/${defaultLocale}/work`}>View selected work</a>
			</noscript>
		</main>
	)
}
