import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { scrollToSection, useHeaderContext } from "@/components/header/menu/HeaderContext";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/dictionary";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface MobileMenuProps {
  lang: Locale;
}

const MobileMenu = memo(function MobileMenu({ lang }: MobileMenuProps) {
  const { rotate, setRotate, setShowElement } = useHeaderContext();
  const dictionary = getDictionary(lang);
  const { header } = dictionary;

  const closeMenu = useCallback(() => {
    setRotate((prev) => !prev);
    setShowElement((prev) => !prev);
  }, [setRotate, setShowElement]);

  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
      e.preventDefault();
      scrollToSection(href);
      closeMenu();
    },
    [closeMenu],
  );

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={rotate ? { x: "0" } : { x: "100%" }}
      transition={{ x: { duration: 0.4 } }}
      className="fixed z-20 flex h-screen w-full duration-300 md:hidden"
    >
      <div
        onClick={closeMenu}
        className="h-full w-1/4 bg-background-primary bg-opacity-20 backdrop-blur-sm hover:cursor-pointer"
      />
      <div className="flex w-3/4 flex-col items-center justify-center bg-background-primary font-body">
        <div className="mt-4">
          <LanguageSwitcher currentLang={lang} />
        </div>
        <div className="flex flex-col items-center justify-center space-y-8 pt-16">
          {header.menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href)}
              className="flex flex-col space-y-2 text-center"
            >
              <span className="font-tech text-xs text-accent-coral">{item.id}.</span>
              <span className="font-heading text-sm text-text-primary duration-300 hover:cursor-pointer hover:text-accent-coral sm:text-base">
                {item.name}
              </span>
            </a>
          ))}
          <a
            href={header.resumeButton.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-accent-coral px-5 py-2 font-heading text-xs text-accent-coral transition-colors duration-300 hover:bg-accent-coral hover:bg-opacity-10 sm:px-10 sm:py-4"
          >
            {header.resumeButton.text}
          </a>
        </div>
      </div>
    </motion.div>
  );
});

export default MobileMenu;
