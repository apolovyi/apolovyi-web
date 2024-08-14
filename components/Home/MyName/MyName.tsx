import React from "react";
import {motion} from "framer-motion";

export default function MyName(props: { finishedLoading: boolean }) {
    return (
        <div
            className="h-full flex flex-col justify-center
      px-8 2xl:px-72 xl:px-56 lg:px-32  md:px-28 sm:px-8 py-32 sm:py-52  "
        >
            <motion.span
                initial={{y: 10, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{
                    opacity: {delay: props.finishedLoading ? 0 : 6.4, duration: props.finishedLoading ? 0 : 0.2},
                    y: {delay: props.finishedLoading ? 0 : 6.4, duration: props.finishedLoading ? 0 : 0.2},
                }}
                className="text-AAsecondary font-mono"
            >
                Hi, my name is
            </motion.span>
            <motion.h1
                initial={{y: 10, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{
                    opacity: {delay: props.finishedLoading ? 0 : 6.5, duration: props.finishedLoading ? 0 : 0.2},
                    y: {delay: props.finishedLoading ? 0 : 6.5, duration: props.finishedLoading ? 0 : 0.2},
                }}
                className="text-gray-300 font-bold text-3xl lg:text-7xl sm:text-5xl md:text-6xl mt-4"
            >
                Artem Polovyi.
            </motion.h1>
            <motion.h2
                initial={{y: 10, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{
                    opacity: {delay: props.finishedLoading ? 0 : 6.6, duration: props.finishedLoading ? 0 : 0.2},
                    y: {delay: props.finishedLoading ? 0 : 6.6, duration: props.finishedLoading ? 0 : 0.2},
                }}
                className="text-gray-400 font-bold text-3xl lg:text-7xl sm:text-5xl md:text-6xl mt-4"
            >
                I bring ideas to life.
            </motion.h2>

            <motion.h3
                initial={{y: 10, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{
                    opacity: {delay: props.finishedLoading ? 0 : 6.7, duration: props.finishedLoading ? 0 : 0.2},
                    y: {delay: props.finishedLoading ? 0 : 6.7, duration: props.finishedLoading ? 0 : 0.2},
                }}
                className="text-gray-400 font-Header text-sm md:text-lg sm:text-md mt-10 tracking-wider"
            >
                As a <span className="text-AAsecondary">full-stack software engineer </span>
                with strong problem-solving skills, I specialize in creating exceptional digital experiences.
                <br/>
                Currently, I am passionate about creating
                <span className="text-AAsecondary"> robust solutions</span>, exploring
                <span className="text-AAsecondary"> innovative technologies</span>, and driving
                <span className="text-AAsecondary"> digital transformation</span>.
            </motion.h3>

            <motion.div
                initial={{y: 10, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{
                    opacity: {delay: props.finishedLoading ? 0 : 6.8, duration: props.finishedLoading ? 0 : 0.2},
                    y: {delay: props.finishedLoading ? 0 : 6.8, duration: props.finishedLoading ? 0 : 0.2},
                }}
                className="mt-12"
            >
                <a href={"/cv/CV_Artem_Polovyi_EN.pdf"} target={"_blank"} rel="noreferrer">
                    <button
                        className="bg-AAprimary text-AAsecondary border rounded px-4 sm:px-8 py-3 sm:py-4 border-AAsecondary">
                        Check out my resume!
                    </button>
                </a>
            </motion.div>
        </div>
    );
}
