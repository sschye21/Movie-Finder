import React from "react";
import { motion } from "framer-motion";

const loadingContainer = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Loading = () => {
  return (
    <>
      <div className="fixed  w-full min-h-screen z-50 bg-black opacity-30" />
      <div className="flex fixed w-full justify-center items-center h-screen">
        <motion.div
          className="flex justify-around w-16 h-16"
          variants={loadingContainer}
          initial="start"
          animate="end"
        >
          {[...Array(3)].map((e, i) => 
            <motion.span
                className="block h-4 w-4 rounded-lg bg-blue-500"
                variants={{ start: { y: "0%" }, end: { y: "55%" } }}
                transition={{duration: 0.4, yoyo: Infinity, ease: 'easeInOut'}}
                key={i}
          />
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Loading;