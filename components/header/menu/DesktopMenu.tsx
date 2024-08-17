import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { menuItems, scrollToSection, useHeaderContext } from "@/components/header/menu/HeaderContext";

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

function DesktopMenu() {
  const { finishedLoading } = useHeaderContext();

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
  }, []);

  return (
    <motion.nav
      className="hidden flex-row items-center space-x-8 font-tech text-xs md:flex lg:text-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      custom={finishedLoading}
    >
      {menuItems.map((item) => (
        <motion.div key={item.id} variants={itemVariants} className="text-accent-coral">
          <a
            href={item.href}
            className="duration-300 hover:text-accent-coral"
            onClick={(e) => handleScroll(e, item.href)}
          >
            &gt; {item.id}. <span className="text-text-primary hover:text-accent-coral">{item.name}</span>
          </a>
        </motion.div>
      ))}
      <motion.div variants={itemVariants}>
        <a
          href="/cv/CV_Artem_Polovyi_EN_WEB.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="border-spacing-2 rounded-sm border border-accent-coral bg-background-primary px-3 py-2 text-accent-coral transition-colors duration-300 hover:bg-accent-coral hover:bg-opacity-10"
        >
          Resume
        </a>
      </motion.div>
    </motion.nav>
  );
}

export default DesktopMenu;
