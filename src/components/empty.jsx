import React from "react";

function empty() {
  return (
    <>
      {" "}
      <div
        ref={ref}
        className="w-full bg-[#d58936] py-16 flex flex-col md:flex-row items-center justify-around px-6 md:px-16 space-y-6 md:space-y-0 md:space-x-6 mt-20 rounded-2xl"
      >
        {/* Experience */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center w-full md:w-1/4"
        >
          <h2 className="text-4xl font-bold text-[#d58936]">
            {inView && <CountUp end={10} duration={2} />}+
          </h2>
          <p className="text-gray-600 mt-2">Years of Excellence</p>
        </motion.div>

        {/* Happy Customers */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center w-full md:w-1/4"
        >
          <h2 className="text-4xl font-bold text-[#d58936]">
            {inView && <CountUp end={300} duration={2} />}+
          </h2>
          <p className="text-gray-600 mt-2">Happy Clients</p>
        </motion.div>

        {/* Events Completed */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center w-full md:w-1/4"
        >
          <h2 className="text-4xl font-bold text-[#d58936]">
            {inView && <CountUp end={80} duration={2} />}+
          </h2>
          <p className="text-gray-600 mt-2">Events Completed</p>
        </motion.div>
      </div>
    </>
  );
}

export default empty;
