import React, { useRef } from 'react'

import type { Locale } from '@/i18n-config'

import GithubIcon from '@/components/icons/GithubIcon'
import InstagramIcon from '@/components/icons/InstagramIcon'
import LinkedinIcon from '@/components/icons/LinkedinIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'

type IconComponent = React.ComponentType<{ className?: string }>

interface IconProps {
	href: string
	Icon: IconComponent
	label: string
}

const ClickableIcon = React.memo(function ClickableIcon({ href, Icon, label }: IconProps) {
	const ref = useRef<HTMLAnchorElement>(null)
	useHoverTapMotion(ref)
	return (
		<a
			ref={ref}
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={label}
			className="inline-flex h-12 w-12 items-center justify-center"
		>
			<Icon className="text-text-secondary hover:text-accent-coral h-5 w-5 fill-current transition-colors duration-300 hover:cursor-pointer" />
		</a>
	)
})

const IconsData: IconProps[] = [
	{ href: 'https://github.com/apolovyi', Icon: GithubIcon, label: 'GitHub Profile' },
	{ href: 'https://www.linkedin.com/in/apolovyi/', Icon: LinkedinIcon, label: 'LinkedIn Profile' },
	{ href: 'https://www.instagram.com/artem_polevoi/', Icon: InstagramIcon, label: 'Instagram Profile' },
]

interface FooterProps {
	lang: Locale
}

const Footer = ({ lang: _lang }: FooterProps) => {
	const dict = useDictionary()
	const { footer } = dict
	const currentYear = new Date().getFullYear()

	return (
		<footer className="flex flex-col items-center justify-center space-y-4 py-8">
			<div className="flex flex-row space-x-8 lg:hidden">
				{IconsData.map((iconData) => (
					<ClickableIcon
						key={iconData.href}
						{...iconData}
					/>
				))}
			</div>
			<p className="font-body text-text-secondary text-center text-sm font-light">
				© {currentYear} Artem Polovyi. {footer.rights}
			</p>
		</footer>
	)
}

export default Footer
