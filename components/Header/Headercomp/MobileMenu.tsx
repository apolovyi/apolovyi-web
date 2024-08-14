import {motion} from "../../../node_modules/framer-motion/dist/framer-motion";
import {useCallback} from "react";

interface MobileMenuProps {
    rotate: boolean;
    setRotate: React.Dispatch<React.SetStateAction<boolean>>;
    showElement: boolean;
    setShowElement: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu = ({rotate, setRotate, showElement, setShowElement}: MobileMenuProps) => {
    const closeMenu = () => {
        setRotate(!rotate);
        setShowElement(!showElement);
    };

    const handleScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
            const yOffset = -100; // Adjust this value based on your header height
            const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
        closeMenu();
    }, [closeMenu]);

    const menuItems = [
        {id: '01', name: 'About', href: '#aboutSection'},
        {id: '02', name: 'Experience', href: '#WhereIHaveWorkedSection'},
        {id: '03', name: 'Work', href: '#SomethingIveBuiltSection'},
        {id: '04', name: 'Contact', href: '#GetInTouchSection'},
    ];

    return (
        <motion.div
            initial={{x: "100%"}}
            animate={rotate ? {x: "0"} : {x: "100%"}}
            transition={{x: {duration: 0.4}}}
            className="w-full fixed h-screen flex md:hidden duration-300 z-20"
        >
            <div
                onClick={closeMenu}
                className="w-1/4 h-full backdrop-blur-sm bg-MobileNavColor/30 hover:cursor-pointer"
            ></div>
            <div
                className="w-3/4 h-full bg-MobileNavBarColor flex flex-col
        justify-center items-center space-y-8 font-sans"
            >
                {menuItems.map((item) => (
                    <a
                        key={item.id}
                        href={item.href}
                        onClick={(e) => handleScroll(e, item.href)}
                        className="flex flex-col text-center space-y-2"
                    >
                        <span className="text-AAsecondary text-xs font-mono">{item.id}.</span>
                        <span
                            className="text-white font-Text2 text-sm sm:text-base
               hover:text-AAsecondary hover:cursor-pointer duration-300"
                        >
              {item.name}
            </span>
                    </a>
                ))}
                <a href="/cv/CV_Artem_Polovyi_EN.pdf" target="_blank" rel="noopener noreferrer">
                    <button
                        className="rounded border font-Text2 border-AAsecondary
             hover:bg-ResumeButtonHover py-2 sm:py-4 px-5 sm:px-10 text-xs text-AAsecondary"
                    >
                        Resume
                    </button>
                </a>
            </div>
        </motion.div>
    );
};

export default MobileMenu;
