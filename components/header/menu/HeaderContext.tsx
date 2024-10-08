import { createContext, useContext } from 'react'

interface HeaderContextType {
	rotate: boolean
	setRotate: React.Dispatch<React.SetStateAction<boolean>>
	showElement: boolean
	setShowElement: React.Dispatch<React.SetStateAction<boolean>>
	finishedLoading: boolean
}

export const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export const useHeaderContext = () => {
	const context = useContext(HeaderContext)
	if (!context) throw new Error('useHeaderContext must be used within a HeaderProvider')
	return context
}

export const scrollToSection = (href: string) => {
	const targetId = href.replace('#', '')
	const elem = document.getElementById(targetId)
	if (elem) {
		const yOffset = -100 // Adjust based on header height
		const y = elem.getBoundingClientRect().top + window.scrollY + yOffset
		window.scrollTo({ top: y, behavior: 'smooth' })
	}
}
