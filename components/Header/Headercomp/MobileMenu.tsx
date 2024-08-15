import { motion } from "framer-motion";
import { useCallback } from "react";

interface MobileMenuProps {
  rotate: boolean;
  setRotate: React.Dispatch<React.SetStateAction<boolean>>;
  showElement: boolean;
  setShowElement: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu = ({
  rotate,
  setRotate,
  showElement,
  setShowElement,
}: MobileMenuProps) => {
  const closeMenu = useCallback(() => {
    setRotate((prev) => !prev);
    setShowElement((prev) => !prev);
  }, [setRotate, setShowElement]);

  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        const yOffset = -100; // Adjust this value based on your header height
        const y =
          elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      closeMenu();
    },
    [closeMenu],
  );

  const menuItems = [
    { id: "01", name: "About", href: "#aboutSection" },
    { id: "02", name: "Experience", href: "#WhereIHaveWorkedSection" },
    { id: "03", name: "Work", href: "#SomethingIveBuiltSection" },
    { id: "04", name: "Contact", href: "#GetInTouchSection" },
  ];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={rotate ? { x: "0" } : { x: "100%" }}
      transition={{ x: { duration: 0.4 } }}
      className="fixed z-20 flex h-screen w-full duration-300 md:hidden"
    >
      <div
        onClick={closeMenu}
        className="bg-MobileNavColor/30 h-full w-1/4 backdrop-blur-sm hover:cursor-pointer"
      />
      <div
        className="font-body flex h-full w-3/4 flex-col
                items-center justify-center space-y-8 bg-MobileNavBarColor"
      >
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => handleScroll(e, item.href)}
            className="flex flex-col space-y-2 text-center"
          >
            <span className="font-tech text-xs text-AAsecondary">
              {item.id}.
            </span>
            <span
              className="font-heading text-sm text-white duration-300
                            hover:cursor-pointer hover:text-AAsecondary sm:text-base"
            >
              {item.name}
            </span>
          </a>
        ))}
        <a
          href="/cv/CV_Artem_Polovyi_EN.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="rounded border border-AAsecondary px-5
                        py-2 font-heading text-xs text-AAsecondary hover:bg-ResumeButtonHover sm:px-10 sm:py-4"
          >
            Resume
          </button>
        </a>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
