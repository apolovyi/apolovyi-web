'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Locale } from '@/i18n-config'

import CheckCircleIcon from '@/components/icons/CheckCircleIcon'
import XCircleIcon from '@/components/icons/XCircleIcon'
import { useDictionary } from '@/components/shared/DictionaryContext'
import SectionHeader from '@/components/shared/SectionHeader'
import { useHoverTapMotion } from '@/components/shared/useHoverTapMotion'
import { useMotionInView } from '@/components/shared/useMotionInView'

import { logger } from '@/lib/logger'

type SubmitStatus = 'idle' | 'success' | 'error'

interface GetInTouchProps {
	lang: Locale
}

function GetInTouch({ lang: _lang }: GetInTouchProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

	const dictionary = useDictionary()

	// Auto-hide success message after 5 seconds
	useEffect(() => {
		if (submitStatus === 'success') {
			const timer = setTimeout(() => setSubmitStatus('idle'), 5000)
			return () => clearTimeout(timer)
		}
	}, [submitStatus])
	const { contactSection } = dictionary
	const sectionRef = useRef<HTMLElement>(null)
	const headerRef = useRef<HTMLElement>(null)
	const submitBtnRef = useRef<HTMLButtonElement>(null)
	useMotionInView(sectionRef, 'fade-up')
	useMotionInView(headerRef, 'fade-up')
	useHoverTapMotion(submitBtnRef)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSubmitting(true)
		setSubmitStatus('idle')

		const form = event.currentTarget

		try {
			const formData = new FormData(form)

			const response = await fetch(form.action || window.location.pathname, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
			})

			if (response.ok) {
				setSubmitStatus('success')
				form.reset()
			} else {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
		} catch (error) {
			logger.error('Form submission error:', error)
			setSubmitStatus('error')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<section
			ref={sectionRef}
			id="contactSection"
			className="flex w-full flex-col space-y-12 px-4 py-32 sm:px-16 md:px-16 lg:px-24 xl:space-y-28 2xl:px-72"
		>
			<div className="flex flex-col items-center space-y-6">
				<div className="mx-auto flex w-full flex-col px-4 sm:px-6">
					<SectionHeader
						number="04."
						title={contactSection.title}
						headerRef={headerRef}
					/>
				</div>

				<div className="mt-14 text-center text-3xl font-bold tracking-wide text-text-primary sm:text-5xl">{contactSection.subtitle}</div>

				<p className="mx-auto max-w-4xl text-center font-body text-lg leading-relaxed text-text-secondary md:px-32">
					{contactSection.content}
				</p>

				<form
					name="contact"
					method="POST"
					onSubmit={handleSubmit}
					className="w-full max-w-md space-y-4"
					data-netlify="true"
					data-netlify-honeypot="bot-field"
				>
					<input
						type="hidden"
						name="form-name"
						value="contact"
					/>

					<div style={{ display: 'none' }}>
						<label>
							Don&apos;t fill this out if you&apos;re human:
							<input
								name="bot-field"
								tabIndex={-1}
								autoComplete="off"
							/>
						</label>
					</div>

					<FormField
						label={contactSection.formLabels.name}
						name="name"
						type="text"
						required
					/>
					<FormField
						label={contactSection.formLabels.email}
						name="email"
						type="email"
						required
					/>
					<FormField
						label={contactSection.formLabels.message}
						name="message"
						type="textarea"
						required
						rows={4}
					/>

					<div className="flex justify-center">
						<button
							ref={submitBtnRef}
							type="submit"
							disabled={isSubmitting}
							className="flex items-center gap-2 rounded-md border-2 border-accent-coral px-6 py-2 font-tech text-sm text-accent-coral transition-all duration-300 ease-in-out hover:bg-accent-coral hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-accent-coral focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting && (
								<svg
									className="h-4 w-4 animate-spin"
									viewBox="0 0 24 24"
									fill="none"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
							)}
							{isSubmitting ? contactSection.sending : contactSection.sendButton}
						</button>
					</div>
				</form>

				{submitStatus !== 'idle' && <StatusMessage status={submitStatus} />}
			</div>
		</section>
	)
}

interface FormFieldProps {
	label: string
	name: string
	type: string
	required?: boolean
	rows?: number
}

function FormField({ label, name, type, required, rows }: FormFieldProps) {
	return (
		<div>
			<label
				htmlFor={name}
				className="mb-2 block font-tech text-sm text-text-secondary"
			>
				{label}
			</label>
			{type === 'textarea' ? (
				<textarea
					name={name}
					id={name}
					required={required}
					rows={rows}
					className="w-full rounded-md border border-neutral-medium-gray bg-transparent px-4 py-2 text-text-primary focus:border-accent-coral focus:outline-none focus:ring-1 focus:ring-accent-coral"
				/>
			) : (
				<input
					type={type}
					name={name}
					id={name}
					required={required}
					className="w-full rounded-md border border-neutral-medium-gray bg-transparent px-4 py-2 text-text-primary focus:border-accent-coral focus:outline-none focus:ring-1 focus:ring-accent-coral"
				/>
			)}
		</div>
	)
}

interface StatusMessageProps {
	status: 'success' | 'error'
}

function StatusMessage({ status }: StatusMessageProps) {
	const dictionary = useDictionary()
	const { contactSection } = dictionary

	const isSuccess = status === 'success'
	const Icon = isSuccess ? CheckCircleIcon : XCircleIcon
	const message = isSuccess ? contactSection.successMessage : contactSection.errorMessage

	return (
		<div className={`mt-4 flex items-center rounded-md p-4 ${isSuccess ? 'bg-success bg-opacity-10' : 'bg-error bg-opacity-10'}`}>
			<Icon className={`mr-3 h-5 w-5 ${isSuccess ? 'text-success' : 'text-error'}`} />
			<span className={`text-sm ${isSuccess ? 'text-success' : 'text-error'}`}>{message}</span>
		</div>
	)
}

export default GetInTouch
