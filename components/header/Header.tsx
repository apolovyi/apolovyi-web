import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getDictionary } from "@/lib/dictionary";
import { Locale } from "@/i18n-config";
import Logo from "@/components/header/menu/Logo";
import DesktopMenu from "@/components/header/menu/DesktopMenu";
import IconMenu from "@/components/header/menu/IconMenu";
import MobileMenu from "@/components/header/menu/MobileMenu";
import { HeaderContext } from "@/components/header/menu/HeaderContext";

interface HeaderProps {
  finishedLoading: boolean;
  lang: Locale;
}

function Header({ finishedLoading, lang }: Readonly<HeaderProps>) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showElement, setShowElement] = useState(true);
  const [rotate, setRotate] = useState(false);
  const dictionary = getDictionary(lang);
  const { header } = dictionary;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const contextValue = useMemo(
    () => ({
      rotate,
      setRotate,
      showElement,
      setShowElement,
      finishedLoading,
      headerTranslations: header,
      lang,
    }),
    [rotate, showElement, finishedLoading, header, lang],
  );

  return (
    <HeaderContext.Provider value={contextValue}>
      <MobileMenu lang={lang} />
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { delay: finishedLoading ? 0 : 4.9, duration: 0 } }}
        className={`fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 ease-in-out sm:px-12 sm:py-6
          ${isScrolled ? "shadow-lg backdrop-blur-sm" : ""}
          ${
            showElement
              ? "bg-background-primary bg-opacity-70"
              : isScrolled
              ? "bg-background-primary bg-opacity-50"
              : "bg-transparent"
          }`}
      >
        <Logo />
        <div className="flex items-center space-x-4">
          <DesktopMenu lang={lang} />
          <IconMenu />
        </div>
      </motion.header>
    </HeaderContext.Provider>
  );
}

export default Header;
