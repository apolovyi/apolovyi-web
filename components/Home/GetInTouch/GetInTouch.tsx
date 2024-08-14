import React from "react";
import ArrowIcon from "../../Icons/ArrowIcon";

export default function GetInTouch() {
    return (
        <div
            id="GetInTouchSection"
            data-aos="fade-up"
            className="flex flex-col space-y-8 w-full min-h-screen items-center justify-center bg-AAprimary px-4 sm:px-8 py-24"
        >
            <div className="flex flex-col items-center space-y-6 max-w-2xl">
                {/* Section Number and Title */}
                <div className="flex items-center space-x-2">
                    <ArrowIcon className="h-5 w-5 text-AAsecondary"/>
                    <span className="text-AAsecondary font-mono text-sm sm:text-base">04.</span>
                    <h2 className="font-sans text-gray-200 text-xl sm:text-2xl font-semibold">What&apos;s Next?</h2>
                </div>

                {/* Main Heading */}
                <h1 className="text-gray-200 text-4xl sm:text-5xl font-bold tracking-wide text-center">Let&apos;s
                    Connect</h1>

                {/* Description */}
                <p className="font-sans text-gray-400 text-center text-lg leading-relaxed">
                    I&apos;m always excited about new opportunities and collaborations. Whether you have a project in
                    mind, a
                    question about my work, or just want to say hello, I&apos;d love to hear from you. Let&apos;s start
                    a
                    conversation and explore how we can create something amazing together!
                </p>

                {/* Call-to-Action Button */}
                <a
                    href="mailto:info@apolovyi.me"
                    className="mt-6 inline-block font-mono text-AAsecondary border-AAsecondary
                 px-8 py-4 border-2 rounded-md
                 transition-all duration-300 ease-in-out
                 hover:bg-AAsecondary hover:bg-opacity-10
                 focus:outline-none focus:ring-2 focus:ring-AAsecondary focus:ring-opacity-50"
                >
                    Reach Out
                </a>

                <a href="mailto:max.muster@domain.de?subject=Hier%20steht%20der%20Betreff">E-Mail mit Betreff</a>
            </div>
        </div>
    );
}
