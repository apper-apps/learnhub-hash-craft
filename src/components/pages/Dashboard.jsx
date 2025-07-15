import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/organisms/CourseCard";
import PerformanceChart from "@/components/organisms/PerformanceChart";
import AssignmentTable from "@/components/organisms/AssignmentTable";
import ConnectionModal from "@/components/organisms/ConnectionModal";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import MetricCard from "@/components/molecules/MetricCard";
import assignmentsService from "@/services/api/assignmentsService";
import performanceService from "@/services/api/performanceService";
import exportService from "@/services/api/exportService";
import coursesService from "@/services/api/coursesService";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [lastSync, setLastSync] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState("");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  // Filter states
  const [selectedCourse, setSelectedCourse] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, assignmentsData, performanceData] = await Promise.all([
        coursesService.getAll(),
        assignmentsService.getAll(),
        performanceService.getAll()
      ]);

      setCourses(coursesData);
      setAssignments(assignmentsData);
      setPerformance(performanceData);
      setConnectionStatus("connected");
      setLastSync(new Date().toISOString());
    } catch (err) {
      setError(err.message || "Failed to load data");
      setConnectionStatus("disconnected");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (connectionStatus === "disconnected") {
      setIsConnectionModalOpen(true);
      return;
    }

    setConnectionStatus("syncing");
    try {
      await loadAllData();
      toast.success("Data synchronized successfully");
    } catch (err) {
      toast.error("Failed to sync data");
      setConnectionStatus("disconnected");
    }
  };

  const handleConnect = async (spreadsheetId) => {
    setIsConnecting(true);
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would validate the spreadsheet and set up the connection
      localStorage.setItem("spreadsheetId", spreadsheetId);
      
      await loadAllData();
      toast.success("Connected to Google Sheets successfully");
      setConnectionStatus("connected");
    } catch (err) {
      throw new Error("Failed to connect to Google Sheets");
    } finally {
      setIsConnecting(false);
    }
  };

const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
  };

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleClearFilters = () => {
    setSelectedCourse("");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleExport = async (type, format) => {
    setIsExporting(true);
    setExportType(`${type}-${format}`);
    setIsExportMenuOpen(false);
    
    try {
      const data = {
        assignments,
        courses,
        performance,
        metrics: calculateMetrics()
      };

      if (type === "progress") {
        if (format === "csv") {
          await exportService.exportProgressReportCSV(data);
          toast.success("Progress report exported as CSV successfully");
        } else if (format === "pdf") {
          await exportService.exportProgressReportPDF(data);
          toast.success("Progress report exported as PDF successfully");
        }
      } else if (type === "grades") {
        if (format === "csv") {
          await exportService.exportGradeSummaryCSV(data);
          toast.success("Grade summary exported as CSV successfully");
        } else if (format === "pdf") {
          await exportService.exportGradeSummaryPDF(data);
          toast.success("Grade summary exported as PDF successfully");
        }
      }
    } catch (error) {
      toast.error(`Failed to export ${type} report: ${error.message}`);
    } finally {
      setIsExporting(false);
      setExportType("");
    }
  };

  const calculateMetrics = () => {
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(a => a.status === "completed").length;
    const overdue = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      return dueDate < new Date() && a.status !== "completed";
    }).length;

    const totalGrades = assignments.filter(a => a.grade).map(a => a.grade);
    const gpa = totalGrades.length > 0 
      ? (totalGrades.reduce((sum, grade) => sum + grade, 0) / totalGrades.length / 100 * 4).toFixed(2)
      : "0.00";

    const completionRate = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;

    const upcomingDeadlines = assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate >= now && dueDate <= sevenDaysFromNow && a.status !== "completed";
    }).length;

    return {
      gpa,
      completionRate,
      upcomingDeadlines,
      overdue
    };
  };

const filteredAssignments = assignments
    .filter(assignment => {
      // Search term filter
      if (searchTerm) {
        const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            assignment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;
      }

      // Course filter
      if (selectedCourse) {
        const courseTitle = courses.find(c => c.Id === parseInt(selectedCourse))?.title;
        if (courseTitle && assignment.courseTitle !== courseTitle) return false;
      }

      // Date range filter
      if (startDate || endDate) {
        const assignmentDate = new Date(assignment.dueDate);
        if (startDate && assignmentDate < new Date(startDate)) return false;
        if (endDate && assignmentDate > new Date(endDate)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "dueDate") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const filteredCourses = courses.filter(course => {
    // Search term filter
    if (searchTerm) {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Course filter
    if (selectedCourse) {
      if (course.Id !== parseInt(selectedCourse)) return false;
    }

    return true;
  });

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onSync={handleSync}
          lastSync={lastSync}
          isLoading={loading}
          onSearch={handleSearch}
          connectionStatus={connectionStatus}
        />
        <main className="container mx-auto px-6 py-8">
          <Loading type="dashboard" />
        </main>
      </div>
    );
  }

  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onSync={handleSync}
          lastSync={lastSync}
          isLoading={loading}
          onSearch={handleSearch}
          connectionStatus={connectionStatus}
        />
        <main className="container mx-auto px-6 py-8">
          <Error message={error} onRetry={loadAllData} />
        </main>
      </div>
    );
  }

return (
    <div className="min-h-screen bg-background">
      <Header
        onSync={handleSync}
        lastSync={lastSync}
        isLoading={loading}
        onSearch={handleSearch}
        connectionStatus={connectionStatus}
        renderExtraActions={() => (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isExporting}
              className="flex items-center space-x-2"
            >
              {isExporting ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Download" className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </>
              )}
            </Button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-700 border-b border-gray-100">
                    Export Options
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Progress Reports
                    </div>
                    <button
                      onClick={() => handleExport("progress", "csv")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                    >
                      <ApperIcon name="FileText" className="w-4 h-4" />
                      <span>Progress Report (CSV)</span>
                    </button>
                    <button
                      onClick={() => handleExport("progress", "pdf")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                    >
                      <ApperIcon name="FileImage" className="w-4 h-4" />
                      <span>Progress Report (PDF)</span>
                    </button>
                    
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-t border-gray-100 mt-2">
                      Grade Summaries
                    </div>
                    <button
                      onClick={() => handleExport("grades", "csv")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                    >
                      <ApperIcon name="FileText" className="w-4 h-4" />
                      <span>Grade Summary (CSV)</span>
                    </button>
                    <button
                      onClick={() => handleExport("grades", "pdf")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                    >
                      <ApperIcon name="FileImage" className="w-4 h-4" />
                      <span>Grade Summary (PDF)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      />

      <div className="flex">
        <FilterSidebar
          courses={courses}
          selectedCourse={selectedCourse}
          startDate={startDate}
          endDate={endDate}
          onCourseChange={handleCourseChange}
          onDateRangeChange={handleDateRangeChange}
          onClearFilters={handleClearFilters}
          isOpen={showFilters}
          onToggle={toggleFilters}
        />

        <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <MetricCard
            title="Current GPA"
            value={metrics.gpa}
            icon="Award"
            color="primary"
            delay={0.1}
          />
          <MetricCard
            title="Completion Rate"
            value={`${metrics.completionRate}%`}
            icon="CheckCircle"
            color="success"
            delay={0.2}
          />
          <MetricCard
            title="Upcoming Deadlines"
            value={metrics.upcomingDeadlines}
            icon="Clock"
            color="warning"
            delay={0.3}
          />
          <MetricCard
            title="Overdue"
            value={metrics.overdue}
            icon="AlertCircle"
            color="error"
            delay={0.4}
          />
        </motion.div>

        {/* Courses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard
                  key={course.Id}
                  course={course}
                  delay={index * 0.1}
                  onClick={() => {
                    // Navigate to course details
                    toast.info(`Navigating to ${course.title}`);
                  }}
                />
              ))}
            </div>
          ) : (
            <Empty
              icon="BookOpen"
              title="No courses found"
              description="No courses match your search criteria."
              actionText="Clear Search"
              onAction={() => setSearchTerm("")}
            />
          )}
        </motion.section>

        {/* Assignments */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Assignments</h2>
          {filteredAssignments.length > 0 ? (
            <AssignmentTable
              assignments={filteredAssignments.slice(0, 10)}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          ) : (
            <Empty
              icon="FileText"
              title="No assignments found"
              description="No assignments match your search criteria."
              actionText="Clear Search"
              onAction={() => setSearchTerm("")}
            />
          )}
        </motion.section>

        {/* Performance Chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PerformanceChart
            data={performance}
            title="Academic Performance"
          />
        </motion.section>
      </main>
</main>
      </div>

      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />
    </div>
  );
};

export default Dashboard;