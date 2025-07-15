import { motion } from "framer-motion";

const Loading = ({ type = "dashboard" }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (type === "dashboard") {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header Skeleton */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-10 w-32"></div>
        </motion.div>

        {/* Stats Cards Skeleton */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-20 mb-2"></div>
              <div className="skeleton h-8 w-16 mb-1"></div>
              <div className="skeleton h-3 w-24"></div>
            </div>
          ))}
        </motion.div>

        {/* Course Cards Skeleton */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-6 w-32 mb-4"></div>
              <div className="skeleton h-4 w-24 mb-3"></div>
              <div className="skeleton h-2 w-full mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="skeleton h-4 w-16"></div>
                <div className="skeleton h-6 w-8"></div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Chart Skeleton */}
        <motion.div variants={item} className="card p-6">
          <div className="skeleton h-6 w-48 mb-6"></div>
          <div className="skeleton h-64 w-full"></div>
        </motion.div>
      </motion.div>
    );
  }

  if (type === "table") {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {Array(8).fill(0).map((_, i) => (
          <motion.div
            key={i}
            variants={item}
            className="flex items-center space-x-4 p-4 card"
          >
            <div className="skeleton h-4 w-32"></div>
            <div className="skeleton h-4 w-48"></div>
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-6 w-16"></div>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center p-8"
    >
      <div className="flex items-center space-x-2">
        <div className="skeleton h-4 w-4 rounded-full animate-pulse"></div>
        <div className="skeleton h-4 w-4 rounded-full animate-pulse animate-delay-100"></div>
        <div className="skeleton h-4 w-4 rounded-full animate-pulse animate-delay-200"></div>
      </div>
    </motion.div>
  );
};

export default Loading;