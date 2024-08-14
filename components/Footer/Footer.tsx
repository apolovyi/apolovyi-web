import React from "react";
import GithubIcon from "../Icons/GithubIcon";
import LinkedinIcon from "../Icons/LinkedinIcon";
import InstagramIcon from "../Icons/InstagramIcon";

const ClickableIcon = props => {
    return (
        <a href={props.href} className="" target={"_blank"} rel="noreferrer">
            <props.Icon className={"w-5 h-5 text-gray-400 hover:text-AAsecondary fill-current hover:cursor-pointer"}/>
        </a>
    );
};
const IconsData = [
    {href: "https://github.com/apolovyi", Icon: GithubIcon},
    {href: "https://www.linkedin.com/in/apolovyi/", Icon: LinkedinIcon},
    {href: "https://www.instagram.com/artem_polevoi/", Icon: InstagramIcon},
];

export default function Footer(props: { hideSocialsInDesktop: boolean }) {
    return (
        <div className="bg-AAprimary flex flex-col justify-center items-center py-8 space-y-4">
            <div className={`flex flex-row space-x-8 ${props.hideSocialsInDesktop ? "lg:hidden" : ""}`}>
                {IconsData.map((iconData, index) => {
                    return <ClickableIcon key={index} href={iconData.href} Icon={iconData.Icon}/>;
                })}
            </div>
        </div>
    );
}
