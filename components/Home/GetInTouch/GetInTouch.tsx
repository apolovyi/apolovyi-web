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

                <form name="contact" method="POST" data-netlify="true">
                    <p>
                        <label>Your Name: <input type="text" name="name" /></label>
                    </p>
                    <p>
                        <label>Your Email: <input type="email" name="email" /></label>
                    </p>
                    <p>
                        <label>Message: <textarea name="message"></textarea></label>
                    </p>
                    <p>
                        <button type="submit">Send</button>
                    </p>
                </form>

                {/*/!* Netlify Form *!/*/}
                {/*<form*/}
                {/*    name="contact"*/}
                {/*    method="POST"*/}
                {/*    data-netlify="true"*/}
                {/*    className="w-full max-w-md"*/}
                {/*>*/}
                {/*    <input type="hidden" name="form-name" value="contact"/>*/}
                {/*    <div className="mb-4">*/}
                {/*        <label htmlFor="name" className="block text-gray-400 font-mono text-sm mb-2">Name</label>*/}
                {/*        <input*/}
                {/*            type="text"*/}
                {/*            name="name"*/}
                {/*            id="name"*/}
                {/*            required*/}
                {/*            className="w-full bg-transparent border border-gray-700 rounded-md px-4 py-2 text-gray-300 focus:outline-none focus:border-AAsecondary"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className="mb-4">*/}
                {/*        <label htmlFor="email" className="block text-gray-400 font-mono text-sm mb-2">Email</label>*/}
                {/*        <input*/}
                {/*            type="email"*/}
                {/*            name="email"*/}
                {/*            id="email"*/}
                {/*            required*/}
                {/*            className="w-full bg-transparent border border-gray-700 rounded-md px-4 py-2 text-gray-300 focus:outline-none focus:border-AAsecondary"*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*    <div className="mb-4">*/}
                {/*        <label htmlFor="message" className="block text-gray-400 font-mono text-sm mb-2">Message</label>*/}
                {/*        <textarea*/}
                {/*            name="message"*/}
                {/*            id="message"*/}
                {/*            required*/}
                {/*            rows={4}*/}
                {/*            className="w-full bg-transparent border border-gray-700 rounded-md px-4 py-2 text-gray-300 focus:outline-none focus:border-AAsecondary"*/}
                {/*        ></textarea>*/}
                {/*    </div>*/}
                {/*    <div className="flex justify-center">*/}
                {/*        <button*/}
                {/*            type="submit"*/}
                {/*            className="font-mono text-sm text-AAsecondary border-AAsecondary*/}
                {/*                       px-6 py-2 border-2 rounded-md*/}
                {/*                       transition-all duration-300 ease-in-out*/}
                {/*                       hover:bg-AAsecondary hover:bg-opacity-10*/}
                {/*                       focus:outline-none focus:ring-2 focus:ring-AAsecondary focus:ring-opacity-50"*/}
                {/*        >*/}
                {/*            Send Message*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</form>*/}
            </div>
        </div>
    );
}
