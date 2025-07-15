import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import GradeDisplay from "@/components/molecules/GradeDisplay";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const AssignmentTable = ({ assignments, onSort, sortBy, sortOrder }) => {
  const getSortIcon = (column) => {
    if (sortBy !== column) return "ArrowUpDown";
    return sortOrder === "asc" ? "ArrowUp" : "ArrowDown";
  };

  const formatDueDate = (date) => {
    const assignmentDate = new Date(date);
    const now = new Date();
    const diff = assignmentDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return { text: format(assignmentDate, "MMM d"), color: "text-error" };
    if (days === 0) return { text: "Today", color: "text-warning" };
    if (days === 1) return { text: "Tomorrow", color: "text-warning" };
    if (days <= 7) return { text: format(assignmentDate, "MMM d"), color: "text-primary" };
    return { text: format(assignmentDate, "MMM d"), color: "text-gray-600" };
  };

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

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("title")}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Assignment</span>
                  <ApperIcon name={getSortIcon("title")} className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("courseTitle")}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Course</span>
                  <ApperIcon name={getSortIcon("courseTitle")} className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("status")}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Status</span>
                  <ApperIcon name={getSortIcon("status")} className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("dueDate")}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Due Date</span>
                  <ApperIcon name={getSortIcon("dueDate")} className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => onSort("grade")}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                >
                  <span>Grade</span>
                  <ApperIcon name={getSortIcon("grade")} className="w-3 h-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </span>
              </th>
            </tr>
          </thead>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-white divide-y divide-gray-200"
          >
            {assignments.map((assignment) => {
              const dueDate = formatDueDate(assignment.dueDate);
              return (
                <motion.tr
                  key={assignment.Id}
                  variants={item}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ApperIcon name="FileText" className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.type || "Assignment"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.courseTitle}</div>
                    <div className="text-sm text-gray-500">{assignment.courseCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator status={assignment.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn("text-sm font-medium", dueDate.color)}>
                      {dueDate.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {assignment.grade ? (
                      <GradeDisplay grade={assignment.grade} letterGrade={assignment.letterGrade} />
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {assignment.weight}%
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentTable;