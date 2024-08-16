import React, { useEffect, useState } from "react";
import Logo from "@/components/header/menu/Logo";
import DesktopMenu from "@/components/header/menu/DesktopMenu";
import IconMenu from "@/components/header/menu/IconMenu";
import MobileMenu from "@/components/header/menu/MobileMenu";
import { motion } from "framer-motion";

const Header = (props: { finishedLoading: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showElement, setShowElement] = useState(true);
  const [rotate, setRotate] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <MobileMenu rotate={rotate} setRotate={setRotate} setShowElement={setShowElement} showElement={showElement} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          opacity: { delay: props.finishedLoading ? 0 : 4.9, duration: 0 },
        }}
        className={`fixed left-0 right-0 top-0 z-50 flex w-full justify-between px-6
          py-2 transition-all duration-300 ease-in-out sm:px-12 sm:py-4
          ${isScrolled ? "shadow-lg backdrop-blur-sm" : ""}
          ${showElement ? "bg-AAprimary bg-opacity-70" : isScrolled ? "bg-AAprimary bg-opacity-50" : "bg-transparent"}
        `}
      >
        <Logo />

        <IconMenu
          rotate={rotate}
          setRotate={setRotate}
          setShowElement={setShowElement}
          showElement={showElement}
          finishedLoading={props.finishedLoading}
        />

        <DesktopMenu finishedLoading={props.finishedLoading} />
      </motion.div>
    </>
  );
};
export default Header;
