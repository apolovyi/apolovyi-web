import React from "react";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <>
      <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className=" relative h-12 w-10 ">
        <motion.span
          initial={{ x: 1 }}
          className="absolute flex h-full w-full items-center justify-center font-heading text-lg text-secondary"
        >
          AP
        </motion.span>

        <motion.div animate={{ rotate: -30, y: 5 }} className="h-1 w-6 rounded bg-secondary"></motion.div>
        <motion.div animate={{ rotate: 90, x: -10, y: 18 }} className="h-1 w-6 rounded bg-secondary"></motion.div>
        <motion.div animate={{ rotate: 30, y: 31 }} className="h-1 w-6 rounded bg-secondary"></motion.div>
        <motion.div animate={{ rotate: -30, y: 27, x: 19 }} className="h-1 w-6 rounded bg-secondary"></motion.div>
        <motion.div animate={{ rotate: 30, x: 19, y: -10 }} className="h-1 w-6 rounded bg-secondary"></motion.div>
        <motion.div animate={{ rotate: 90, x: 28, y: 2 }} className="h-1 w-6 rounded bg-secondary"></motion.div>
      </motion.div>
    </>
  );
}
