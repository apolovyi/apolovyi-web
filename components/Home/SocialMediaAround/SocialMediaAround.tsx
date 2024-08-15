import React from "react";
import { motion } from "framer-motion";
import GithubIcon from "components/Icons/GithubIcon";
import LinkedinIcon from "components/Icons/LinkedinIcon";
import InstagramIcon from "components/Icons/InstagramIcon";

const IconClickableWithAnimation = (props) => {
  return (
    <motion.div
      whileHover={{
        y: -3,
        transition: { duration: 0.1 },
      }}
      className=""
    >
      <a href={props.href} className="" target={"_blank"} rel="noreferrer">
        <props.Icon
          className={
            "h-6 w-6 fill-current text-gray-400 hover:cursor-pointer hover:text-AAsecondary"
          }
        />
      </a>
    </motion.div>
  );
};
export default function SocialMediaEmail(props: { finishedLoading: boolean }) {
  return (
    <>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ y: { delay: 0, duration: 0.5 } }}
        className="fixed bottom-0 left-0 z-10  hidden flex-row items-center justify-between px-12 lg:flex  "
      >
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="flex flex-col items-center justify-center space-y-5">
            {/* Github Icon */}
            <IconClickableWithAnimation
              Icon={GithubIcon}
              href={"https://github.com/apolovyi"}
            />
            {/* Linkedin icon */}
            <IconClickableWithAnimation
              Icon={LinkedinIcon}
              href={"https://www.linkedin.com/in/apolovyi/"}
            />
            {/* Instagram Icon */}
            <IconClickableWithAnimation
              Icon={InstagramIcon}
              href={"https://www.instagram.com/artem_polevoi/"}
            />
          </div>
          <div className="h-28 w-0.5 bg-gray-400"></div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: "170%" }}
        animate={{ y: "0%" }}
        transition={{ y: { delay: 0, duration: 0.5 } }}
        className="fixed -right-10 bottom-0 z-10 hidden flex-row items-center justify-between lg:flex"
      >
        <div className="flex flex-col items-center justify-center space-y-24">
          <motion.div
            initial={{ rotate: 90 }}
            whileHover={{
              y: -3,
              transition: { y: { duration: 0.1 }, rotate: { duration: 0 } },
            }}
            className=""
          >
            <a
              href="mailto:info@apolovyi.me"
              target={"_blank"}
              rel="noreferrer"
            >
              <span className=" font-Header tracking-wider text-gray-400 hover:cursor-pointer hover:text-AAsecondary">
                info<span className="text-AAsecondary">@</span>apolovyi
                <span className="text-AAsecondary">.</span>com
              </span>
            </a>
          </motion.div>

          <div className="h-24 w-0.5 bg-gray-400"></div>
        </div>
      </motion.div>
    </>
  );
}
