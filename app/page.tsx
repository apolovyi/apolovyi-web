import { redirect } from 'next/navigation'

import { i18n } from '@/i18n-config'

export const dynamic = 'error'

export default function Page() {
	redirect(`/${i18n.defaultLocale}`)
}
