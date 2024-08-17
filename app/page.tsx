"use client";

import { useEffect, useState } from "react";
import { useAppContext } from "@/components/shared/AppContext";
import Aos from "aos";
import "aos/dist/aos.css";

import Header from "@/components/header/Header";
import Startup from "@/components/header/startup/Startup";
import HeroSection from "@/components/home/HeroSection";
import SocialMediaAround from "@/components/home/SocialMediaAround";
import AboutMe from "@/components/home/AboutMe";
import MyExperience from "@/components/home/MyExperience";
import MyProjects from "@/components/home/MyProjects";
import GetInTouch from "@/components/home/GetInTouch";
import Footer from "@/components/footer/Footer";
import ScreenSizeDetector from "@/components/dev/ScreenSizeDetector";
import { Locale } from "@/i18n-config";

function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const [showElement, setShowElement] = useState(true);
  const { sharedState, setSharedState } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowElement(false);
      setSharedState((prevState) => ({ ...prevState, finishedLoading: true }));
    }, 4940);

    return () => clearTimeout(timer);
  }, [setSharedState]);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  const isProd = process.env.NODE_ENV === "production";

  return (
    <main className="relative min-h-screen w-full snap-mandatory bg-background-primary">
      {!sharedState.finishedLoading && showElement && <Startup />}
      <Header finishedLoading={sharedState.finishedLoading} />
      <HeroSection finishedLoading={sharedState.finishedLoading} lang={lang} />
      <SocialMediaAround finishedLoading={sharedState.finishedLoading} />
      {sharedState.finishedLoading && (
        <>
          <AboutMe lang={lang} />
          <MyExperience lang={lang} />
          <MyProjects lang={lang} />
          <GetInTouch />
          <Footer />
        </>
      )}
      {!isProd && <ScreenSizeDetector />}
    </main>
  );
}

export default Home;
