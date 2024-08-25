import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { scrollToSection, useHeaderContext } from "@/components/header/menu/HeaderContext";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/dictionary";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (finishedLoading: boolean) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: finishedLoading ? 0 : 5.4,
    },
  }),
};

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
    },
  },
};

interface DesktopMenuProps {
  lang: Locale;
}

function DesktopMenu({ lang }: DesktopMenuProps) {
  const { finishedLoading } = useHeaderContext();
  const dictionary = getDictionary(lang);
  const { header } = dictionary;

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
  }, []);

  return (
    <motion.nav
      className="hidden flex-row items-center space-x-4 font-tech text-xs md:flex lg:space-x-10 xl:text-lg 2xl:space-x-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={finishedLoading}
    >
      {header.menuItems.map((item) => (
        <motion.div key={item.id} variants={itemVariants} className="text-accent-coral">
          <a
            href={item.href}
            className="duration-300 hover:text-accent-coral"
            onClick={(e) => handleScroll(e, item.href)}
          >
            &gt; {item.id}. <span className="font-heading text-text-primary hover:text-accent-coral">{item.name}</span>
          </a>
        </motion.div>
      ))}
      <motion.div variants={itemVariants}>
        <a
          href={header.resumeButton.href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-spacing-2 rounded-sm border border-accent-coral bg-background-primary px-3 py-2 text-accent-coral transition-colors duration-300 hover:bg-accent-coral hover:bg-opacity-10"
        >
          {header.resumeButton.text}
        </a>
      </motion.div>
      <motion.div variants={itemVariants}>
        <LanguageSwitcher currentLang={lang} />
      </motion.div>
    </motion.nav>
  );
}

export default DesktopMenu;
