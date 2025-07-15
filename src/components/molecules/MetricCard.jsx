import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className = "",
  delay = 0
}) => {
  const colors = {
    primary: "from-purple-500 to-purple-600",
    secondary: "from-blue-500 to-blue-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    error: "from-red-500 to-red-600"
  };

  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-gray-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={cn("card p-6 hover-lift", className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 number-counter">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"}
                className={cn("w-4 h-4 mr-1", trendColors[trend])}
              />
              <span className={cn("text-sm font-medium", trendColors[trend])}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center", colors[color])}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;