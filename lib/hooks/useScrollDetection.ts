import { useEffect, useState } from 'react'

export const useScrollDetection = () => {
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 0)
		// Check initial scroll position on mount
		handleScroll()
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return isScrolled
}
