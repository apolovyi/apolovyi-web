"use client";

import { lazy, Suspense, useEffect } from "react";
import { useAppContext } from "@/components/shared/AppContext";
import Aos from "aos";
import "aos/dist/aos.css";
import { Locale } from "@/i18n-config";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Lazy load all components
const Header = lazy(() => import("@/components/header/Header"));
const HeroSection = lazy(() => import("@/components/home/HeroSection"));
const SocialMediaAround = lazy(() => import("@/components/home/SocialMediaAround"));
const AboutMe = lazy(() => import("@/components/home/AboutMe"));
const MyExperience = lazy(() => import("@/components/home/MyExperience"));
const MyProjects = lazy(() => import("@/components/home/MyProjects"));
const GetInTouch = lazy(() => import("@/components/home/GetInTouch"));
const Footer = lazy(() => import("@/components/footer/Footer"));

function Home({ params: { lang = "en" } }: { params: { lang?: Locale } }) {
  const { sharedState, setSharedState } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSharedState((prevState) => ({ ...prevState, finishedLoading: true }));
    }, 4940);

    return () => clearTimeout(timer);
  }, [setSharedState]);

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  return (
    <main className="relative w-full snap-mandatory bg-background-primary">
      <Suspense fallback={<LoadingSpinner />}>
        <Header finishedLoading={sharedState.finishedLoading} lang={lang} />
        <HeroSection finishedLoading={sharedState.finishedLoading} lang={lang} />
        <SocialMediaAround finishedLoading={sharedState.finishedLoading} />
        {sharedState.finishedLoading && (
          <>
            <AboutMe lang={lang} />
            <MyExperience lang={lang} />
            <MyProjects lang={lang} />
            <GetInTouch lang={lang} />
            <Footer lang={lang} />
          </>
        )}
      </Suspense>
    </main>
  );
}

export default Home;
