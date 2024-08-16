import React, { useCallback } from "react";
import { motion } from "framer-motion";

export default function DesktopMenu(props: { finishedLoading: boolean }) {
  const menuItems = [
    { id: "01", name: "About", href: "#aboutSection" },
    { id: "02", name: "Experience", href: "#WhereIHaveWorkedSection" },
    { id: "03", name: "Work", href: "#SomethingIveBuiltSection" },
    { id: "04", name: "Contact", href: "#GetInTouchSection" },
  ];

  const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      const yOffset = -100; // Adjust this value based on your header height
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  return (
    <nav className="hidden flex-row items-center space-x-8 font-tech text-xs md:flex">
      {menuItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{
            y: -40,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            type: "spring",
            delay: props.finishedLoading ? 0 : 5.4 + index * 0.1,
            duration: props.finishedLoading ? 0 : 1.2,
          }}
          className="text-AAsecondary"
        >
          <a
            href={item.href}
            className="duration-300 hover:text-AAsecondary"
            onClick={(e) => handleScroll(e, item.href)}
          >
            &gt; {item.id}. <span className="text-white hover:text-AAsecondary">{item.name}</span>
          </a>
        </motion.div>
      ))}
      <motion.div
        initial={{
          y: -40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          delay: props.finishedLoading ? 0 : 6.2,
          duration: props.finishedLoading ? 0 : 1.2,
        }}
      >
        <a
          href="/cv/CV_Artem_Polovyi_EN_WEB.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="border-spacing-2 rounded-sm border border-AAsecondary px-3 py-2 text-AAsecondary hover:bg-ResumeButtonHover"
        >
          Resume
        </a>
      </motion.div>
    </nav>
  );
}
