import React, { memo } from "react";
import { motion } from "framer-motion";

interface LineProps {
  id: string;
  rotate: number;
  x?: number;
  y: number;
}

const Line = memo(function Line({ rotate, x = 0, y }: Omit<LineProps, "id">) {
  return <motion.div animate={{ rotate, x, y }} className="h-1 w-6 rounded bg-accent-coral" />;
});

const lineConfigs: LineProps[] = [
  { id: "top-left", rotate: -30, y: 5 },
  { id: "middle-left", rotate: 90, x: -10, y: 18 },
  { id: "bottom-left", rotate: 30, y: 31 },
  { id: "bottom-right", rotate: -30, y: 27, x: 19 },
  { id: "top-right", rotate: 30, x: 19, y: -10 },
  { id: "middle-right", rotate: 90, x: 28, y: 2 },
];

function Logo() {
  return (
    <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative h-12 w-10">
      <motion.span
        initial={{ x: 1 }}
        className="absolute flex h-full w-full items-center justify-center font-heading text-lg text-accent-coral"
      >
        AP
      </motion.span>

      {lineConfigs.map(({ id, ...config }) => (
        <Line key={id} {...config} />
      ))}
    </motion.div>
  );
}

export default memo(Logo);
