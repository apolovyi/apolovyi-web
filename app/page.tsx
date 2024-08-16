"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/components/shared/AppContext";
import Aos from "aos";
import "aos/dist/aos.css";

import Header from "@/components/header/Header";
import Startup from "@/components/header/startup/Startup";
import MyName from "@/components/home/MyName";
import SocialMediaAround from "@/components/home/SocialMediaAround";
import AboutMe from "@/components/home/AboutMe";
import WhereIveWorked from "@/components/home/WhereIveWorked";
import SomethingIveBuilt from "@/components/home/SomethingIveBuilt";
import GetInTouch from "@/components/home/GetInTouch";
import Footer from "@/components/footer/Footer";
import ScreenSizeDetector from "@/components/dev/ScreenSizeDetector";

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
          <WhereIveWorked />
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
