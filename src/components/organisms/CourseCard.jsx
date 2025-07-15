import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/atoms/ProgressBar";
import GradeDisplay from "@/components/molecules/GradeDisplay";
import { cn } from "@/utils/cn";

const CourseCard = ({ course, delay = 0, onClick }) => {
  const getProgressColor = (progress) => {
    if (progress >= 90) return "success";
    if (progress >= 70) return "primary";
    if (progress >= 50) return "warning";
    return "error";
  };

  const formatNextDeadline = (deadline) => {
    if (!deadline) return "No upcoming deadlines";
    const date = new Date(deadline);
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  };

  const getDeadlineColor = (deadline) => {
    if (!deadline) return "text-gray-500";
    const date = new Date(deadline);
    const now = new Date();
    const diff = date - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "text-error";
    if (days <= 1) return "text-warning";
    if (days <= 7) return "text-primary";
    return "text-success";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="card p-6 hover-lift cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {course.instructor}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="BookOpen" className="w-4 h-4" />
            <span>{course.credits} credits</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <GradeDisplay grade={course.grade} letterGrade={course.letterGrade} />
        </div>
      </div>

      <div className="space-y-3">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{course.progress}%</span>
          </div>
          <ProgressBar
            value={course.progress}
            color={getProgressColor(course.progress)}
            size="md"
          />
        </div>

        {/* Next Deadline */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Next deadline</span>
          </div>
          <span className={cn("text-sm font-medium", getDeadlineColor(course.nextDeadline))}>
            {formatNextDeadline(course.nextDeadline)}
          </span>
        </div>

        {/* Assignments Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="FileText" className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Assignments</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-success">
              {course.completedAssignments}
            </span>
            <span className="text-sm text-gray-500">/</span>
            <span className="text-sm font-medium text-gray-700">
              {course.totalAssignments}
            </span>
          </div>
        </div>
      </div>

      {/* Course Code */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {course.courseCode}
        </span>
      </div>
    </motion.div>
  );
};

export default CourseCard;