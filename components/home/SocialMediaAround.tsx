import React from "react";

import { motion } from "framer-motion";

import GithubIcon from "@/components/icons/GithubIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";

interface IconProps {
	href: string;
	Icon: React.ComponentType<{ className?: string }>;
	label: string;
}

const IconClickableWithAnimation = React.memo(({ href, Icon, label }: IconProps) => (
	<motion.div
		whileHover={{
			y: -3,
			transition: { duration: 0.1 },
		}}
	>
		<a href={href} target="_blank" rel="noreferrer" aria-label={label}>
			<Icon className="h-6 w-6 fill-current text-text-secondary hover:cursor-pointer hover:text-accent-coral" />
		</a>
	</motion.div>
));

IconClickableWithAnimation.displayName = "IconClickableWithAnimation";

const socialLinks: IconProps[] = [
	{ Icon: GithubIcon, href: "https://github.com/apolovyi", label: "GitHub Profile" },
	{ Icon: LinkedinIcon, href: "https://www.linkedin.com/in/apolovyi/", label: "LinkedIn Profile" },
	{ Icon: InstagramIcon, href: "https://www.instagram.com/artem_polevoi/", label: "Instagram Profile" },
];

interface SocialMediaEmailProps {
	finishedLoading: boolean;
}

const SocialMediaEmail = ({ finishedLoading }: SocialMediaEmailProps) => {
	const animationDelay = finishedLoading ? 0 : 7;

	return (
		<>
			<motion.div
				initial={{ y: "100%" }}
				animate={{ y: "0%" }}
				transition={{ y: { delay: animationDelay, duration: 0.5 } }}
				className="fixed bottom-0 left-0 z-10 hidden flex-row items-center justify-between px-12 lg:flex"
			>
				<div className="flex flex-col items-center justify-center space-y-8">
					<div className="flex flex-col items-center justify-center space-y-5">
						{socialLinks.map((link) => (
							<IconClickableWithAnimation key={link.href} {...link} />
						))}
					</div>
					<div className="h-28 w-0.5 bg-accent-green" aria-hidden="true"></div>
				</div>
			</motion.div>

			<motion.div
				initial={{ y: "170%" }}
				animate={{ y: "0%" }}
				transition={{ y: { delay: animationDelay, duration: 0.5 } }}
				className="fixed -right-10 bottom-0 z-10 hidden flex-row items-center justify-between lg:flex"
			>
				<div className="flex flex-col items-center justify-center space-y-24">
					<motion.div
						initial={{ rotate: 90 }}
						whileHover={{
							y: -3,
							transition: { y: { duration: 0.1 }, rotate: { duration: 0 } },
						}}
					>
						<a
							href="mailto:info@apolovyi.me"
							rel="noreferrer"
							className="inline-block font-tech tracking-wider text-text-secondary transition-colors duration-300 hover:text-accent-coral"
							aria-label="Send email to info@apolovyi.me"
						>
							info<span className="text-accent-coral">@</span>apolovyi
							<span className="text-accent-coral">.</span>me
						</a>
					</motion.div>
					<div className="h-24 w-0.5 bg-accent-green" aria-hidden="true"></div>
				</div>
			</motion.div>
		</>
	);
};

export default React.memo(SocialMediaEmail);
