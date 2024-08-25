import React, { useState } from "react";
import { motion } from "framer-motion";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/dictionary";
import Logo from "@/components/header/menu/Logo"; // Updated import
import MobileMenu from "@/components/header/menu/MobileMenu";
import IconMenu from "@/components/header/menu/IconMenu";
import { HeaderContext } from "@/components/header/menu/HeaderContext";
import { useScrollDetection } from "@/lib/hooks";
import DesktopMenu from "@/components/header/menu/DesktopMenu";

interface HeaderProps {
  finishedLoading: boolean;
  lang: Locale;
}

const useHeaderState = (finishedLoading: boolean, lang: Locale) => {
  const [showElement, setShowElement] = useState(true);
  const [rotate, setRotate] = useState(false);
  const dictionary = getDictionary(lang);
  const { header } = dictionary;

  return {
    rotate,
    setRotate,
    showElement,
    setShowElement,
    finishedLoading,
    headerTranslations: header,
    lang,
  };
};

const Header = ({ finishedLoading, lang }: HeaderProps) => {
  const isScrolled = useScrollDetection();
  const headerState = useHeaderState(finishedLoading, lang);

  const getHeaderClassName = () => {
    const baseClass =
      "fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 ease-in-out";
    const scrollClass = isScrolled ? "shadow-lg backdrop-blur-sm" : "";
    const bgClass = headerState.showElement
      ? "bg-background-primary bg-opacity-0"
      : isScrolled
      ? "bg-background-primary bg-opacity-50"
      : "bg-transparent";
    return `${baseClass} ${scrollClass} ${bgClass}`;
  };

  return (
    <HeaderContext.Provider value={headerState}>
      <MobileMenu lang={lang} />
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ opacity: { delay: finishedLoading ? 0 : 4.9, duration: 0 } }}
        className={getHeaderClassName()}
      >
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
        <div className="flex items-center space-x-4">
          <DesktopMenu lang={lang} />
          <IconMenu />
        </div>
      </motion.header>
    </HeaderContext.Provider>
  );
};

export default Header;
