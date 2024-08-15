"use client";

import { useContext, useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Header from "../components/Header/Header";
import Startup from "../components/Header/StartupLogo/Startup";
import MyName from "../components/Home/MyName/MyName";
import SocialMediaAround from "../components/Home/SocialMediaAround/SocialMediaAround";
import AboutMe from "../components/Home/AboutMe/AboutMe";
import WhereIHaveWorked from "../components/Home/WhereIHaveWorked/WhereIHaveWorked";
import SomethingIveBuilt from "../components/Home/SomethingIveBuilt/SomethingIveBuilt";
import GetInTouch from "../components/Home/GetInTouch/GetInTouch";
import Footer from "../components/Footer/Footer";
import AppContext from "../components/AppContextFolder/AppContext";
import ScreenSizeDetector from "../components/CustomComponents/ScreenSizeDetector";

export default function Home() {
  const [showElement, setShowElement] = useState(true);
  const context = useContext(AppContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowElement(false);
      context?.setSharedState((prevState) => ({
        ...prevState,
        finishedLoading: true,
      }));
    }, 4940);

    return () => clearTimeout(timer);
  }, [context]);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const isProd = process.env.NODE_ENV === "production";

  return (
    <main className="relative min-h-screen w-full snap-mandatory bg-AAprimary">
      {!context?.sharedState.finishedLoading && showElement && <Startup />}
      <Header finishedLoading={context?.sharedState.finishedLoading || false} />
      <MyName finishedLoading={context?.sharedState.finishedLoading || false} />
      <SocialMediaAround
        finishedLoading={context?.sharedState.finishedLoading || false}
      />
      {context?.sharedState.finishedLoading && (
        <>
          <AboutMe />
          <WhereIHaveWorked />
          <SomethingIveBuilt />
          <GetInTouch />
          <Footer hideSocialsInDesktop={true} />
        </>
      )}
      {!isProd && <ScreenSizeDetector />}
    </main>
  );
}
