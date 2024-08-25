"use client";

import {useEffect} from "react";

import {Locale} from "@/i18n-config";
import Aos from "aos";
import "aos/dist/aos.css";
import {useAppContext} from "@/components/shared/AppContext";
import Header from "@/components/header/Header";
import HeroSection from "@/components/home/HeroSection";
import SocialMediaAround from "@/components/home/SocialMediaAround";
import AboutMe from "@/components/home/AboutMe";
import MyExperience from "@/components/home/MyExperience";
import MyProjects from "@/components/home/MyProjects";
import GetInTouch from "@/components/home/GetInTouch";
import Footer from "@/components/footer/Footer";

// // Lazy load all components
// const Header = lazy(() => import("@/components/header/Header"));
// const HeroSection = lazy(() => import("@/components/home/HeroSection"));
// const SocialMediaAround = lazy(() => import("@/components/home/SocialMediaAround"));
// const AboutMe = lazy(() => import("@/components/home/AboutMe"));
// const MyExperience = lazy(() => import("@/components/home/MyExperience"));
// const MyProjects = lazy(() => import("@/components/home/MyProjects"));
// const GetInTouch = lazy(() => import("@/components/home/GetInTouch"));
// const Footer = lazy(() => import("@/components/footer/Footer"));

function Home({params: {lang = "en"}}: { params: { lang?: Locale } }) {
	const {sharedState, setSharedState} = useAppContext();

	useEffect(() => {
		const timer = setTimeout(() => {
			setSharedState((prevState) => ({...prevState, finishedLoading: true}));
		}, 4940);

		return () => clearTimeout(timer);
	}, [setSharedState]);

	useEffect(() => {
		Aos.init({duration: 1000, once: true});
	}, []);

	return (
		<main className="relative w-full snap-mandatory bg-background-primary">
			{/*<Suspense fallback={<LoadingSpinner />}>*/}
			<Header finishedLoading={sharedState.finishedLoading} lang={lang}/>
			<HeroSection finishedLoading={sharedState.finishedLoading} lang={lang}/>
			<SocialMediaAround finishedLoading={sharedState.finishedLoading}/>
			{sharedState.finishedLoading && (
				<>
					<AboutMe lang={lang}/>
					<MyExperience lang={lang}/>
					<MyProjects lang={lang}/>
					<GetInTouch lang={lang}/>
					<Footer lang={lang}/>
				</>
			)}
			{/*</Suspense>*/}
		</main>
	);
}

export default Home;
