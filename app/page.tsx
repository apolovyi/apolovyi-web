"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "./shared/AppContext";
import Aos from "aos";
import "aos/dist/aos.css";

import Header from "components/Header/Header";
import Startup from "components/Header/StartupLogo/Startup";
import MyName from "components/Home/MyName/MyName";
import SocialMediaAround from "components/Home/SocialMediaAround/SocialMediaAround";
import AboutMe from "components/Home/AboutMe/AboutMe";
import WhereIHaveWorked from "components/Home/WhereIHaveWorked/WhereIHaveWorked";
import SomethingIveBuilt from "components/Home/SomethingIveBuilt/SomethingIveBuilt";
import GetInTouch from "components/Home/GetInTouch/GetInTouch";
import Footer from "components/Footer/Footer";
import ScreenSizeDetector from "components/CustomComponents/ScreenSizeDetector";

const Home = () => {
  const [showElement, setShowElement] = useState(true);
  const { sharedState, setSharedState } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowElement(false);
      setSharedState((prevState) => ({
        ...prevState,
        finishedLoading: true,
      }));
    }, 4940);

    return () => clearTimeout(timer);
  }, [setSharedState]);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const isProd = process.env.NODE_ENV === "production";

  return (
    <main className="relative min-h-screen w-full snap-mandatory bg-AAprimary">
      {!sharedState.finishedLoading && showElement && <Startup />}
      <Header finishedLoading={sharedState.finishedLoading} />
      <MyName finishedLoading={sharedState.finishedLoading} />
      <SocialMediaAround finishedLoading={sharedState.finishedLoading} />
      {sharedState.finishedLoading && (
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
};

export default Home;
