import React from "react";
import { motion } from "framer-motion";

const IconMenu = (props: { rotate; setRotate; setShowElement; showElement; finishedLoading }) => {
  return (
    <div
      className="left-0  mt-2 space-y-2 text-white hover:cursor-pointer md:hidden"
      onClick={() => {
        props.setRotate(!props.rotate);
        props.setShowElement(!props.showElement);
      }}
    >
      <div className="flex justify-end">
        <motion.div
          animate={props.rotate ? { y: 10, rotate: 45 } : { rotate: 0, y: 0 }}
          transition={
            props.rotate ? { y: 0.15, rotate: { delay: 0.2 } } : { y: { delay: 0.2 }, rotate: { duration: 0.2 } }
          }
          className="h-0.5 w-8 rounded bg-AAsecondary"
        ></motion.div>
      </div>
      <motion.div
        animate={props.rotate ? { opacity: 0 } : { opacity: 1 }}
        transition={{ opacity: { duration: 0 } }}
        className="flex justify-end"
      >
        <div className="h-0.5 w-6 rounded bg-AAsecondary"></div>
      </motion.div>
      <div className="flex justify-end">
        <motion.div
          animate={props.rotate ? { y: -10, width: "150%", rotate: -45 } : { y: 0, rotate: 0, width: "50%" }}
          transition={
            props.rotate ? { y: 0.15, rotate: { delay: 0.2 } } : { y: { delay: 0.2 }, rotate: { duration: 0.2 } }
          }
          className="h-0.5 w-4 rounded bg-AAsecondary"
        ></motion.div>
      </div>
    </div>
  );
};
export default IconMenu;
