'use client'

import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

type SharedState = {
	finishedLoading: boolean
}

type AppContextType = {
	sharedState: SharedState
	setSharedState: Dispatch<SetStateAction<SharedState>>
}

const defaultContextValue: AppContextType = {
	sharedState: { finishedLoading: true },
	setSharedState: () => {},
}

export const AppContext = createContext<AppContextType>(defaultContextValue)

type AppProviderProps = {
	children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
	const [sharedState, setSharedState] = useState<SharedState>(defaultContextValue.sharedState)

	const value = useMemo(() => ({ sharedState, setSharedState }), [sharedState, setSharedState])
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
	const context = useContext(AppContext)
	if (context === defaultContextValue) {
		throw new Error('useAppContext must be used within an AppProvider')
	}
	return context
}
