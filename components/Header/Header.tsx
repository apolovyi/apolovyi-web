import React, {useContext, useEffect, useRef, useState} from "react";
import Logo from "./Headercomp/Logo";
import DesktopMenu from "./Headercomp/DesktopMenu";
import IconMenu from "./Headercomp/IconMenu";
import MobileMenu from "./Headercomp/MobileMenu";
import {motion} from "framer-motion";
import AppContext from "../AppContextFolder/AppContext";

const Header = (props: { finishedLoading: boolean }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    const RefNavBar = useRef<HTMLDivElement>(null);
    const [showElement, setShowElement] = useState(true);
    const [rotate, setRotate] = useState<boolean>(false);
    const context = useContext(AppContext);
    const scrollSizeY = useRef<number>(0);

    // Define the EventListener for the NavBar
    useEffect(() => {
        if (context.sharedState.portfolio.NavBar.IntervalEvent == null) {
            context.sharedState.portfolio.NavBar.IntervalEvent = () => {
                if (scrollSizeY.current == 0) {
                    scrollSizeY.current = window.scrollY;
                } else {
                    if (window.scrollY > 50) {
                        if (window.scrollY > scrollSizeY.current) {
                            if (RefNavBar) {
                                RefNavBar.current?.classList.remove("translate-y-0");
                                RefNavBar.current?.classList.add("-translate-y-full");
                            }
                        } else {
                            RefNavBar.current?.classList.add("translate-y-0");
                            RefNavBar.current?.classList.remove("-translate-y-full");
                        }
                        scrollSizeY.current = window.scrollY;
                    }
                }
            }
        }
    }, [context.sharedState.portfolio.NavBar, context.sharedState.portfolio.NavBar.IntervalEvent]);

    //Adding the EventListener for the NavBar
    useEffect(() => {
        if (context.sharedState.portfolio.NavBar.scrolling == null) {
            context.sharedState.portfolio.NavBar.scrolling = true;
            scrollSizeY.current = 0;
            //Hide when scroll down & show when scroll up
            if (typeof window !== "undefined") {
                window.addEventListener("scroll", context.sharedState.portfolio.NavBar.IntervalEvent);
            }
        }
    }, [context.sharedState.portfolio.NavBar, context.sharedState.portfolio.NavBar.scrolling]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    //verify document for serverSide rendering
    if (typeof document !== "undefined") {
        rotate ? (document.body.style.overflow = "hidden") : (document.body.style.overflow = "auto");
    }

    return (
        <>
            <MobileMenu rotate={rotate} setRotate={setRotate} setShowElement={setShowElement}
                        showElement={showElement}/>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{opacity: {delay: props.finishedLoading ? 0 : 4.9, duration: 0}}}
                className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          flex justify-between px-6 sm:px-12 py-2 sm:py-4
          ${isScrolled ? 'shadow-lg backdrop-blur-sm' : ''}
          ${showElement
                    ? 'bg-AAprimary bg-opacity-70'
                    : isScrolled
                        ? 'bg-AAprimary bg-opacity-50'
                        : 'bg-transparent'
                }
        `}
            >
                <Logo finishedLoading={props.finishedLoading}/>

                <IconMenu
                    rotate={rotate}
                    setRotate={setRotate}
                    setShowElement={setShowElement}
                    showElement={showElement}
                    finishedLoading={props.finishedLoading}
                />

                <DesktopMenu finishedLoading={props.finishedLoading}/>
            </motion.div>
        </>
    );
};
export default Header;
