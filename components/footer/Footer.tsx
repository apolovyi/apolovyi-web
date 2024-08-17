import React from "react";
import GithubIcon from "@/components/icons/GithubIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";

type IconComponent = React.ComponentType<{ className?: string }>;

interface IconProps {
  href: string;
  Icon: IconComponent;
}

const ClickableIcon = React.memo(function ClickableIcon({ href, Icon }: IconProps) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon className="h-5 w-5 fill-current text-text-secondary transition-colors duration-300 hover:cursor-pointer hover:text-accent-coral" />
    </a>
  );
});

const IconsData: IconProps[] = [
  { href: "https://github.com/apolovyi", Icon: GithubIcon },
  { href: "https://www.linkedin.com/in/apolovyi/", Icon: LinkedinIcon },
  { href: "https://www.instagram.com/artem_polevoi/", Icon: InstagramIcon },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col items-center justify-center space-y-4 bg-background-primary py-8">
      <div className="flex flex-row space-x-8 lg:hidden">
        {IconsData.map((iconData) => (
          <ClickableIcon key={iconData.href} {...iconData} />
        ))}
      </div>
      <p className="text-center font-body text-sm font-light text-text-secondary">
        © {currentYear} Artem Polovyi. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
