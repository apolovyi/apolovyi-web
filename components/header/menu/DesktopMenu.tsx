import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { menuItems, scrollToSection, useHeaderContext } from "@/components/header/menu/HeaderContext";

function DesktopMenu() {
  const { finishedLoading } = useHeaderContext();

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
  }, []);

  return (
    <nav className="hidden flex-row items-center space-x-8 font-tech text-xs md:flex lg:text-lg ">
      {menuItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            delay: finishedLoading ? 0 : 5.4 + index * 0.1,
            duration: finishedLoading ? 0 : 1.2,
          }}
          className="text-accent-coral"
        >
          <a
            href={item.href}
            className="duration-300 hover:text-accent-coral"
            onClick={(e) => handleScroll(e, item.href)}
          >
            &gt; {item.id}. <span className="text-text-primary hover:text-accent-coral">{item.name}</span>
          </a>
        </motion.div>
      ))}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          delay: finishedLoading ? 0 : 6.2,
          duration: finishedLoading ? 0 : 1.2,
        }}
      >
        <a
          href="/cv/CV_Artem_Polovyi_EN_WEB.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="border-spacing-2 rounded-sm border border-accent-coral bg-background-primary px-3 py-2 text-accent-coral hover:bg-accent-coral hover:bg-opacity-10"
        >
          Resume
        </a>
      </motion.div>
    </nav>
  );
}
export default DesktopMenu;
