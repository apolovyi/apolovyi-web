import React from "react";
import GithubIcon from "components/Icons/GithubIcon";
import LinkedinIcon from "components/Icons/LinkedinIcon";
import InstagramIcon from "components/Icons/InstagramIcon";

const ClickableIcon = (props) => {
  return (
    <a href={props.href} className="" target={"_blank"} rel="noreferrer">
      <props.Icon
        className={
          "h-5 w-5 fill-current text-gray-400 hover:cursor-pointer hover:text-AAsecondary"
        }
      />
    </a>
  );
};
const IconsData = [
  { href: "https://github.com/apolovyi", Icon: GithubIcon },
  { href: "https://www.linkedin.com/in/apolovyi/", Icon: LinkedinIcon },
  { href: "https://www.instagram.com/artem_polevoi/", Icon: InstagramIcon },
];

export default function Footer(props: { hideSocialsInDesktop: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-AAprimary py-8">
      <div
        className={`flex flex-row space-x-8 ${
          props.hideSocialsInDesktop ? "lg:hidden" : ""
        }`}
      >
        {IconsData.map((iconData, index) => {
          return (
            <ClickableIcon
              key={index}
              href={iconData.href}
              Icon={iconData.Icon}
            />
          );
        })}
      </div>
    </div>
  );
}
