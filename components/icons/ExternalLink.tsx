interface ExternalLinkProps {
	url: string
	label?: string
}

const ExternalLink = ({ url, label = 'Open external link' }: ExternalLinkProps) => {
	return (
		<a
			href={url}
			target="_blank"
			rel="noreferrer noopener"
			aria-label={label}
			className="inline-flex h-12 w-12 items-center justify-center"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="text-scd-light hover:text-secondary h-6 w-6 transition delay-50 duration-200 ease-in-out hover:-translate-y-1 hover:scale-110"
				aria-hidden="true"
				focusable="false"
			>
				<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
				<polyline points="15 3 21 3 21 9"></polyline>
				<line
					x1="10"
					y1="14"
					x2="21"
					y2="3"
				></line>
			</svg>
		</a>
	)
}
export default ExternalLink
