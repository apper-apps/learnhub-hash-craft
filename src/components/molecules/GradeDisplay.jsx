import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const GradeDisplay = ({ grade, letterGrade, className = "" }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "primary";
    if (grade >= 70) return "warning";
    return "error";
  };

  const getGradeVariant = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "primary";
    if (grade >= 70) return "warning";
    return "error";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex items-center space-x-2", className)}
    >
      <span className={cn(
        "text-lg font-bold number-counter",
        grade >= 90 ? "text-success" : 
        grade >= 80 ? "text-primary" : 
        grade >= 70 ? "text-warning" : "text-error"
      )}>
        {grade}%
      </span>
      {letterGrade && (
        <Badge variant={getGradeVariant(grade)} size="sm">
          {letterGrade}
        </Badge>
      )}
    </motion.div>
  );
};

export default GradeDisplay;