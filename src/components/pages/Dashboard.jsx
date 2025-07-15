import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import MetricCard from "@/components/molecules/MetricCard";
import CourseCard from "@/components/organisms/CourseCard";
import AssignmentTable from "@/components/organisms/AssignmentTable";
import PerformanceChart from "@/components/organisms/PerformanceChart";
import ConnectionModal from "@/components/organisms/ConnectionModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import coursesService from "@/services/api/coursesService";
import assignmentsService from "@/services/api/assignmentsService";
import performanceService from "@/services/api/performanceService";

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
      if (!searchTerm) return true;
      return (
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
    if (!searchTerm) return true;
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
      />

      <main className="container mx-auto px-6 py-8 space-y-8">
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