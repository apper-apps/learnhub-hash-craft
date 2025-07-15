import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const StatusIndicator = ({ status, size = "sm", showIcon = true, className = "" }) => {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "warning",
      icon: "Clock",
      dotClass: "status-pending"
    },
    completed: {
      label: "Completed",
      variant: "success",
      icon: "CheckCircle",
      dotClass: "status-completed"
    },
    overdue: {
      label: "Overdue",
      variant: "error",
      icon: "AlertCircle",
      dotClass: "status-overdue"
    },
    draft: {
      label: "Draft",
      variant: "default",
      icon: "Edit",
      dotClass: "status-draft"
    }
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge variant={config.variant} size={size} className={cn("flex items-center", className)}>
      {showIcon && (
        <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      )}
      <span className={config.dotClass}></span>
      {config.label}
    </Badge>
  );
};

export default StatusIndicator;