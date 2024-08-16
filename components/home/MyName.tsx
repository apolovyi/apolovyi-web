import React from "react";
import { motion } from "framer-motion";

export default function MyName(props: { finishedLoading: boolean }) {
  return (
    <div
      className="flex h-full flex-col justify-center px-8
      py-32 sm:px-8 sm:py-52  md:px-28 lg:px-32 xl:px-56 2xl:px-72  "
    >
      <motion.span
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          opacity: {
            delay: props.finishedLoading ? 0 : 6.4,
            duration: props.finishedLoading ? 0 : 0.2,
          },
          y: {
            delay: props.finishedLoading ? 0 : 6.4,
            duration: props.finishedLoading ? 0 : 0.2,
          },
        }}
        className="font-tech tracking-wider text-AAsecondary"
      >
        Hi, my name is
      </motion.span>
      <motion.h1
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          opacity: {
            delay: props.finishedLoading ? 0 : 6.5,
            duration: props.finishedLoading ? 0 : 0.2,
          },
          y: {
            delay: props.finishedLoading ? 0 : 6.5,
            duration: props.finishedLoading ? 0 : 0.2,
          },
        }}
        className="mt-4 font-heading text-3xl font-bold text-gray-300 sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Artem Polovyi.
      </motion.h1>
      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          opacity: {
            delay: props.finishedLoading ? 0 : 6.6,
            duration: props.finishedLoading ? 0 : 0.2,
          },
          y: {
            delay: props.finishedLoading ? 0 : 6.6,
            duration: props.finishedLoading ? 0 : 0.2,
          },
        }}
        className="font mt-4 font-sub-heading text-3xl font-light text-gray-400 sm:text-4xl md:text-4xl lg:text-6xl"
      >
        I bring ideas to life.
      </motion.h2>

      <motion.h3
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          opacity: {
            delay: props.finishedLoading ? 0 : 6.7,
            duration: props.finishedLoading ? 0 : 0.2,
          },
          y: {
            delay: props.finishedLoading ? 0 : 6.7,
            duration: props.finishedLoading ? 0 : 0.2,
          },
        }}
        className="sm:text-md mt-10 font-body text-sm tracking-wider text-gray-400 md:text-lg"
      >
        As a <span className="text-AAsecondary">full-stack software engineer </span>
        with strong problem-solving skills, I specialize in creating exceptional digital experiences.
        <br />
        Currently, I am passionate about creating
        <span className="text-AAsecondary"> robust solutions</span>, exploring
        <span className="text-AAsecondary"> innovative technologies</span>, and driving
        <span className="text-AAsecondary"> digital transformation</span>.
      </motion.h3>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          opacity: {
            delay: props.finishedLoading ? 0 : 6.8,
            duration: props.finishedLoading ? 0 : 0.2,
          },
          y: {
            delay: props.finishedLoading ? 0 : 6.8,
            duration: props.finishedLoading ? 0 : 0.2,
          },
        }}
        className="mt-12"
      >
        <a href={"/cv/CV_Artem_Polovyi_EN_WEB.pdf"} target={"_blank"} rel="noreferrer">
          <button className="rounded border border-AAsecondary bg-AAprimary px-4 py-3 font-heading text-AAsecondary sm:px-8 sm:py-4">
            Check out my resume!
          </button>
        </a>
      </motion.div>
    </div>
  );
}
