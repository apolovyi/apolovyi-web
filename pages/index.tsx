import Header from "../components/Header/Header";
import Startup from "../components/Header/StartupLogo/Startup";
import MyName from "../components/Home/MyName/MyName";
import {useContext, useEffect, useState} from "react";
import SocialMediaAround from "../components/Home/SocialMediaAround/SocialMediaAround";
import AboutMe from "../components/Home/AboutMe/AboutMe";
import WhereIHaveWorked from "../components/Home/WhereIHaveWorked/WhereIHaveWorked";
import SomethingIveBuilt from "../components/Home/SomethingIveBuilt/SomethingIveBuilt";
import GetInTouch from "../components/Home/GetInTouch/GetInTouch";
import Footer from "../components/Footer/Footer";
import AppContext from "../components/AppContextFolder/AppContext";
import Aos from "aos";
import "aos/dist/aos.css";
import Head from "next/head";
import ScreenSizeDetector from "../components/CustomComponents/ScreenSizeDetector";

export default function Home() {
    const [showElement, setShowElement] = useState(true);
    const context = useContext(AppContext);

    useEffect(() => {
        setTimeout(() => {
            setShowElement(false);
            context.sharedState.finishedLoading = true;
            context.setSharedState(context.sharedState);

        }, 4940);
    }, [context, context.sharedState]);

    useEffect(() => {
        Aos.init({duration: 1000, once: true});
    }, []);

    const meta = {
        title: "Artem Polovyi - Software Engineer",
        description: `I've been working as a full-stack engineer for 6 years straight. Get in touch with me to know more.`,
        image: "/me-circle.jpg",
        type: "website",
    };
    const isProd = process.env.NODE_ENV === "production";

    return (
        <>
            <Head>
                <title>{meta.title}</title>
                <meta name="robots" content="follow, index"/>
                <meta content={meta.description} name="description"/>
                <meta property="og:url" content={`https://apolovyi.me`}/>
                <link rel="canonical" href={`https://apolovyi.me`}/>
                <meta property="og:type" content={meta.type}/>
                <meta property="og:site_name" content="Artem Polovyi"/>
                <meta property="og:description" content={meta.description}/>
                <meta property="og:title" content={meta.title}/>
                <meta property="og:image" content={meta.image}/>
            </Head>

            <div className="relative snap-mandatory min-h-screen bg-AAprimary w-full ">
                {context.sharedState.finishedLoading ? <></> : showElement ? <Startup/> : <></>}
                <Header finishedLoading={context.sharedState.finishedLoading}/>
                <MyName finishedLoading={context.sharedState.finishedLoading}/>
                <SocialMediaAround finishedLoading={context.sharedState.finishedLoading}/>
                {context.sharedState.finishedLoading ? <AboutMe/> : <></>}
                {context.sharedState.finishedLoading ? <WhereIHaveWorked/> : <></>}
                {context.sharedState.finishedLoading ? <SomethingIveBuilt/> : <></>}
                {context.sharedState.finishedLoading ? <GetInTouch/> : <></>}
                {context.sharedState.finishedLoading ? (
                    <Footer hideSocialsInDesktop={true}/>
                ) : (
                    <></>
                )}
                {!isProd && <ScreenSizeDetector/>}
            </div>
        </>
    );
}
