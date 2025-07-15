import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FilterSidebar = ({ 
  courses, 
  selectedCourse, 
  startDate, 
  endDate, 
  onCourseChange, 
  onDateRangeChange, 
  onClearFilters,
  isOpen,
  onToggle 
}) => {
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  useEffect(() => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
  }, [startDate, endDate]);

  const handleDateRangeApply = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
  };

  const handleClearFilters = () => {
    setTempStartDate("");
    setTempEndDate("");
    onClearFilters();
  };

  const hasActiveFilters = selectedCourse || startDate || endDate;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Filter" size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {[selectedCourse, startDate, endDate].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -300,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 shadow-lg lg:shadow-none",
          "lg:w-64 lg:opacity-100 lg:translate-x-0",
          !isOpen && "lg:block hidden"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {[selectedCourse, startDate, endDate].filter(Boolean).length}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="lg:hidden"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {/* Course Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Filter by Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => onCourseChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Filter by Date Range
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDateRangeApply}
                  className="w-full"
                  disabled={!tempStartDate && !tempEndDate}
                >
                  Apply Date Range
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Active Filters
                </label>
                <div className="space-y-2">
                  {selectedCourse && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="text-sm text-gray-700">
                        Course: {courses.find(c => c.Id === parseInt(selectedCourse))?.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCourseChange("")}
                        className="p-1"
                      >
                        <ApperIcon name="X" size={12} />
                      </Button>
                    </div>
                  )}
                  {startDate && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="text-sm text-gray-700">
                        From: {new Date(startDate).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDateRangeChange("", endDate)}
                        className="p-1"
                      >
                        <ApperIcon name="X" size={12} />
                      </Button>
                    </div>
                  )}
                  {endDate && (
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                      <span className="text-sm text-gray-700">
                        To: {new Date(endDate).toLocaleDateString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDateRangeChange(startDate, "")}
                        className="p-1"
                      >
                        <ApperIcon name="X" size={12} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {hasActiveFilters && (
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center space-x-2"
              >
                <ApperIcon name="RotateCcw" size={16} />
                <span>Clear All Filters</span>
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}
    </>
  );
};

export default FilterSidebar;